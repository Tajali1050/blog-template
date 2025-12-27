"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import type { CaseStudy } from "@/lib/supabase/types";

interface CaseStudyListProps {
    caseStudies: CaseStudy[];
}

export function CaseStudyList({ caseStudies }: CaseStudyListProps) {
    const router = useRouter();
    const supabase = createClient();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) {
            return;
        }

        setDeletingId(id);

        const { error } = await supabase
            .from("case_studies")
            .delete()
            .eq("id", id);

        if (error) {
            alert(`Error deleting case study: ${error.message}`);
        } else {
            router.refresh();
        }

        setDeletingId(null);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block border border-border rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                                Title
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                                Tags
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                                Date
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                                Featured
                            </th>
                            <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {caseStudies.map((caseStudy) => (
                            <tr key={caseStudy.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {caseStudy.thumbnail && (
                                            <img
                                                src={caseStudy.thumbnail}
                                                alt=""
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                        )}
                                        <div>
                                            <div className="font-medium">{caseStudy.title}</div>
                                            <div className="text-sm text-muted-foreground truncate max-w-md">
                                                {caseStudy.description}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {caseStudy.tags?.slice(0, 2).map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-0.5 text-xs bg-muted rounded-md"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                        {caseStudy.tags && caseStudy.tags.length > 2 && (
                                            <span className="px-2 py-0.5 text-xs text-muted-foreground">
                                                +{caseStudy.tags.length - 2}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                    {formatDate(caseStudy.date)}
                                </td>
                                <td className="px-6 py-4">
                                    {caseStudy.featured && (
                                        <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-md">
                                            Featured
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/case-studies/${caseStudy.slug}`} target="_blank">
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/case-studies/${caseStudy.id}/edit`}>
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(caseStudy.id, caseStudy.title)}
                                            disabled={deletingId === caseStudy.id}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
                {caseStudies.map((caseStudy) => (
                    <div
                        key={caseStudy.id}
                        className="border border-border rounded-xl p-4 space-y-3 bg-card"
                    >
                        <div className="flex items-start gap-3">
                            {caseStudy.thumbnail && (
                                <img
                                    src={caseStudy.thumbnail}
                                    alt=""
                                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                />
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm line-clamp-2">{caseStudy.title}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    {formatDate(caseStudy.date)}
                                    {caseStudy.featured && (
                                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded">
                                            Featured
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {caseStudy.description}
                        </p>

                        {caseStudy.tags && caseStudy.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {caseStudy.tags.slice(0, 3).map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-0.5 text-xs bg-muted rounded-md"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center gap-2 pt-2 border-t border-border">
                            <Button variant="outline" size="sm" asChild className="flex-1">
                                <Link href={`/case-studies/${caseStudy.slug}`} target="_blank">
                                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                                    View
                                </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild className="flex-1">
                                <Link href={`/admin/case-studies/${caseStudy.id}/edit`}>
                                    <Pencil className="w-3.5 h-3.5 mr-1.5" />
                                    Edit
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(caseStudy.id, caseStudy.title)}
                                disabled={deletingId === caseStudy.id}
                                className="text-destructive hover:text-destructive border-destructive/30"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
