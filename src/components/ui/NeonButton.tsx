import { cn } from "@/lib/utils";
import React from "react";

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "primary" | "secondary";
}

export function NeonButton({ children, className, variant = "primary", ...props }: NeonButtonProps) {
    return (
        <button
            className={cn(
                "btn-neon min-h-[44px] flex items-center justify-center",
                variant === "secondary" && "bg-secondary shadow-[0_0_15px_rgba(198,162,78,0.4)] hover:shadow-[0_0_25px_rgba(198,162,78,0.7)]",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
