import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session = await auth();
    console.log("DEBUG: GET /api/templates session:", session);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const templates = await prisma.template.findMany({
            where: { userId: session.user.id },
            orderBy: { updatedAt: "desc" },
        });
        return NextResponse.json(templates);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();
    console.log("DEBUG: POST /api/templates session:", session);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, subject, body: htmlBody } = body;

        if (!name || !subject || !htmlBody) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const template = await prisma.template.create({
            data: {
                userId: session.user.id,
                name,
                subject,
                body: htmlBody,
            },
        });

        return NextResponse.json(template, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
    }
}
