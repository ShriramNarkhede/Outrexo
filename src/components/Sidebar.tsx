"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Send, FileText, Settings, Menu, X, LogOut, FileUp, Info} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Campaigns", href: "/campaigns", icon: Send },
    { name: "Templates", href: "/templates", icon: FileText },
    { name: "Converter", href: "/converter", icon: FileUp },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "About me", href: "/about", icon: Info },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024); // lg breakpoint
            if (window.innerWidth < 1024) setIsOpen(false);
            else setIsOpen(true);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        navItems.forEach((item) => {
            router.prefetch(item.href);
        });
    }, [router]);

    return (
        <>
            {/* Mobile Toggle */}
            {/* Mobile Top Navbar */}
            <div className="fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-4 bg-[#090504]/80 backdrop-blur-md border-b border-white/10 lg:hidden">
                <div className="flex items-center gap-2">
                    <Image
                        src="/images/Outrexo1.png"
                        alt="Outrexo"
                        width={32}
                        height={40}
                        className="object-contain"
                    />
                    <span className="text-lg font-bold">Outrexo</span>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-text-muted hover:text-white transition-colors"
                >
                    {/* <Menu size={24} /> */}

                   {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Floating Sidebar Container */}
            <AnimatePresence mode="wait">
                {(isOpen || !isMobile) && (
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={cn(
                            "fixed left-6 top-6 bottom-6 w-64 glass-panel z-40 flex flex-col p-6 hidden lg:flex", // Visible only on LG+
                        )}
                        style={{ height: 'calc(100vh - 48px)' }}
                    >
                        {/* Logo */}
                        <div className="mb-5 flex items-center justify-center">
                            <Image
                                src="/images/OutrexoP.png"
                                alt="Outrexo Logo"
                                width={128}
                                height={128}
                                className="w-28 h-28 object-contain"
                            />
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
                                href="/signout"
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
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed inset-y-0 left-0 w-80 bg-[#090504]/90 backdrop-blur-xl border-r border-white/10 z-[60] p-6 flex flex-col lg:hidden shadow-2xl"
                    >
                        {/* Mobile Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center justify-center ml-4">
                                <Image
                                    src="/images/Outrexo1.png"
                                    alt="Outrexo Logo"
                                    width={36}
                                    height={36}
                                    className="object-contain"
                                />
                                <span className="text-xl font-bold ml-2">Outrexo</span>
                                </div>
                        </div>

                        {/* Nav Items */}
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
                                            isActive ? "bg-primary/20 text-white" : "text-text-muted hover:text-white"
                                        )}
                                    >
                                        <Icon size={20} />
                                        <span>{item.name}</span>
                                    </Link>
                                )
                            })}
                        </nav>

                        {/* Footer / User Profile */}
                        <div className="mt-auto border-t border-white/10 pt-6">
                            <Link
                                href="/signout"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <LogOut size={20} />
                                <span className="font-medium">Sign Out</span>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
