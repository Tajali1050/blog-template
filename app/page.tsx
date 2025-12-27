import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { BlogCard } from "@/components/blog-card";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import type { CaseStudy } from "@/lib/supabase/types";

// Revalidate every 60 seconds for ISR
export const revalidate = 60;

const stats = [
  { label: "Successful Implementations", value: "$25,000+" },
  { label: "Annual Client Savings", value: "$500,000+" },
  { label: "Project Completion Rate", value: "100%" },
];

export default async function HomePage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .order("date", { ascending: false });

  const sortedBlogs = (data as CaseStudy[]) || [];

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute top-0 left-0 z-0 w-full h-[400px] [mask-image:linear-gradient(to_top,transparent_25%,black_95%)]">
        <FlickeringGrid
          className="absolute top-0 left-0 size-full"
          squareSize={4}
          gridGap={6}
          color="#6B7280"
          maxOpacity={0.2}
          flickerChance={0.05}
        />
      </div>

      {/* Hero Section with Portfolio Overview */}
      <div className="p-6 border-b border-border flex flex-col gap-8 min-h-[400px] justify-center relative z-10">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col gap-4">
            <h1 className="font-medium text-4xl md:text-5xl tracking-tighter">
              RapidXAI Case Studies & Client Success Stories
            </h1>
            <p className="text-lg md:text-xl font-medium text-foreground/90">
              Proven Success Stories & Measurable Results
            </p>
            <p className="text-muted-foreground text-sm md:text-base">
              Industries Transformed: Real Estate, Education, Digital Marketing, Enterprise SaaS
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 border-y border-border py-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center text-center space-y-2"
              >
                <div className="text-3xl font-medium text-foreground tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Flagship Success Stories Section */}
      <div className="max-w-7xl mx-auto w-full px-6 lg:px-0 py-8">
        <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-6">
          Flagship Success Stories:
        </h2>
        <Suspense fallback={<div>Loading case studies...</div>}>
          {error ? (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
              Error loading case studies. Please try again later.
            </div>
          ) : sortedBlogs.length > 0 ? (
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative overflow-hidden border-x border-border ${sortedBlogs.length < 4 ? "border-b" : "border-b-0"
                }`}
            >
              {sortedBlogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  url={`/case-studies/${blog.slug}`}
                  title={blog.title}
                  description={blog.description}
                  thumbnail={blog.thumbnail || undefined}
                  showRightBorder={sortedBlogs.length < 3}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-border rounded-xl">
              <h3 className="text-lg font-medium">No case studies yet</h3>
              <p className="text-muted-foreground mt-1">
                Check back soon for our success stories
              </p>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}
