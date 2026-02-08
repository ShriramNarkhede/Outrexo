import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse body once
    let body;
    try {
        body = await req.json();
    } catch (e) {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { to, subject, htmlBody, campaignId, logId } = body;

    if (!to || !subject || !htmlBody) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        // Get user's account to retrieve access token
        const account = await prisma.account.findFirst({
            where: { userId: session.user.id },
        });

        if (!account || !account.refresh_token) {
            // If refresh_token is missing, we can't refresh.
            // User should re-login.
            return NextResponse.json({ error: "Google account not fully linked or missing refresh token. Please re-login." }, { status: 400 });
        }

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        );

        oauth2Client.setCredentials({
            access_token: account.access_token,
            refresh_token: account.refresh_token,
            expiry_date: account.expires_at ? account.expires_at * 1000 : undefined,
        });

        // Refresh token if needed
        // googleapis automatically refreshes if refresh_token is present and access_token is expired or about to expire
        // However, we should save the new tokens back to DB if they change.

        // We can listen to 'tokens' event but it's cleaner to check explicitly or rely on library.
        // Let's force check or just proceed. The library handles rotation.
        // To save new tokens, we can wrap getAccessToken or listen to event.
        // For this implementation, we rely on automatic refresh for the request, but we might lose the new token if we don't capture it.
        // Let's try to capture it.

        oauth2Client.on('tokens', async (tokens) => {
            if (tokens.access_token) {
                await prisma.account.update({
                    where: { id: account.id },
                    data: {
                        access_token: tokens.access_token,
                        expires_at: tokens.expiry_date ? Math.floor(tokens.expiry_date / 1000) : undefined,
                        refresh_token: tokens.refresh_token ?? undefined // only if returned
                    }
                });
            }
        });

        const gmail = google.gmail({ version: "v1", auth: oauth2Client });

        // Construct raw email
        const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
        const messageParts = [
            `To: ${to}`,
            "Content-Type: text/html; charset=utf-8",
            "MIME-Version: 1.0",
            `Subject: ${utf8Subject}`,
            "",
            htmlBody,
        ];
        const message = messageParts.join("\n");
        const encodedMessage = Buffer.from(message)
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");

        await gmail.users.messages.send({
            userId: "me",
            requestBody: {
                raw: encodedMessage,
            },
        });

        // Update Log
        if (logId) {
            await prisma.emailLog.update({
                where: { id: logId },
                data: { status: "SENT", sentAt: new Date() }
            });

            // Update Campaign counts (Atomic increment)
            if (campaignId) {
                await prisma.campaign.update({
                    where: { id: campaignId },
                    data: { sentCount: { increment: 1 } }
                });
            }
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Email Send Error:", error);

        // Log failure
        if (logId) {
            await prisma.emailLog.update({
                where: { id: logId },
                data: { status: "FAILED", error: error.message || "Unknown error" }
            });
            if (campaignId) {
                await prisma.campaign.update({
                    where: { id: campaignId },
                    data: { failCount: { increment: 1 } }
                });
            }
        }

        return NextResponse.json({ error: error.message || "Failed to send email" }, { status: 500 });
    }
}
