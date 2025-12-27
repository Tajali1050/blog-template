/**
 * Migration Script: MDX to Supabase
 * 
 * This script migrates existing case studies from MDX files to Supabase.
 * 
 * Usage:
 * 1. Make sure your .env.local has SUPABASE_SERVICE_ROLE_KEY set
 * 2. Run: npx tsx scripts/migrate-mdx-to-supabase.ts
 */

// Load environment variables from .env.local FIRST before any other imports
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Now import other modules after env is loaded
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import matter from "gray-matter";

interface MDXFrontmatter {
    title: string;
    description: string;
    date: string;
    tags?: string[];
    featured?: boolean;
    readTime?: string;
    author?: string;
    thumbnail?: string;
}

async function migrateMDXFiles() {
    // Check for required environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error("Missing required environment variables:");
        console.error("  - NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✓" : "✗ missing");
        console.error("  - SUPABASE_SERVICE_ROLE_KEY:", supabaseKey ? "✓" : "✗ missing");
        console.error("\nMake sure these are set in your .env.local file");
        console.error("Current .env.local path:", path.resolve(process.cwd(), ".env.local"));
        process.exit(1);
    }

    // Create Supabase client AFTER env vars are loaded
    const supabase = createClient(supabaseUrl, supabaseKey);

    const contentDir = path.join(process.cwd(), "blog", "content");

    // Check if directory exists
    if (!fs.existsSync(contentDir)) {
        console.error("Content directory not found:", contentDir);
        process.exit(1);
    }

    // Get all MDX files
    const files = fs.readdirSync(contentDir).filter(file => file.endsWith(".mdx"));

    console.log(`Found ${files.length} MDX files to migrate\n`);

    for (const file of files) {
        const filePath = path.join(contentDir, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");

        // Parse frontmatter and content
        const { data, content } = matter(fileContent);
        const frontmatter = data as MDXFrontmatter;

        // Generate slug from filename
        const slug = file.replace(".mdx", "");

        console.log(`Migrating: ${frontmatter.title}`);
        console.log(`  Slug: ${slug}`);

        // Prepare the case study data
        const caseStudyData = {
            slug,
            title: frontmatter.title,
            description: frontmatter.description,
            date: frontmatter.date,
            tags: frontmatter.tags || [],
            featured: frontmatter.featured || false,
            read_time: frontmatter.readTime || null,
            author: frontmatter.author || null,
            thumbnail: frontmatter.thumbnail || null,
            content: content.trim(),
        };

        // Insert into Supabase
        const { error } = await supabase
            .from("case_studies")
            .upsert(caseStudyData, { onConflict: "slug" });

        if (error) {
            console.error(`  ❌ Error: ${error.message}`);
        } else {
            console.log(`  ✅ Migrated successfully`);
        }

        console.log("");
    }

    console.log("Migration complete!");
}

migrateMDXFiles().catch(console.error);
