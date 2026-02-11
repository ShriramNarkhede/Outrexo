
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client for OpenRouter

export async function POST(req: Request) {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY || process.env.DeepSeek_R1_api_key;

        if (!apiKey) {
            console.error("Missing OPENROUTER_API_KEY");
            return NextResponse.json(
                { error: "Server configuration error: Missing API Key" },
                { status: 500 }
            );
        }

        // Initialize OpenAI client for OpenRouter
        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: apiKey,
            defaultHeaders: {
                "HTTP-Referer": "http://localhost:3000", // Update for production if needed
                "X-Title": "Outrexo",
            },
        });

        const { prompt, tone } = await req.json();

        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt is required" },
                { status: 400 }
            );
        }

        const systemPrompt = `You are an expert email copywriter.
- Output ONLY valid HTML body content (use <p>, <br>, <strong>).
- Do NOT include a subject line.
- Use placeholders: {{Name}}, {{Company}}, {{Role}}.
- Do NOT output markdown ticks (\`\`\`html), just the raw code.
- Tone: ${tone || "Professional"}.
- IMPORTANT: If you generate a <think> block, keep it separate or I will strip it.`;

        // Try primary model (DeepSeek R1 Free)
        try {
            const completion = await openai.chat.completions.create({
                model: "deepseek/deepseek-r1:free",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Write an email about: "${prompt}"` }
                ],
            });

            let content = completion.choices[0]?.message?.content || "";

            // Remove <think> block
            content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
            content = content.replace(/```html/g, '').replace(/```/g, '').trim();

            return NextResponse.json({ content });

        } catch (error: any) {
            console.warn("Primary model failed (deepseek-r1:free). Trying fallback...");

            // Fallback 1: Try DeepSeek R1 (standard, sometimes free/credits)
            try {
                const completion = await openai.chat.completions.create({
                    model: "deepseek/deepseek-r1",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: `Write an email about: "${prompt}"` }
                    ],
                });

                let content = completion.choices[0]?.message?.content || "";
                content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
                content = content.replace(/```html/g, '').replace(/```/g, '').trim();

                return NextResponse.json({ content });
            } catch (fallbackError) {
                console.warn("DeepSeek R1 Standard failed. Trying final fallback...");

                // Fallback 2: Google Gemini (High availability free model)
                // Using a reliable model ID: google/gemini-2.0-flash-exp:free or meta-llama/llama-3.2-3b-instruct:free
                const completion = await openai.chat.completions.create({
                    model: "google/gemini-2.0-flash-exp:free",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: `Write an email about: "${prompt}"` }
                    ],
                });

                let content = completion.choices[0]?.message?.content || "";
                content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
                content = content.replace(/```html/g, '').replace(/```/g, '').trim();

                return NextResponse.json({ content });
            }
        }

    } catch (error: unknown) {
        console.error("AI Generation Error:", error);

        const status = (error as { status?: number })?.status;

        // Handle OpenRouter rate limits or busy states
        if (status === 429 || status === 503) {
            return NextResponse.json(
                { error: "AI is currently busy, please try again in a moment." },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { error: "Failed to generate email." },
            { status: 500 }
        );
    }
}
