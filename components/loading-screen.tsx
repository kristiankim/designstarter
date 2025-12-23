"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

interface LoadingScreenProps {
    rationale: string;
    onComplete: () => void;
}

export function LoadingScreen({ rationale, onComplete }: LoadingScreenProps) {
    const [step, setStep] = useState(0);
    const steps = [
        "Analyzing requirements...",
        "Defining typography scales...",
        "Generating color palettes...",
        "Calculating grid systems...",
        "Finalizing tokens..."
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setStep((prev) => {
                if (prev >= steps.length - 1) {
                    clearInterval(timer);
                    setTimeout(onComplete, 800);
                    return prev;
                }
                return prev + 1;
            });
        }, 600);

        return () => clearInterval(timer);
    }, [onComplete, steps.length]);

    return (
        <div className="fixed inset-0 bg-background flex flex-col items-center justify-center p-6 z-50">
            <div className="max-w-md w-full space-y-12 text-center">
                <div className="space-y-4">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto"
                    >
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </motion.div>
                    <h2 className="text-2xl font-bold tracking-tight">Building your design system</h2>
                    <motion.p
                        key={rationale}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-muted-foreground italic"
                    >
                        "{rationale}"
                    </motion.p>
                </div>

                <div className="space-y-4 text-left">
                    {steps.map((s, i) => (
                        <div key={s} className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${i < step ? "bg-primary border-primary text-primary-foreground" :
                                    i === step ? "border-primary text-primary animate-pulse" : "border-muted text-muted"
                                }`}>
                                {i < step ? <Check className="w-3 h-3" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                            </div>
                            <span className={`text-sm font-medium transition-colors ${i <= step ? "text-foreground" : "text-muted-foreground"
                                }`}>
                                {s}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="absolute bottom-12 left-0 right-0 flex justify-center">
                    <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.3, 1, 0.3],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                }}
                                className="w-1.5 h-1.5 rounded-full bg-primary"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
