import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CaseStudyList } from "@/components/admin/case-study-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
    const supabase = await createClient();

    const { data: caseStudies, error } = await supabase
        .from("case_studies")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Case Studies</h1>
                    <p className="text-muted-foreground text-sm sm:text-base mt-1">
                        Manage your case studies and client success stories
                    </p>
                </div>
                <Button asChild className="w-full sm:w-auto">
                    <Link href="/admin/case-studies/new" className="flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" />
                        New Case Study
                    </Link>
                </Button>
            </div>

            {error ? (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                    Error loading case studies: {error.message}
                </div>
            ) : caseStudies && caseStudies.length > 0 ? (
                <CaseStudyList caseStudies={caseStudies} />
            ) : (
                <div className="text-center py-12 sm:py-16 border border-dashed border-border rounded-xl">
                    <h3 className="text-lg font-medium">No case studies yet</h3>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Get started by creating your first case study
                    </p>
                    <Button asChild className="mt-4">
                        <Link href="/admin/case-studies/new">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Case Study
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
