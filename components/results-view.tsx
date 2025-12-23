"use client";

import { GenerationResult } from "@/lib/generator";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Download, Copy, Check, Layout, Columns, AppWindow } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDesignStarterStore } from "@/lib/store";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ResultsViewProps {
    result: GenerationResult;
    onRefresh: (section?: 'typography' | 'color') => void;
    onReset: () => void;
}

export function ResultsView({ result, onRefresh, onReset }: ResultsViewProps) {
    const { answers, gridOverrides, updateGridOverrides } = useDesignStarterStore();
    const [copiedToken, setCopiedToken] = useState(false);
    const [copiedHex, setCopiedHex] = useState<string | null>(null);

    // Format selections for header
    const selections = answers ? [
        answers.productType?.replace(/^\w/, (c) => c.toUpperCase()),
        answers.feel?.replace(/^\w/, (c) => c.toUpperCase()),
        answers.constraint?.replace(/^\w/, (c) => c.toUpperCase())
    ].filter(Boolean).join(' • ') : null;

    // Derive final grid tokens based on overrides
    const grid = {
        ...result.tokens.grid.desktop,
        columns: gridOverrides.columns ?? result.tokens.grid.desktop.columns,
        gutter: gridOverrides.gutter ?? result.tokens.grid.desktop.gutter,
        margin: gridOverrides.margin ?? result.tokens.grid.desktop.margin,
    };

    const handleExport = () => {
        const exportedTokens = {
            ...result.tokens,
            grid: {
                ...result.tokens.grid,
                desktop: grid,
                sidebar: gridOverrides.showSidebar ? "240px" : "0px"
            }
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportedTokens, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "design-tokens.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const copyTokens = () => {
        navigator.clipboard.writeText(JSON.stringify(result.tokens, null, 2));
        setCopiedToken(true);
        setTimeout(() => setCopiedToken(false), 2000);
    };

    const copyHex = (hex: string) => {
        navigator.clipboard.writeText(hex);
        setCopiedHex(hex);
        setTimeout(() => setCopiedHex(null), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto w-full px-6 py-12 space-y-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">{answers.projectName || "Your Starter System"}</h1>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{selections}</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => onRefresh()} className="gap-2">
                        <RefreshCcw className="w-4 h-4" />
                        Refresh All
                    </Button>
                    <Button onClick={handleExport} className="gap-2 shadow-sm">
                        <Download className="w-4 h-4" />
                        Export JSON
                    </Button>
                </div>
            </header>

            {/* Typography Section */}
            <section className="space-y-10">
                <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold">1. Typography</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRefresh('typography')}
                            className="h-8 text-xs gap-2 text-muted-foreground hover:text-primary transition-colors"
                        >
                            <RefreshCcw className="w-3 h-3" />
                            Refresh Type
                        </Button>
                    </div>
                    <Button variant="ghost" size="sm" onClick={copyTokens} className="text-xs gap-2">
                        {copiedToken ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                        Copy Tokens
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-10 p-8 rounded-3xl border bg-card/40 backdrop-blur-sm">
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">H1 Display</span>
                            <h1 style={{
                                fontFamily: result.tokens.typography.fontFamily.display || result.tokens.typography.fontFamily.base,
                                fontSize: result.tokens.typography.scale.h1,
                                fontWeight: 700,
                                lineHeight: result.tokens.typography.lineHeight.tight,
                                letterSpacing: result.tokens.typography.letterSpacing.tight
                            }}>
                                Stunning Visuals
                            </h1>
                        </div>

                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">H2 Heading</span>
                            <h2 style={{
                                fontFamily: result.tokens.typography.fontFamily.base,
                                fontSize: result.tokens.typography.scale.h2,
                                fontWeight: 600,
                                lineHeight: result.tokens.typography.lineHeight.snug
                            }}>
                                Secondary Headline
                            </h2>
                        </div>

                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">H3 Subheading</span>
                            <h3 style={{
                                fontFamily: result.tokens.typography.fontFamily.base,
                                fontSize: result.tokens.typography.scale.h3,
                                fontWeight: 500
                            }}>
                                Detailed description here
                            </h3>
                        </div>

                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Body Text</span>
                            <p style={{
                                fontFamily: result.tokens.typography.fontFamily.base,
                                fontSize: result.tokens.typography.scale.body,
                                lineHeight: result.tokens.typography.lineHeight.relaxed
                            }}>
                                This is a sample of your body text. It's designed to be legible and comfortable to read. The spacing and line height are optimized for the {result.family} family.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Body Small</span>
                                <p style={{ fontFamily: result.tokens.typography.fontFamily.base, fontSize: result.tokens.typography.scale.bodySmall }}>
                                    Compact text for metadata and sidebars.
                                </p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Helper / Caption</span>
                                <p style={{ fontFamily: result.tokens.typography.fontFamily.base, fontSize: result.tokens.typography.scale.helper, color: 'var(--muted-foreground)' }}>
                                    Small descriptive helper text.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border bg-background/50">
                        <table className="w-full text-sm">
                            <thead className="bg-secondary/40">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold">Token</th>
                                    <th className="px-4 py-3 text-left font-semibold">Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                <tr>
                                    <td className="px-4 py-2 font-mono text-[11px] text-muted-foreground">font.family.base</td>
                                    <td className="px-4 py-2 font-medium">{result.tokens.typography.fontFamily.base}</td>
                                </tr>
                                {result.tokens.typography.fontFamily.display && (
                                    <tr>
                                        <td className="px-4 py-2 font-mono text-[11px] text-muted-foreground">font.family.display</td>
                                        <td className="px-4 py-2 font-medium">{result.tokens.typography.fontFamily.display}</td>
                                    </tr>
                                )}
                                {Object.entries(result.tokens.typography.scale).map(([key, val]) => (
                                    <tr key={key}>
                                        <td className="px-4 py-2 font-mono text-[11px] text-muted-foreground">font.size.{key}</td>
                                        <td className="px-4 py-2 font-medium">{val}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td className="px-4 py-2 font-mono text-[11px] text-muted-foreground">line.height.relaxed</td>
                                    <td className="px-4 py-2 font-medium">{result.tokens.typography.lineHeight.relaxed}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Colors Section */}
            <section className="space-y-10">
                <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold">2. Colors</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRefresh('color')}
                            className="h-8 text-xs gap-2 text-muted-foreground hover:text-primary transition-colors"
                        >
                            <RefreshCcw className="w-3 h-3" />
                            Refresh Palette
                        </Button>
                    </div>
                    <span className="text-[10px] font-medium text-muted-foreground italic">Click hex to copy</span>
                </div>

                <div className="space-y-16">
                    <div className="space-y-6">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Primary & Complementary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { label: 'Primary', hex: result.tokens.colors.brand.primary },
                                { label: 'Secondary', hex: result.tokens.colors.brand.secondary },
                                { label: 'Tertiary', hex: result.tokens.colors.brand.tertiary },
                            ].map((c) => (
                                <div key={c.label} className="group space-y-4">
                                    <motion.button
                                        whileHover={{ y: -4, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => copyHex(c.hex)}
                                        className="w-full h-32 rounded-3xl shadow-lg relative overflow-hidden transition-all group-hover:shadow-primary/20"
                                        style={{ backgroundColor: c.hex }}
                                    >
                                        <AnimatePresence>
                                            {copiedHex === c.hex && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px]"
                                                >
                                                    <span className="px-3 py-1 rounded-full bg-white text-black text-xs font-bold shadow-xl flex items-center gap-2">
                                                        <Check className="w-3 h-3" /> Copied
                                                    </span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-xs font-bold tracking-tight">{c.label}</span>
                                        <button
                                            onClick={() => copyHex(c.hex)}
                                            className="font-mono text-[11px] text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            {c.hex}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Full Neutral Ramp</h3>
                        <div className="flex h-16 w-full rounded-2xl overflow-hidden border shadow-sm">
                            {result.tokens.colors.neutral.map((c, i) => (
                                <button
                                    key={i}
                                    onClick={() => copyHex(c)}
                                    className="flex-1 h-full transition-transform hover:scale-y-110 relative group"
                                    style={{ backgroundColor: c }}
                                >
                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-black text-white text-[9px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                        {c}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {Object.entries(result.tokens.colors.semantic).map(([key, val]) => (
                            <button
                                key={key}
                                onClick={() => copyHex(val)}
                                className="p-5 rounded-2xl border bg-card/30 hover:bg-card/60 transition-colors text-left flex flex-col gap-3 group relative"
                            >
                                <div className="w-5 h-5 rounded-full shadow-inner border border-black/5" style={{ backgroundColor: val }} />
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider block">{key}</span>
                                    <span className="text-[11px] font-mono text-muted-foreground">{val}</span>
                                </div>
                                <AnimatePresence>
                                    {copiedHex === val && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-2xl"
                                        >
                                            <Check className="w-4 h-4 text-green-500" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Grid Section - Updated to be Customizable */}
            <section className="space-y-10 pb-20 pt-20">
                <div className="border-b pb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">3. Layout & Grid</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Switch
                                id="show-sidebar"
                                checked={gridOverrides.showSidebar}
                                onCheckedChange={(checked) => updateGridOverrides({ showSidebar: checked })}
                            />
                            <Label htmlFor="show-sidebar" className="text-xs font-semibold cursor-pointer">Sidebar</Label>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Controls */}
                    <div className="space-y-8 lg:col-span-1">
                        <div className="p-6 rounded-2xl border bg-secondary/5 space-y-6">
                            <div className="space-y-4">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Columns</Label>
                                <div className="flex items-center gap-4">
                                    <Input
                                        type="number"
                                        min={1}
                                        max={24}
                                        value={grid.columns}
                                        onChange={(e) => updateGridOverrides({ columns: parseInt(e.target.value) || 1 })}
                                        className="w-20"
                                    />
                                    <span className="text-xs text-muted-foreground italic truncate">Desktop baseline</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Internal Gutter</Label>
                                <div className="flex items-center gap-3">
                                    <Input
                                        value={grid.gutter}
                                        onChange={(e) => updateGridOverrides({ gutter: e.target.value })}
                                        className="w-24 font-mono text-xs"
                                    />
                                    <div className="flex-1 h-px bg-border" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Outer Margin</Label>
                                <div className="flex items-center gap-3">
                                    <Input
                                        value={grid.margin}
                                        onChange={(e) => updateGridOverrides({ margin: e.target.value })}
                                        className="w-24 font-mono text-xs"
                                    />
                                    <div className="flex-1 h-px bg-border" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Spacing Scale</h3>
                            <div className="flex flex-wrap gap-2">
                                {result.tokens.grid.space.map((s, i) => (
                                    <div key={i} className="flex flex-col items-center gap-1 group">
                                        <div className="bg-primary/20 group-hover:bg-primary/40 transition-colors rounded-sm" style={{ width: s, height: "12px" }} />
                                        <span className="text-[8px] font-mono text-muted-foreground">{s}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Visualization */}
                    <div className="lg:col-span-2 relative aspect-[16/10] rounded-3xl border bg-card overflow-hidden shadow-2xl group">
                        <div className="absolute inset-0 flex">
                            {/* Optional Sidebar */}
                            <AnimatePresence>
                                {gridOverrides.showSidebar && (
                                    <motion.div
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: "20%", opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        className="border-r border-dashed border-primary/20 bg-primary/[0.02] flex items-center justify-center overflow-hidden"
                                    >
                                        <Layout className="w-5 h-5 text-primary/10" />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Main Content Area */}
                            <div className="flex-1 relative p-[var(--margin)]" style={{ "--margin": grid.margin } as any}>
                                <div className="absolute inset-[var(--margin)] flex gap-[var(--gutter)]" style={{ "--margin": grid.margin, "--gutter": grid.gutter } as any}>
                                    {Array.from({ length: grid.columns }).map((_, i) => (
                                        <div key={i} className="flex-1 bg-primary/[0.03] border-x border-primary/[0.08]" />
                                    ))}
                                </div>

                                {/* Placeholder Content */}
                                <div className="relative h-full w-full border border-dashed border-primary/20 rounded-xl flex flex-col items-center justify-center gap-4 bg-background/50 backdrop-blur-[1px]">
                                    <AppWindow className="w-8 h-8 text-primary/10" />
                                    <span className="text-[10px] font-bold text-primary/30 uppercase tracking-[0.3em]">
                                        {grid.columns} Column Layout
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-6 pt-12">
                    <Button variant="secondary" onClick={onReset} className="px-8 flex items-center gap-2">
                        Start from scratch
                    </Button>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-30">
                        End of System Report
                    </p>
                </div>
            </section>
        </div>
    );
}
