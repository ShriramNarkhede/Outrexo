"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Send, FileText, Settings, Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Campaigns", href: "/campaigns", icon: Send },
    { name: "Templates", href: "/templates", icon: FileText },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) setIsOpen(false);
            else setIsOpen(true);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 md:hidden bg-surface p-2 rounded-lg text-text-main border border-border"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Floating Sidebar Container */}
            <AnimatePresence mode="wait">
                {(isOpen || !isMobile) && (
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={cn(
                            "fixed left-6 top-6 bottom-6 w-64 glass-panel z-40 flex flex-col p-6 hidden md:flex",
                            // Mobile styles override
                            "md:flex"
                        )}
                        style={{ height: 'calc(100vh - 48px)' }}
                    >
                        {/* Logo */}
                        <div className="mb-10 flex items-center gap-3 px-2">
                            <Image
                                src="/images/outrexo.png"
                                alt="Outrexo Logo"
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded-full"
                            />
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                Outrexo
                            </h1>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 space-y-2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative",
                                            isActive
                                                ? "sidebar-link-active"
                                                : "text-text-muted hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <Icon size={20} className={cn("transition-colors relative z-10", isActive ? "text-white" : "text-text-muted group-hover:text-white")} />
                                        <span className="font-medium relative z-10">{item.name}</span>

                                        {/* Hover Glow Effect */}
                                        {!isActive && (
                                            <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Footer / User Profile */}
                        <div className="mt-auto border-t border-white/10 pt-6">
                            <Link
                                href="/api/auth/signout"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <LogOut size={20} />
                                <span className="font-medium">Sign Out</span>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Sidebar (Full height) */}
            <AnimatePresence>
                {(isOpen && isMobile) && (
                    <motion.div
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        className="fixed inset-y-0 left-0 w-64 bg-[#090504] border-r border-white/10 z-50 p-6 flex flex-col md:hidden"
                    >
                        {/* Logo */}
                        <div className="mb-10 flex items-center gap-3 px-2">
                            <Image
                                src="/images/outrexo.png"
                                alt="Outrexo Logo"
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded-full"
                            />
                            <h1 className="text-2xl font-bold text-white">Outrexo</h1>
                        </div>
                        {/* Nav Items (Duplicate for mobile simplify) */}
                        <nav className="flex-1 space-y-2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                            isActive ? "bg-primary/20 text-white" : "text-gray-400"
                                        )}
                                    >
                                        <Icon size={20} />
                                        <span>{item.name}</span>
                                    </Link>
                                )
                            })}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

