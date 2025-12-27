"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, FileText, Plus, Menu, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface AdminNavProps {
    user: User;
}

export function AdminNav({ user }: AdminNavProps) {
    const router = useRouter();
    const supabase = createClient();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
        router.refresh();
    };

    return (
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                {/* Mobile Header */}
                <div className="flex items-center justify-between">
                    <Link href="/admin" className="font-semibold text-base sm:text-lg tracking-tight">
                        Admin
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href="/admin"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <FileText className="w-4 h-4" />
                            All Case Studies
                        </Link>
                        <Link
                            href="/admin/case-studies/new"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            New Case Study
                        </Link>
                    </nav>

                    <div className="hidden md:flex items-center gap-4">
                        <span className="text-sm text-muted-foreground truncate max-w-[150px]">
                            {user.email}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogout}
                            className="flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-2 space-y-3 border-t border-border pt-4">
                        <Link
                            href="/admin"
                            className="flex items-center gap-2 text-sm text-foreground py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <FileText className="w-4 h-4" />
                            All Case Studies
                        </Link>
                        <Link
                            href="/admin/case-studies/new"
                            className="flex items-center gap-2 text-sm text-foreground py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <Plus className="w-4 h-4" />
                            New Case Study
                        </Link>
                        <div className="pt-3 border-t border-border space-y-3">
                            <p className="text-sm text-muted-foreground truncate">
                                {user.email}
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
