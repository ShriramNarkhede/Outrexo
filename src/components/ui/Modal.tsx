"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NeonButton } from "./NeonButton";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children?: React.ReactNode;
    footer?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, description, children, footer }: ModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 pointer-events-none">
                        <motion.div
                            initial={{ y: "100%", opacity: 0, scale: 1 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: "100%", opacity: 0, scale: 1 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className={cn(
                                "relative w-full max-w-lg glass-panel p-6 shadow-2xl pointer-events-auto",
                                "border-t border-x border-b-0 sm:border border-white/10",
                                "rounded-t-2xl rounded-b-none sm:rounded-2xl",
                                "bg-[#090504]/95 backdrop-blur-xl",
                                "max-h-[90vh] overflow-y-auto"
                            )}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-text-main">{title}</h2>
                                    {description && (
                                        <p className="mt-1 text-sm text-text-muted">{description}</p>
                                    )}
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-1 rounded-lg text-text-muted hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Body */}
                            {children && <div className="mb-6">{children}</div>}

                            {/* Footer */}
                            {(footer || !children) && (
                                <div className="flex justify-end gap-3 mt-6">
                                    {footer ? (
                                        footer
                                    ) : (
                                        <NeonButton onClick={onClose} className="px-6">
                                            OK
                                        </NeonButton>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
