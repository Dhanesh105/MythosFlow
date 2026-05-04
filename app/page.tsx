'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { 
  Sparkles, 
  BookOpen, 
  FileText, 
  Settings as SettingsIcon, 
  Zap, 
  ChevronRight, 
  Plus,
  Search,
  Layout
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [quickLore, setQuickLore] = useState('');

  const handleQuickAdd = () => {
    if (!quickLore.trim()) return;
    // In a real app, this would call createLoreEntry
    toast.success('Snippet sent to Universal Vault');
    setQuickLore('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30">
      <div className="container mx-auto p-4 sm:p-6 lg:p-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10 sm:mb-16">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="h-10 w-10 shrink-0" />
            <div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-slate-800 to-slate-400 dark:from-white dark:to-slate-500 bg-clip-text text-transparent">
                MythosFlow
              </h1>
              <p className="text-muted-foreground text-sm sm:text-lg mt-1 font-medium">
                Forge your universe. Control the narrative.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" className="rounded-full px-6 gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-800 shadow-sm w-full sm:w-auto">
            <Link href="/settings">
              <SettingsIcon className="h-4 w-4" />
              Configure Nexus
            </Link>
          </Button>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          
          {/* Main Action: Storyboard */}
          <Card className="md:col-span-4 lg:col-span-4 group relative overflow-hidden border-none bg-indigo-600 shadow-2xl shadow-indigo-500/20">
            <CardHeader className="relative z-10 p-6 sm:p-10">
              <div className="bg-white/20 w-fit p-3 rounded-2xl mb-4 backdrop-blur-md">
                <Layout className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-3xl sm:text-4xl font-bold text-white mb-2">Visual Storyboard</CardTitle>
              <CardDescription className="text-indigo-100 text-base sm:text-lg max-w-md">
                Transform your script into cinematic visual sequences with AI-powered framing.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 px-6 sm:px-10 pb-10">
              <Button asChild className="bg-white text-indigo-600 hover:bg-indigo-50 rounded-full px-8 h-12 text-base font-bold shadow-lg">
                <Link href="/storyboard">
                  Launch Canvas
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
            {/* Abstract Background Element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-110 transition-transform duration-700" />
          </Card>

          {/* Quick Context / Lore */}
          <Card className="md:col-span-4 lg:col-span-2 border-none bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-xl flex flex-col">
            <CardHeader className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-purple-600">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Universal Vault</span>
                </div>
              </div>
              <CardTitle className="text-2xl">Quick Lore</CardTitle>
              <CardDescription className="text-sm">Instant snippet capture.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 flex-1 flex flex-col">
              <textarea 
                value={quickLore}
                onChange={(e) => setQuickLore(e.target.value)}
                placeholder="A legendary weapon forged in..."
                className="flex-1 w-full bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl p-4 border-none focus:ring-2 focus:ring-purple-500/20 text-sm resize-none mb-4 min-h-[120px]"
              />
              <Button onClick={handleQuickAdd} className="w-full rounded-full bg-purple-600 hover:bg-purple-700 gap-2">
                <Plus className="h-4 w-4" />
                Add to Vault
              </Button>
            </CardContent>
          </Card>

          {/* Script Editor */}
          <Card className="md:col-span-2 lg:col-span-3 border-none bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-xl hover:bg-white/80 transition-colors cursor-pointer group">
            <Link href="/editor" className="h-full block">
              <CardHeader className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-2xl text-blue-600">
                    <FileText className="h-6 w-6" />
                  </div>
                  <Sparkles className="h-5 w-5 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <CardTitle className="text-2xl mb-2">Script Editor</CardTitle>
                <CardDescription className="text-base">
                  Write with real-time semantic context from your lore vault.
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          {/* AI Status / Quick Stats */}
          <Card className="md:col-span-2 lg:col-span-3 border-none bg-slate-900 shadow-2xl overflow-hidden relative group">
            <CardHeader className="p-8">
              <div className="flex items-center gap-2 text-green-400 mb-4">
                <Zap className="h-5 w-5 fill-current animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest">Neural Status</span>
              </div>
              <CardTitle className="text-2xl text-white mb-2">Multi-AI Nexus</CardTitle>
              <CardDescription className="text-slate-400">
                Switch between Gemini Pro and NVIDIA Nemotron instantly.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="flex gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-green-500/20"><div className="h-full w-full bg-green-500 rounded-full" /></div>
                <div className="h-1.5 flex-1 rounded-full bg-green-500/20"><div className="h-full w-3/4 bg-green-500 rounded-full" /></div>
                <div className="h-1.5 flex-1 rounded-full bg-green-500/20"><div className="h-full w-1/2 bg-green-500 rounded-full" /></div>
              </div>
            </CardContent>
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" />
          </Card>

        </div>
      </div>
    </div>
  );
}
