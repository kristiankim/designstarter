"use client";

import { Questionnaire } from "@/components/questionnaire";
import { LoadingScreen } from "@/components/loading-screen";
import { ResultsView } from "@/components/results-view";
import { useDesignStarterStore } from "@/lib/store";
import { generateSystem, GenerationResult } from "@/lib/generator";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Page() {
    const { answers, reset, seeds, refreshSection } = useDesignStarterStore();
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<GenerationResult | null>(null);
    const [hasHydrated, setHasHydrated] = useState(false);

    // Handle hydration from persisted storage
    useEffect(() => {
        setHasHydrated(true);
    }, []);

    const handleGenerate = () => {
        setIsGenerating(true);
    };

    const onLoadingComplete = () => {
        const newResult = generateSystem(answers, seeds);
        setResult(newResult);
        setIsGenerating(false);
    };

    const handleRefresh = (section?: 'typography' | 'color') => {
        if (section) {
            refreshSection(section);
        } else {
            refreshSection('typography');
            refreshSection('color');
        }
    };

    // Keep results in sync with seeds
    useEffect(() => {
        if (result) {
            setResult(generateSystem(answers, seeds));
        }
    }, [seeds, answers]);

    const handleReset = () => {
        reset();
        setResult(null);
        setIsGenerating(false);
    };

    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-primary/10">
            <AnimatePresence mode="wait">
                {!hasHydrated ? null : isGenerating ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <LoadingScreen
                            rationale={generateSystem(answers, seeds).rationale}
                            onComplete={onLoadingComplete}
                        />
                    </motion.div>
                ) : result ? (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <ResultsView
                            result={result}
                            onRefresh={handleRefresh}
                            onReset={handleReset}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="questionnaire"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center min-h-[80vh]"
                    >
                        <Questionnaire onGenerate={handleGenerate} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Decor */}
            {!result && !isGenerating && (
                <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                </div>
            )}
        </main>
    );
}