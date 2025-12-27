"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2, Upload, X } from "lucide-react";
import Link from "next/link";
import type { CaseStudy, CaseStudyInsert } from "@/lib/supabase/types";

// Dynamically import the Markdown editor to avoid SSR issues
const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
);

interface CaseStudyFormProps {
    initialData?: CaseStudy;
    mode: "create" | "edit";
}

export function CaseStudyForm({ initialData, mode }: CaseStudyFormProps) {
    const router = useRouter();
    const supabase = createClient();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        slug: initialData?.slug || "",
        title: initialData?.title || "",
        description: initialData?.description || "",
        date: initialData?.date || new Date().toISOString().split("T")[0],
        tags: initialData?.tags?.join(", ") || "",
        featured: initialData?.featured || false,
        read_time: initialData?.read_time || "",
        author: initialData?.author || "rapidxai",
        thumbnail: initialData?.thumbnail || "",
        content: initialData?.content || getDefaultContent(),
    });

    function getDefaultContent() {
        return `## Client Information

**Client:** Client Name — Company

**Industry:** Industry Name

**Project Value:** $X,XXX

**Platform:** [example.com](https://example.com)

---

## The Challenge

Describe the client's challenge here.

### Pain Points:

- Pain point 1
- Pain point 2
- Pain point 3

---

## The Solution

Describe the solution you provided.

### Key Features Implemented:

- **Feature 1:** Description
- **Feature 2:** Description
- **Feature 3:** Description

---

## Measurable Results

> "Client testimonial quote here."
>
> — **Client Name, Title**

---

## Technical Excellence

| Metric | Result |
|--------|--------|
| **Performance** | Value |
| **Cost** | Value |
| **Availability** | Value |
`;
    }

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    };

    const handleTitleChange = (title: string) => {
        setFormData((prev) => ({
            ...prev,
            title,
            slug: mode === "create" ? generateSlug(title) : prev.slug,
        }));
    };

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `thumbnails/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("case-studies")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from("case-studies")
                .getPublicUrl(filePath);

            setFormData((prev) => ({ ...prev, thumbnail: publicUrl }));
        } catch (err) {
            setError(`Error uploading image: ${err instanceof Error ? err.message : "Unknown error"}`);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const tagsArray = formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);

        const payload: CaseStudyInsert = {
            slug: formData.slug,
            title: formData.title,
            description: formData.description,
            date: formData.date,
            tags: tagsArray,
            featured: formData.featured,
            read_time: formData.read_time || null,
            author: formData.author || null,
            thumbnail: formData.thumbnail || null,
            content: formData.content,
        };

        try {
            if (mode === "create") {
                const { error } = await supabase.from("case_studies").insert(payload);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("case_studies")
                    .update(payload)
                    .eq("id", initialData!.id);
                if (error) throw error;
            }

            router.push("/admin");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/admin">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {mode === "create" ? "New Case Study" : "Edit Case Study"}
                    </h1>
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4 mr-2" />
                    )}
                    {mode === "create" ? "Create" : "Save Changes"}
                </Button>
            </div>

            {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="Case Study Title"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Slug *</label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                            required
                            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="case-study-slug"
                        />
                        <p className="text-xs text-muted-foreground">
                            URL: /case-studies/{formData.slug || "slug"}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description *</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                            required
                            rows={3}
                            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                            placeholder="Brief description of the case study..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Content *</label>
                        <div data-color-mode="auto" className="border border-border rounded-lg overflow-hidden">
                            <MDEditor
                                value={formData.content}
                                onChange={(value) => setFormData((prev) => ({ ...prev, content: value || "" }))}
                                height={500}
                                preview="edit"
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="border border-border rounded-xl p-6 space-y-6 bg-card">
                        <h2 className="font-medium">Metadata</h2>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Date *</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                                required
                                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tags</label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="Real Estate, Voice AI, Automation"
                            />
                            <p className="text-xs text-muted-foreground">Comma-separated</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Read Time</label>
                            <input
                                type="text"
                                value={formData.read_time}
                                onChange={(e) => setFormData((prev) => ({ ...prev, read_time: e.target.value }))}
                                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="5 min read"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Author</label>
                            <input
                                type="text"
                                value={formData.author}
                                onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="rapidxai"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="featured"
                                checked={formData.featured}
                                onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                                className="w-4 h-4 rounded border-border"
                            />
                            <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
                                Featured Case Study
                            </label>
                        </div>
                    </div>

                    <div className="border border-border rounded-xl p-6 space-y-4 bg-card">
                        <h2 className="font-medium">Thumbnail</h2>

                        {formData.thumbnail ? (
                            <div className="relative">
                                <img
                                    src={formData.thumbnail}
                                    alt="Thumbnail preview"
                                    className="w-full h-40 object-cover rounded-lg"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2"
                                    onClick={() => setFormData((prev) => ({ ...prev, thumbnail: "" }))}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                            >
                                {uploading ? (
                                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-muted-foreground" />
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Click to upload thumbnail
                                        </p>
                                    </>
                                )}
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailUpload}
                            className="hidden"
                        />

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Or enter URL</label>
                            <input
                                type="text"
                                value={formData.thumbnail}
                                onChange={(e) => setFormData((prev) => ({ ...prev, thumbnail: e.target.value }))}
                                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                placeholder="/thumbnails/image.png"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
