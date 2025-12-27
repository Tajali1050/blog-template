import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CaseStudyForm } from "@/components/admin/case-study-form";

interface EditCaseStudyPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditCaseStudyPage({ params }: EditCaseStudyPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: caseStudy, error } = await supabase
        .from("case_studies")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !caseStudy) {
        notFound();
    }

    return <CaseStudyForm mode="edit" initialData={caseStudy} />;
}
