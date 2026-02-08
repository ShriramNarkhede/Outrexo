import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// PUT, DELETE are already here. I need to add GET.
// I will rewrite the file to include GET, PUT, DELETE.

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try {
        const template = await prisma.template.findUnique({
            where: { id, userId: session.user.id },
        });

        if (!template) return NextResponse.json({ error: "Not found" }, { status: 404 });

        return NextResponse.json(template);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch template" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try {
        const body = await req.json();
        const { name, subject, body: htmlBody } = body;

        const template = await prisma.template.update({
            where: { id, userId: session.user.id },
            data: { name, subject, body: htmlBody },
        });

        return NextResponse.json(template);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update template" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try {
        await prisma.template.delete({
            where: { id, userId: session.user.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete template" }, { status: 500 });
    }
}
