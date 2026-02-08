import { cn } from "@/lib/utils";
import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && <label className="text-sm font-medium text-text-muted">{label}</label>}
                <input ref={ref} className={cn("input-field", error && "border-red-500 focus:ring-red-500", className)} {...props} />
                {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
        );
    }
);

InputField.displayName = "InputField";
