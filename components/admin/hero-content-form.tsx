"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, RefreshCcw, Save, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { normalizeHeroStats } from "@/lib/hero";
import type { HeroStat, HomepageHero } from "@/lib/supabase/types";

interface HeroContentFormProps {
    initialData?: HomepageHero | null;
}

export function HeroContentForm({ initialData }: HeroContentFormProps) {
    const router = useRouter();
    const supabase = createClient();

    const initialHeading = initialData?.heading ?? "";
    const initialSubheading = initialData?.subheading ?? "";
    const initialDescription: string = initialData?.description ?? "";
    const initialStats =
        normalizeHeroStats(initialData?.stats).length > 0
            ? normalizeHeroStats(initialData?.stats)
            : [{ label: "", value: "" }];

    const [form, setForm] = useState<{
        heading: string;
        subheading: string;
        description: string;
        stats: HeroStat[];
    }>({
        heading: initialHeading,
        subheading: initialSubheading,
        description: initialDescription,
        stats: initialStats,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleStatChange = (index: number, field: keyof HeroStat, value: string) => {
        setForm((prev) => {
            const next = [...prev.stats];
            next[index] = { ...next[index], [field]: value };
            return { ...prev, stats: next };
        });
    };

    const addStat = () => {
        setForm((prev) => ({ ...prev, stats: [...prev.stats, { label: "", value: "" }] }));
    };

    const removeStat = (index: number) => {
        setForm((prev) => {
            const next = [...prev.stats];
            next.splice(index, 1);
            return { ...prev, stats: next.length > 0 ? next : [{ label: "", value: "" }] };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const sanitizedStats = form.stats
            .map((stat) => ({
                label: stat.label.trim(),
                value: stat.value.trim(),
            }))
            .filter((stat) => stat.label && stat.value);

        const payload = {
            id: initialData?.id || "default",
            heading: form.heading.trim(),
            subheading: form.subheading.trim(),
            description: (form.description ?? "").trim(),
            stats: sanitizedStats,
        };

        const { error: supabaseError } = await supabase
            .from("homepage_hero")
            .upsert(payload, { onConflict: "id" });

        if (supabaseError) {
            setError(supabaseError.message);
        } else {
            setSuccess("Homepage hero content saved");
            router.refresh();
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-end gap-2">
                <Button type="submit" disabled={loading} size="sm">
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save
                </Button>
            </div>

            {error && (
                <div className="p-2.5 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="p-2.5 rounded-lg border border-primary/40 bg-primary/10 text-primary text-sm">
                    {success}
                </div>
            )}

            <div className="space-y-3 border border-border rounded-lg p-4 bg-card">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Heading</label>
                    <input
                        type="text"
                        value={form.heading}
                        onChange={(e) => setForm((prev) => ({ ...prev, heading: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Hero heading"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Subheading</label>
                    <input
                        type="text"
                        value={form.subheading}
                        onChange={(e) => setForm((prev) => ({ ...prev, subheading: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Hero subheading"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Supporting description</label>
                    <textarea
                        value={form.description}
                        onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        rows={3}
                        placeholder="Short line under the subheading"
                    />
                </div>
            </div>

            <div className="border border-border rounded-lg p-4 bg-card space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium">Stats</h3>
                        <p className="text-sm text-muted-foreground">
                            These appear below the hero copy on the public page.
                        </p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addStat}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add stat
                    </Button>
                </div>

                <div className="space-y-3">
                    {form.stats.map((stat, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3 border border-border rounded-lg p-3 bg-background">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Label</label>
                                <input
                                    type="text"
                                    value={stat.label}
                                    onChange={(e) => handleStatChange(index, "label", e.target.value)}
                                    className="w-full px-3 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="Successful Implementations"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Value</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={stat.value}
                                        onChange={(e) => handleStatChange(index, "value", e.target.value)}
                                        className="w-full px-3 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        placeholder="$25,000+"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeStat(index)}
                                        className="text-destructive hover:text-destructive"
                                        aria-label="Remove stat"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </form>
    );
}

