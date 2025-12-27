import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import type { CaseStudy } from "@/lib/supabase/types";

import { TableOfContents } from "@/components/table-of-contents";
import { MobileTableOfContents } from "@/components/mobile-toc";
import { AuthorCard } from "@/components/author-card";
import { ReadMoreSection } from "@/components/read-more-section";

import { getAuthor, isValidAuthor } from "@/lib/authors";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { HashScrollHandler } from "@/components/hash-scroll-handler";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    notFound();
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    notFound();
  }

  const caseStudy = data as CaseStudy;

  return (
    <div className="min-h-screen bg-background relative">
      <HashScrollHandler />
      <div className="absolute top-0 left-0 z-0 w-full h-[200px] [mask-image:linear-gradient(to_top,transparent_25%,black_95%)]">
        <FlickeringGrid
          className="absolute top-0 left-0 size-full"
          squareSize={4}
          gridGap={6}
          color="#6B7280"
          maxOpacity={0.2}
          flickerChance={0.05}
        />
      </div>

      <div className="space-y-4 border-b border-border relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-6 p-6">
          <div className="flex flex-wrap items-center gap-3 gap-y-5 text-sm text-muted-foreground">
            <Button variant="outline" asChild className="h-6 w-6">
              <Link href="/">
                <ArrowLeft className="w-4 h-4" />
                <span className="sr-only">Back to all articles</span>
              </Link>
            </Button>
            {caseStudy.tags && caseStudy.tags.length > 0 && (
              <div className="flex flex-wrap gap-3 text-muted-foreground">
                {caseStudy.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="h-6 w-fit px-3 text-sm font-medium bg-muted text-muted-foreground rounded-md border flex items-center justify-center"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-balance">
            {caseStudy.title}
          </h1>

          {caseStudy.description && (
            <p className="text-muted-foreground max-w-4xl md:text-lg md:text-balance">
              {caseStudy.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex divide-x divide-border relative max-w-7xl mx-auto px-4 md:px-0 z-10">
        <div className="absolute max-w-7xl mx-auto left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] lg:w-full h-full border-x border-border p-0 pointer-events-none" />
        <main className="w-full p-0 overflow-hidden">
          {caseStudy.thumbnail && (
            <div className="relative w-full h-[500px] overflow-hidden object-cover border border-transparent">
              <Image
                src={caseStudy.thumbnail}
                alt={caseStudy.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          <div className="p-6 lg:p-10">
            <div className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-8 prose-headings:font-semibold prose-a:no-underline prose-headings:tracking-tight prose-headings:text-balance prose-p:tracking-tight prose-p:text-balance prose-lg">
              <MarkdownRenderer content={caseStudy.content} />
            </div>
          </div>
          <div className="mt-10">
            <ReadMoreSection
              currentSlug={[slug]}
              currentTags={caseStudy.tags}
            />
          </div>
        </main>

        <aside className="hidden lg:block w-[350px] flex-shrink-0 p-6 lg:p-10 bg-muted/60 dark:bg-muted/20">
          <div className="sticky top-20 space-y-8">
            {caseStudy.author && isValidAuthor(caseStudy.author) && (
              <AuthorCard author={getAuthor(caseStudy.author)} />
            )}
            <div className="border border-border rounded-lg p-6 bg-card">
              <TableOfContents />
            </div>
          </div>
        </aside>
      </div>

      <MobileTableOfContents />
    </div>
  );
}
