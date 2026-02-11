"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

interface DeleteTemplateButtonProps {
    templateId: string;
    templateName: string;
}

export function DeleteTemplateButton({ templateId, templateName }: DeleteTemplateButtonProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/templates/${templateId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to delete template");
            }

            setShowDeleteModal(false);
            router.refresh();
        } catch (error) {
            console.error("Failed to delete template:", error);
            setIsDeleting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowDeleteModal(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-medium text-text-muted"
                aria-label={`Delete template ${templateName}`}
            >
                <Trash2 size={16} /> Delete
            </button>

            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Template"
                description={`Are you sure you want to delete "${templateName}"? This action cannot be undone.`}
                footer={
                    <div className="flex justify-end gap-3 w-full">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="px-4 py-2 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2"
                        >
                            {isDeleting && <Loader2 size={16} className="animate-spin" />}
                            Delete Permanently
                        </button>
                    </div>
                }
            />
        </>
    );
}
