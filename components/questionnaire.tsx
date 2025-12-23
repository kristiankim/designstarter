"use client";

import { useDesignStarterStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Questionnaire({ onGenerate }: { onGenerate: () => void }) {
    const { step, setStep, answers } = useDesignStarterStore();
    const [isGenerating, setIsGenerating] = useState(false);

    const handleNext = () => {
        if (step < 4) {
            setStep(step + 1);
        } else {
            // Check if all necessary answers are provided
            if (answers.productType && answers.feel && answers.constraint && answers.projectName) {
                onGenerate();
            } else {
                alert("Please complete all steps before generating.");
            }
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    return (
        <div className="max-w-2xl mx-auto w-full px-6 py-12 min-h-[600px] flex flex-col">
            <div className="mb-8 flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Step {step} of 4
                    </h2>
                    <div className="h-1.5 w-64 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary"
                            initial={{ width: `${(step - 1) * 25}%` }}
                            animate={{ width: `${step * 25}%` }}
                            transition={{ duration: 0.5, ease: "circOut" }}
                        />
                    </div>
                </div>
            </div>

            <div className="flex-1 relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="w-full"
                    >
                        {step === 1 && <StepOne />}
                        {step === 2 && <StepTwo />}
                        {step === 3 && <StepThree />}
                        {step === 4 && <StepFour />}
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="mt-12 flex items-center justify-between border-t pt-8">
                {step > 1 ? (
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                ) : (
                    <div className="w-[90px]" /> // Placeholder to maintain layout when back button is hidden
                )}
                <Button
                    onClick={handleNext}
                    className="gap-2 px-8"
                    disabled={step === 4 && !answers.projectName}
                >
                    {step === 4 ? "Generate" : "Next"}
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

function StepOne() {
    const { answers, setProductType, updateAdvanced } = useDesignStarterStore();
    const [showAdvanced, setShowAdvanced] = useState(false);

    const options = [
        { id: 'marketing', label: 'Marketing / Landing', description: 'Focus on brand and impact' },
        { id: 'consumer', label: 'Consumer App', description: 'Content-first experience' },
        { id: 'saas', label: 'SaaS Dashboard', description: 'Data-heavy utility' },
        { id: 'ecommerce', label: 'E-commerce', description: 'Shopping & conversion' },
        { id: 'devtool', label: 'Developer Tool', description: 'Functional & efficient' },
        { id: 'internal', label: 'Internal Tool', description: 'Optimized for power users' },
    ];

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">What are you designing?</h1>
                <p className="text-muted-foreground">This helps us infer density and hierarchy needs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => setProductType(opt.id as any)}
                        className={`flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all hover:border-primary/50 ${answers.productType === opt.id ? "border-primary bg-primary/5" : "border-secondary bg-background"
                            }`}
                    >
                        <span className="font-semibold">{opt.label}</span>
                        <span className="text-sm text-muted-foreground">{opt.description}</span>
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {!showAdvanced ? (
                    <button
                        onClick={() => setShowAdvanced(true)}
                        className="text-xs font-semibold text-primary underline-offset-4 hover:underline"
                    >
                        Show advanced
                    </button>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl border bg-secondary/30 space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Primary surface</label>
                            <select
                                className="text-sm bg-transparent border-b border-primary/20 outline-none focus:border-primary cursor-pointer font-medium"
                                value={answers.advanced.primarySurface}
                                onChange={(e) => updateAdvanced({ primarySurface: e.target.value as any })}
                            >
                                <option value="responsive">Responsive-equal</option>
                                <option value="mobile">Mobile-first</option>
                                <option value="desktop">Desktop-first</option>
                            </select>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

function StepTwo() {
    const { answers, setFeel, updateAdvanced } = useDesignStarterStore();

    const options = [
        { id: 'calm', label: 'Calm & trustworthy', description: 'Stable and reassuring' },
        { id: 'bold', label: 'Bold & energetic', description: 'Confident and striking' },
        { id: 'elegant', label: 'Elegant & premium', description: 'Sophisticated and refined' },
        { id: 'playful', label: 'Playful & friendly', description: 'Welcoming and fun' },
        { id: 'technical', label: 'Technical & precise', description: 'Sharp and functional' },
    ];

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">What should the product feel like?</h1>
                <p className="text-muted-foreground">This decides visual voice: font, color, and spacing.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => setFeel(opt.id as any)}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all hover:border-primary/50 ${answers.feel === opt.id ? "border-primary bg-primary/5" : "border-secondary bg-background"
                            }`}
                    >
                        <div className="flex flex-col">
                            <span className="font-semibold">{opt.label}</span>
                            <span className="text-sm text-muted-foreground">{opt.description}</span>
                        </div>
                        {answers.feel === opt.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </button>
                ))}
            </div>

            <div className="p-4 rounded-xl border bg-secondary/30 space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                        <span>Brand Vibe (Advanced)</span>
                        <span>{answers.advanced.brandVibe === 0 ? "Classic" : answers.advanced.brandVibe === 1 ? "Neutral" : "Trendy"}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="2"
                        step="1"
                        value={answers.advanced.brandVibe}
                        onChange={(e) => updateAdvanced({ brandVibe: parseInt(e.target.value) })}
                        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                </div>
            </div>
        </div>
    );
}

function StepThree() {
    const { answers, setConstraint, updateAdvanced } = useDesignStarterStore();

    const options = [
        { id: 'standard', label: 'Standard', description: 'Good defaults for most users' },
        { id: 'high-contrast', label: 'High contrast', description: 'Older audiences / accessibility focus' },
        { id: 'dense', label: 'Dense information', description: 'Power users / data tools' },
        { id: 'touch-first', label: 'Touch-first', description: 'Mobile / Kiosk / On-the-go' },
    ];

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Any accessibility constraints?</h1>
                <p className="text-muted-foreground">This picks contrast targets, type sizing, and grid.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => setConstraint(opt.id as any)}
                        className={`flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all hover:border-primary/50 ${answers.constraint === opt.id ? "border-primary bg-primary/5" : "border-secondary bg-background"
                            }`}
                    >
                        <span className="font-semibold">{opt.label}</span>
                        <span className="text-sm text-muted-foreground">{opt.description}</span>
                    </button>
                ))}
            </div>

            <div className="p-4 rounded-xl border bg-secondary/30 space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Must support (Advanced)</label>
                    <div className="flex gap-2">
                        {['light', 'dark', 'both'].map((mode) => (
                            <button
                                key={mode}
                                onClick={() => updateAdvanced({ supportMode: mode as any })}
                                className={`px-3 py-1 text-xs rounded-full border transition-all ${answers.advanced.supportMode === mode ? "bg-primary text-primary-foreground border-primary" : "border-secondary bg-background hover:border-primary/50"
                                    }`}
                            >
                                {mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StepFour() {
    const { answers, setProjectName } = useDesignStarterStore();

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Naming your creation</h1>
                <p className="text-muted-foreground">What should we call this product or design system?</p>
            </div>

            <div className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Label htmlFor="project-name" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                        System Name
                    </Label>
                    <Input
                        id="project-name"
                        autoFocus
                        placeholder="e.g. Apollo, Horizon UI, Nexus"
                        value={answers.projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="text-2xl h-16 px-6 font-semibold border-2 focus:border-primary transition-all"
                    />
                </div>
                <p className="text-xs text-muted-foreground italic">
                    This will be the primary title for your generated design system.
                </p>
            </div>
        </div>
    );
}
