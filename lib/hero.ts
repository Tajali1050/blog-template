import type { HeroStat, HomepageHero } from "./supabase/types";

export const DEFAULT_HERO_CONTENT: Pick<HomepageHero, "heading" | "subheading" | "description" | "stats"> = {
    heading: "RapidXAI Case Studies & Client Success Stories",
    subheading: "Proven Success Stories & Measurable Results",
    description: "Industries Transformed: Real Estate, Education, Digital Marketing, Enterprise SaaS",
    stats: [
        { label: "Successful Implementations", value: "$25,000+" },
        { label: "Annual Client Savings", value: "$500,000+" },
        { label: "Project Completion Rate", value: "100%" },
    ],
};

export function normalizeHeroStats(stats: unknown): HeroStat[] {
    if (!Array.isArray(stats)) return [];

    return stats
        .map((item) => {
            const label = typeof (item as { label?: unknown })?.label === "string" ? (item as { label: string }).label : null;
            const value = typeof (item as { value?: unknown })?.value === "string" ? (item as { value: string }).value : null;

            if (!label || !value) return null;
            return { label, value };
        })
        .filter(Boolean) as HeroStat[];
}

export function withHeroFallback(hero?: HomepageHero | null) {
    const stats = normalizeHeroStats(hero?.stats);

    return {
        heading: hero?.heading?.trim() || DEFAULT_HERO_CONTENT.heading,
        subheading: hero?.subheading?.trim() || DEFAULT_HERO_CONTENT.subheading,
        description: hero?.description?.trim() || DEFAULT_HERO_CONTENT.description,
        stats: stats.length > 0 ? stats : DEFAULT_HERO_CONTENT.stats,
    };
}

