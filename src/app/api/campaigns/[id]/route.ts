import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const campaign = await prisma.campaign.findUnique({
            where: {
                id,
                userId: session.user.id,
            },
            include: {
                logs: {
                    orderBy: {
                        sentAt: "desc",
                    },
                },
            },
        });

        if (!campaign) {
            return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
        }

        return NextResponse.json(campaign);
    } catch (error) {
        console.error("Fetch Campaign Error:", error);
        return NextResponse.json({ error: "Failed to fetch campaign" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Verify ownership
        const campaign = await prisma.campaign.findUnique({
            where: {
                id,
                userId: session.user.id,
            },
        });

        if (!campaign) {
            return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
        }

        await prisma.campaign.delete({
            where: {
                id,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete Campaign Error:", error);
        return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 });
    }
}
