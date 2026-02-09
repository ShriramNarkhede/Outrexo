
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { encrypt } from "@/lib/crypto";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { host, port, user, password } = body;

        // 1. Validation
        if (!host || !port || !user || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 2. Verify Connection
        const transporter = nodemailer.createTransport({
            host,
            port: Number(port),
            secure: Number(port) === 465, // true for 465, false for other ports
            auth: {
                user,
                pass: password,
            },
        });

        await transporter.verify();

        // 3. Encrypt Password
        const { iv, content } = encrypt(password);

        // 4. Save to DB
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                smtpHost: host,
                smtpPort: Number(port),
                smtpUser: user,
                smtpSecure: Number(port) === 465,
                smtpPassword: content,
                smtpIV: iv,
            },
        });

        return NextResponse.json({ success: true, message: "SMTP credentials verified and saved." });

    } catch (error: any) {
        console.error("SMTP Setup Error:", error);
        return NextResponse.json({
            error: "Failed to verify SMTP connection. Please check your credentials.",
            details: error.message
        }, { status: 400 });
    }
}
