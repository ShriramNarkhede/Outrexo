import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TemplateForm } from "@/components/TemplateForm";
import { redirect, notFound } from "next/navigation";

export default async function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/api/auth/signin");
    }

    const { id } = await params;
    const template = await prisma.template.findUnique({
        where: { id, userId: session.user.id },
    });

    if (!template) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Edit Template</h1>
            <TemplateForm initialData={template} isEditing />
        </div>
    );
}
