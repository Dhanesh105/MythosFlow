import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { BookOpen, FileText, Image, Plus, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 dark:from-slate-950 dark:via-purple-950/30 dark:to-blue-950/30">
      <div className="container mx-auto p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Welcome to MythosFlow
              </h1>
              <p className="text-muted-foreground mt-1">
                Create epic sci-fi and mythology stories with AI-powered tools
              </p>
            </div>
          </div>
        </div>

        {/* Bento Grid Dashboard */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Lore Vault Card */}
          <Card className="md:col-span-1 hover:shadow-lg transition-shadow border-purple-200/50 dark:border-purple-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <BookOpen className="h-8 w-8 text-purple-600" />
                <Button size="sm" variant="ghost" asChild>
                  <Link href="/lore-vault">
                    Open <span className="sr-only">Lore Vault</span>
                  </Link>
                </Button>
              </div>
              <CardTitle>Lore Vault</CardTitle>
              <CardDescription>
                Manage your world bible and lore entries with RAG-powered search
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Entries</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-semibold">Never</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline" asChild>
                <Link href="/lore-vault">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lore Entry
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Script Editor Card */}
          <Card className="md:col-span-1 hover:shadow-lg transition-shadow border-blue-200/50 dark:border-blue-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <FileText className="h-8 w-8 text-blue-600" />
                <Button size="sm" variant="ghost" asChild>
                  <Link href="/editor">
                    Open <span className="sr-only">Script Editor</span>
                  </Link>
                </Button>
              </div>
              <CardTitle>Script Editor</CardTitle>
              <CardDescription>
                Write with AI-powered context from your lore vault
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Active Scripts</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Word Count</span>
                  <span className="font-semibold">0</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline" asChild>
                <Link href="/editor">
                  <Plus className="h-4 w-4 mr-2" />
                  New Script
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Storyboard Card */}
          <Card className="md:col-span-1 hover:shadow-lg transition-shadow border-indigo-200/50 dark:border-indigo-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Image className="h-8 w-8 text-indigo-600" />
                <Button size="sm" variant="ghost" asChild>
                  <Link href="/storyboard">
                    Open <span className="sr-only">Storyboard</span>
                  </Link>
                </Button>
              </div>
              <CardTitle>Storyboard</CardTitle>
              <CardDescription>
                Visualize scenes with AI-generated images
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Images Created</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Canvas Items</span>
                  <span className="font-semibold">0</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline" asChild>
                <Link href="/storyboard">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Scene
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Start Guide */}
          <Card className="md:col-span-2 lg:col-span-3 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-300/30 dark:border-purple-700/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Quick Start Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white text-xs font-bold">
                      1
                    </div>
                    <h3 className="font-semibold">Build Your Lore</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload world bible snippets to create a searchable knowledge base
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                      2
                    </div>
                    <h3 className="font-semibold">Write Your Script</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Use the context-aware editor to prevent story contradictions
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold">
                      3
                    </div>
                    <h3 className="font-semibold">Visualize Scenes</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Generate images and organize them on an interactive storyboard
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
