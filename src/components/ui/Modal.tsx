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
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.3 }}
                            className={cn(
                                "relative w-full max-w-lg glass-panel p-6 shadow-2xl pointer-events-auto",
                                "border border-white/10 rounded-2xl bg-[#090504]/90"
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
