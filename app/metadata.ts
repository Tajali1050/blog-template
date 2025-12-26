import { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadataKeywords = [
    "AI Automation",
    "RapidXAI",
    "Case Studies",
    "Client Success Stories",
    "Voice AI",
    "Cold Calling Automation",
    "Real Estate Automation",
    "AI Agents",
    "Business Automation",
    "ROI-Driven Solutions",
    "Enterprise SaaS",
    "Digital Marketing Automation",
]

export const metadata: Metadata = {
    title: siteConfig.name,
    description: siteConfig.description,
    keywords: metadataKeywords,
    authors: [
        {
            name: "RapidXAI Team",
            url: "https://rapidxai.com",
        },
    ],
    creator: "RapidXAI",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: siteConfig.url,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.name,
    },
    twitter: {
        card: "summary_large_image",
        title: siteConfig.name,
        description: siteConfig.description,
        creator: "@rapidxai",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};