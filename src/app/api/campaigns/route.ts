import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, templateId, contacts } = body;

        if (!name || !templateId || !contacts || !Array.isArray(contacts)) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        // Create Campaign
        const campaign = await prisma.campaign.create({
            data: {
                userId: session.user.id,
                name,
                status: "IN_PROGRESS",
                // logging contacts
                logs: {
                    create: contacts.map((c: any) => ({
                        recipient: c.email,
                        status: "QUEUED",
                    }))
                }
            },
            include: {
                logs: true
            }
        });

        return NextResponse.json(campaign, { status: 201 });
    } catch (error) {
        console.error("Create Campaign Error:", error);
        return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const campaigns = await prisma.campaign.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            include: {
                _count: {
                    select: { logs: true }
                }
            }
        });
        return NextResponse.json(campaigns);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
    }
}
