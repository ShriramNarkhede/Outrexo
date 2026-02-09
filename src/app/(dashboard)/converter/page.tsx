"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
// Imports removed for dynamic loading
import type { WorkBook } from 'xlsx';
import { FileUp, FileText, Download, Loader2, FileSpreadsheet, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCampaignStore } from "@/store/campaignStore";

// Set worker source for PDF.js
// Worker configured dynamically

interface ExtractedData {
    fileName: string;
    rowCount: number;
    preview: string[];
    workbook: WorkBook | null;
}


import { useRouter } from "next/navigation";

// ...

export default function ConverterPage() {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ExtractedData | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setIsProcessing(true);
        setError(null);
        setResult(null);

        try {
            let textContent = "";

            if (file.type === "application/pdf") {
                const pdfjsLib = await import("pdfjs-dist");
                // Set worker source dynamically
                pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                const maxPages = pdf.numPages;
                const pageTexts: string[] = [];

                for (let i = 1; i <= maxPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContentObj = await page.getTextContent();
                    const pageStrings = textContentObj.items.map((item: any) => item.str);
                    pageTexts.push(pageStrings.join(" "));
                }
                textContent = pageTexts.join("\n");
            } else if (file.type === "text/plain") {
                textContent = await file.text();
            } else {
                throw new Error("Unsupported file type. Please upload .txt or .pdf files.");
            }

            // Process text into rows (simple newline split for now)
            const rows = textContent
                .split(/\r?\n/)
                .map(line => line.trim())
                .filter(line => line.length > 0)
                .map(line => [line]); // Array of arrays for XLSX

            if (rows.length === 0) {
                throw new Error("No text content found in file.");
            }

            // Create Worksheet using dynamic import
            // We need to keep the workbook state, so we import here but also store result properly
            // However, the result state expects an XLSX.WorkBook type. 
            // We can treat it as 'any' or import the type if possible, but type import might be stripped.
            // Let's just use it on the fly or keep the type import if it's only a type.

            const XLSX = await import("xlsx");
            const ws = XLSX.utils.aoa_to_sheet([["Content"], ...rows]); // Add Header
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

            setResult({
                fileName: file.name.replace(/\.[^/.]+$/, "") + ".xlsx",
                rowCount: rows.length,
                preview: rows.slice(0, 5).map(r => r[0]),
                workbook: wb
            });

        } catch (err: any) {
            console.error("Conversion Error:", err);
            setError(err.message || "Failed to process file.");
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "text/plain": [".txt"],
            "application/pdf": [".pdf"],
        },
        multiple: false,
    });

    const handleDownload = async () => {
        if (result && result.workbook) {
            const XLSX = await import("xlsx");
            XLSX.writeFile(result.workbook, result.fileName);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    File Converter
                </h1>
                <p className="text-text-muted">
                    Extract text from PDF or Text files and download as Excel for your campaigns.
                </p>
            </div>

            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group",
                    isDragActive
                        ? "border-primary bg-primary/5 scale-[1.02]"
                        : "border-border hover:border-primary/50 hover:bg-white/5"
                )}
            >
                <input {...getInputProps()} />
                <div className="w-16 h-16 rounded-full bg-surface-light flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    {isProcessing ? (
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    ) : (
                        <FileUp className={cn("w-8 h-8 transition-colors", isDragActive ? "text-primary" : "text-text-muted group-hover:text-primary")} />
                    )}
                </div>
                {isProcessing ? (
                    <p className="text-lg font-medium text-text-main">Processing file...</p>
                ) : (
                    <>
                        <p className="text-lg font-medium text-text-main mb-2">
                            {isDragActive ? "Drop the file here" : "Drag & drop or click to upload"}
                        </p>
                        <p className="text-sm text-text-muted">
                            Supports .txt and .pdf files
                        </p>
                    </>
                )}
            </div>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3"
                    >
                        <AlertCircle size={20} />
                        <p>{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Result Card */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass-panel p-6 rounded-2xl space-y-6 border border-border"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-green-500/10 text-green-400">
                                    <FileSpreadsheet size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-text-main">Conversion Ready</h3>
                                    <p className="text-sm text-text-muted">{result.rowCount} rows extract</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
                                >
                                    <Download size={18} />
                                    Download Excel
                                </button>
                                <button
                                    onClick={async () => {
                                        if (result && result.workbook) {
                                            const XLSX = await import("xlsx");
                                            // Generate Excel file buffer
                                            const excelBuffer = XLSX.write(result.workbook, { bookType: 'xlsx', type: 'array' });
                                            const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                                            const excelFile = new File([excelBlob], result.fileName, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

                                            // Convert rows to contacts (Get ALL rows from workbook, not just preview)
                                            const firstSheetName = result.workbook.SheetNames[0];
                                            const worksheet = result.workbook.Sheets[firstSheetName];
                                            const allRows = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });

                                            const contacts = allRows
                                                .flat() // Flatten in case of multiple columns or just to be safe with mapping
                                                .map((cell: any) => (cell?.toString() || "").trim())
                                                .filter((email: string) => email.includes("@"))
                                                .map((email: string) => ({ email }));

                                            useCampaignStore.getState().setFile(excelFile);
                                            useCampaignStore.getState().setContacts(contacts);

                                            // Navigation with query param to prevent store reset
                                            router.push("/campaigns/new?from=converter");
                                        }
                                    }}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-surfaceHighlight text-white rounded-xl font-medium hover:bg-white/10 transition-colors border border-white/10"
                                >
                                    Proceed to Campaign
                                </button>
                            </div>
                        </div>

                        <div className="bg-surface rounded-xl p-4 border border-border/50">
                            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Preview (First 5 rows)</h4>
                            <div className="space-y-2">
                                {result.preview.map((line, i) => (
                                    <div key={i} className="flex gap-3 text-sm">
                                        <span className="text-text-muted w-6 text-right font-mono opacity-50">{i + 1}</span>
                                        <span className="text-text-main truncate">{line}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
