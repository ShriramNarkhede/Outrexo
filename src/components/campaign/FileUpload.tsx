"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
// import * as XLSX from "xlsx"; // Removed for dynamic import
import { useCampaignStore, Contact } from "@/store/campaignStore";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Upload, FileSpreadsheet, X } from "lucide-react";

export function FileUpload() {
    const { file, setFile, setContacts, setStep } = useCampaignStore();

    const parseFile = (file: File) => {
        if (file.type === "text/csv") {
            Papa.parse(file, {
                header: true,
                complete: (results) => {
                    const validContacts = (results.data as any[])
                        .map(row => {
                            // Normalize keys to lowercase
                            const normalized: Contact = { email: "" };
                            Object.keys(row).forEach(key => {
                                const lowerKey = key.toLowerCase();
                                if (lowerKey.includes("mail")) normalized.email = row[key];
                                else if (lowerKey.includes("name")) normalized.name = row[key];
                                else if (lowerKey.includes("compan")) normalized.company = row[key];
                                else if (lowerKey.includes("role") || lowerKey.includes("position")) normalized.role = row[key];
                                else normalized[key] = row[key];
                            });
                            return normalized;
                        })
                        .filter((c: Contact) => c.email && c.email.includes("@")); // Basic validation

                    setContacts(validContacts);
                },
            });
        } else {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const data = e.target?.result;
                const XLSX = await import("xlsx");
                const workbook = XLSX.read(data, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(sheet);

                const validContacts = (json as any[])
                    .map(row => {
                        const normalized: Contact = { email: "" };
                        Object.keys(row).forEach(key => {
                            const lowerKey = key.toLowerCase();
                            if (lowerKey.includes("mail")) normalized.email = row[key];
                            else if (lowerKey.includes("name")) normalized.name = row[key];
                            else if (lowerKey.includes("compan")) normalized.company = row[key];
                            else if (lowerKey.includes("role") || lowerKey.includes("position")) normalized.role = row[key];
                            else normalized[key] = row[key];
                        });
                        return normalized;
                    })
                    .filter((c: Contact) => c.email && c.email.includes("@"));

                setContacts(validContacts);
            };
            reader.readAsBinaryString(file);
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const uploadedFile = acceptedFiles[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            parseFile(uploadedFile);
        }
    }, [setFile, setContacts]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "text/csv": [".csv"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
        },
        maxFiles: 1,
    });

    if (file) {
        return (
            <GlassPanel className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/20 rounded-lg text-green-500">
                        <FileSpreadsheet size={24} />
                    </div>
                    <div>
                        <p className="font-bold">{file.name}</p>
                        <p className="text-sm text-text-muted">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                </div>
                <button
                    onClick={() => { setFile(null); setContacts([]); }}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    aria-label="Remove file"
                >
                    <X size={20} />
                </button>
            </GlassPanel>
        );
    }

    return (
        <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-surfaceHighlight"
                }`}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4 text-text-muted">
                <div className="p-4 bg-surface rounded-full">
                    <Upload size={32} className="text-primary" />
                </div>
                <div>
                    <p className="text-lg font-bold text-text-main">Click to upload or drag and drop</p>
                    <p className="text-sm mt-1">CSV or Excel (XLSX)</p>
                </div>
            </div>
        </div>
    );
}
