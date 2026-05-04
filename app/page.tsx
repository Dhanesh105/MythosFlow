import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { BookOpen, FileText, Image as ImageIcon, Plus, Sparkles, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";
import { getProjectStats } from "@/actions/stats";

export default async function Home() {
  const statsResult = await getProjectStats();
  const stats = statsResult.success ? statsResult.data : {
    loreCount: 0,
    scriptCount: 0,
    storyboardCount: 0,
    lastUpdated: null,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/50 to-purple-50/50 dark:from-slate-950 dark:via-indigo-950/50 dark:to-purple-950/50">
      <div className="container mx-auto p-4 sm:p-6 lg:p-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <SidebarTrigger className="h-10 w-10 shrink-0" />
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent line-clamp-1">
                MythosFlow
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg mt-1 sm:mt-2 font-medium">
                Architect your universe with AI storytelling
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-white/20 shadow-sm self-end sm:self-auto">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">Production Ready</span>
          </div>
        </div>

        {/* Bento Grid Dashboard */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Lore Vault Card */}
          <Card className="group relative overflow-hidden border-none bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-2xl shadow-purple-500/10 transition-all hover:-translate-y-1">
            <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <BookOpen className="h-24 w-24 sm:h-32 sm:w-32 text-purple-600" />
            </div>
            <CardHeader className="relative z-10 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2.5 sm:p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <Button size="sm" variant="ghost" className="rounded-full h-8 text-xs hover:bg-purple-50 dark:hover:bg-purple-900/20" asChild>
                  <Link href="/lore-vault">Explore Vault</Link>
                </Button>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold">Lore Vault</CardTitle>
              <CardDescription className="text-sm sm:text-base line-clamp-2">
                Your world bible, indexed for semantic AI retrieval.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div className="p-3 sm:p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Entries</span>
                  <span className="text-2xl sm:text-3xl font-black text-purple-600">{stats?.loreCount || 0}</span>
                </div>
                <div className="p-3 sm:p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Updated</span>
                  <span className="text-xs sm:text-sm font-bold truncate">{stats?.lastUpdated ? 'Recent' : 'Never'}</span>
                </div>
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/20 h-10 sm:h-11" asChild>
                <Link href="/lore-vault">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Entry
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Script Editor Card */}
          <Card className="group relative overflow-hidden border-none bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-2xl shadow-blue-500/10 transition-all hover:-translate-y-1">
            <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <FileText className="h-24 w-24 sm:h-32 sm:w-32 text-blue-600" />
            </div>
            <CardHeader className="relative z-10 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2.5 sm:p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <Button size="sm" variant="ghost" className="rounded-full h-8 text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20" asChild>
                  <Link href="/editor">Open Editor</Link>
                </Button>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold">Script Editor</CardTitle>
              <CardDescription className="text-sm sm:text-base line-clamp-2">
                Write with the collective memory of your lore.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div className="p-3 sm:p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Scripts</span>
                  <span className="text-2xl sm:text-3xl font-black text-blue-600">{stats?.scriptCount || 0}</span>
                </div>
                <div className="p-3 sm:p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Status</span>
                  <span className="text-xs sm:text-sm font-bold text-blue-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Active
                  </span>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 h-10 sm:h-11" asChild>
                <Link href="/editor">
                  <Plus className="h-4 w-4 mr-2" />
                  New Script
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Storyboard Card */}
          <Card className="group relative overflow-hidden border-none bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 transition-all hover:-translate-y-1">
            <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ImageIcon className="h-24 w-24 sm:h-32 sm:w-32 text-indigo-600" />
            </div>
            <CardHeader className="relative z-10 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2.5 sm:p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600">
                  <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <Button size="sm" variant="ghost" className="rounded-full h-8 text-xs hover:bg-indigo-50 dark:hover:bg-indigo-900/20" asChild>
                  <Link href="/storyboard">View Canvas</Link>
                </Button>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold">Storyboard</CardTitle>
              <CardDescription className="text-sm sm:text-base line-clamp-2">
                Visualize scenes with SDXL generation.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div className="p-3 sm:p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Scenes</span>
                  <span className="text-2xl sm:text-3xl font-black text-indigo-600">{stats?.storyboardCount || 0}</span>
                </div>
                <div className="p-3 sm:p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Queue</span>
                  <span className="text-xs sm:text-sm font-bold">Empty</span>
                </div>
              </div>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 h-10 sm:h-11" asChild>
                <Link href="/storyboard">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Scene
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Start Guide */}
          <Card className="md:col-span-2 lg:col-span-3 border-none bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-2xl shadow-indigo-500/30 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 p-8 opacity-10">
              <Sparkles className="h-48 w-48 sm:h-64 sm:w-64 text-white" />
            </div>
            <CardHeader className="relative z-10 px-6 pt-8 pb-4">
              <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8" />
                Next Steps for Your Universe
              </CardTitle>
              <CardDescription className="text-indigo-100 text-sm sm:text-lg">
                Follow this workflow to maximize the AI engine's creative potential.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 px-6 pb-8">
              <div className="grid gap-4 sm:gap-6 md:grid-cols-3 mt-4">
                <QuickStep 
                  num={1} 
                  title="Seed the Lore" 
                  text="Upload your world bible snippets. The more context you provide, the better the AI understands your rules." 
                />
                <QuickStep 
                  num={2} 
                  title="Draft with AI" 
                  text="Use the Search Lore tool in the editor to pull specific facts about your characters and tech while writing." 
                />
                <QuickStep 
                  num={3} 
                  title="Visualize" 
                  text="Convert your polished scenes into cinematic prompts and generate storyboard assets in seconds." 
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function QuickStep({ num, title, text }: { num: number, title: string, text: string }) {
  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
      <div className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-2xl bg-white text-indigo-600 font-black text-lg sm:text-xl mb-3 sm:mb-4 shrink-0">
        {num}
      </div>
      <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">{title}</h3>
      <p className="text-indigo-50 text-xs sm:text-sm leading-relaxed">{text}</p>
    </div>
  );
}
