"use client";

import { useEffect, useRef } from "react";

export function SnowEffect() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const particles: { x: number; y: number; radius: number; speed: number; opacity: number }[] = [];
        const particleCount = 100; // Lightweight count

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2 + 1,
                speed: Math.random() * 1 + 0.5,
                opacity: Math.random() * 0.5 + 0.1,
            });
        }

        function animate() {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, width, height);

            ctx.fillStyle = "white";
            particles.forEach((p) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.globalAlpha = p.opacity;
                ctx.fill();

                p.y += p.speed;
                p.x += Math.sin(p.y * 0.01) * 0.5; // Slight drift

                if (p.y > height) {
                    p.y = -10;
                    p.x = Math.random() * width;
                }
            });

            requestAnimationFrame(animate);
        }

        animate();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0 opacity-40 mix-blend-screen"
            style={{ pointerEvents: "none" }}
        />
    );
}
