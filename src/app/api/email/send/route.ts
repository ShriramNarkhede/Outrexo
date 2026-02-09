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


        // 1. Try Google OAuth Strategy
        if (account && account.refresh_token) {
            try {
                const oauth2Client = new google.auth.OAuth2(
                    process.env.GOOGLE_CLIENT_ID,
                    process.env.GOOGLE_CLIENT_SECRET
                );

                oauth2Client.setCredentials({
                    access_token: account.access_token,
                    refresh_token: account.refresh_token,
                    expiry_date: account.expires_at ? account.expires_at * 1000 : undefined,
                });

                // Token refresh listener
                oauth2Client.on('tokens', async (tokens) => {
                    if (tokens.access_token) {
                        await prisma.account.update({
                            where: { id: account.id },
                            data: {
                                access_token: tokens.access_token,
                                expires_at: tokens.expiry_date ? Math.floor(tokens.expiry_date / 1000) : undefined,
                                refresh_token: tokens.refresh_token ?? undefined
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
                    requestBody: { raw: encodedMessage },
                });

                // OAuth Success
                await logEmail(logId, campaignId, "SENT");
                return NextResponse.json({ success: true, method: "oauth" });

            } catch (oauthError: any) {
                console.warn("OAuth Send Failed, trying fallback...", oauthError.message);
                // Continue to fallback
            }
        }

        // 2. Try Manual SMTP Strategy (Fallback)
        // Fetch full user with SMTP fields
        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        if (user?.smtpHost && user?.smtpUser && user?.smtpPassword && user?.smtpIV) {
            try {
                const { decrypt } = await import("@/lib/crypto"); // Dynamic import to avoid circular dep if any, though not expected here
                const password = decrypt({ iv: user.smtpIV, content: user.smtpPassword });

                const transporter = (await import("nodemailer")).default.createTransport({
                    host: user.smtpHost,
                    port: user.smtpPort || 587,
                    secure: user.smtpSecure ?? true,
                    auth: {
                        user: user.smtpUser,
                        pass: password,
                    },
                });

                await transporter.sendMail({
                    from: user.smtpUser, // Or user.email if allowed
                    to,
                    subject,
                    html: htmlBody,
                });

                // SMTP Success
                await logEmail(logId, campaignId, "SENT");
                return NextResponse.json({ success: true, method: "smtp" });

            } catch (smtpError: any) {
                console.error("SMTP Send Failed:", smtpError);
                // Both failed
                await logEmail(logId, campaignId, "FAILED", smtpError.message || "Both OAuth and SMTP failed");
                return NextResponse.json({ error: "Failed to send email via OAuth and SMTP.", details: smtpError.message }, { status: 500 });
            }
        }

        // If we reach here, no valid configuration was found or OAuth failed and no SMTP config existed
        await logEmail(logId, campaignId, "FAILED", "No valid email configuration found");
        return NextResponse.json({ error: "No email configuration found. Please connect Gmail or add SMTP credentials." }, { status: 400 });

    } catch (error: any) {
        console.error("Email Send Error:", error);
        await logEmail(logId, campaignId, "FAILED", error.message);
        return NextResponse.json({ error: error.message || "Failed to send email" }, { status: 500 });
    }
}

// Helper to update logs
async function logEmail(logId: string | undefined, campaignId: string | undefined, status: string, error?: string) {
    if (logId) {
        await prisma.emailLog.update({
            where: { id: logId },
            data: {
                status,
                error: error || null,
                sentAt: status === "SENT" ? new Date() : undefined
            }
        });

        if (campaignId) {
            if (status === "SENT") {
                await prisma.campaign.update({
                    where: { id: campaignId },
                    data: { sentCount: { increment: 1 } }
                });
            } else if (status === "FAILED") {
                await prisma.campaign.update({
                    where: { id: campaignId },
                    data: { failCount: { increment: 1 } }
                });
            }
        }
    }
}
