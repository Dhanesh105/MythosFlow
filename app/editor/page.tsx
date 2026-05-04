'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { FileText, Sparkles, Search, Save } from 'lucide-react';
import { ContextPanel } from '@/components/editor/context-panel';
import { SceneGenerator } from '@/components/editor/scene-generator';
import { toast } from 'sonner';

// Temporary project ID - in a real app, this would come from user context
const PROJECT_ID = 'default-project';

export default function EditorPage() {
    const [scriptContent, setScriptContent] = useState('');
    const [showContext, setShowContext] = useState(false);
    const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

    const handleSearchLore = () => {
        setShowContext(true);
    };

    const handleGenerateScene = () => {
        if (!scriptContent.trim()) {
            toast.error('Please write some script content first');
            return;
        }
        setIsGeneratorOpen(true);
    };

    const handleSaveScript = () => {
        toast.success('Script saved to local storage');
        // In a real app, this would call a server action
    };

    // Get last 200 words for context search
    const getLastWords = (text: string, wordCount: number = 200) => {
        const words = text.trim().split(/\s+/);
        const lastWords = words.slice(-wordCount);
        return lastWords.join(' ');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/30">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <SidebarTrigger className="h-10 w-10 shrink-0" />
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                                <FileText className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
                                Script Editor
                            </h1>
                            <p className="text-muted-foreground text-sm sm:text-base mt-1">
                                Write with AI-powered context from your lore vault
                            </p>
                        </div>
                    </div>
                    <Button onClick={handleSaveScript} className="w-full sm:w-auto gap-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800">
                        <Save className="h-4 w-4" />
                        Save Draft
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Editor */}
                    <div className="lg:col-span-2">
                        <Card className="border-none shadow-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
                            <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <CardTitle>Your Script</CardTitle>
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleSearchLore}
                                            disabled={!scriptContent}
                                            className="flex-1 sm:flex-none rounded-xl"
                                        >
                                            <Search className="h-4 w-4 mr-2" />
                                            Search Lore
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="secondary"
                                            onClick={handleGenerateScene}
                                            className="flex-1 sm:flex-none rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white border-none"
                                        >
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            Generate Scene
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <Textarea
                                    placeholder="Start writing your script here... As you write, use 'Search Lore' to find relevant context from your lore vault."
                                    rows={20}
                                    value={scriptContent}
                                    onChange={(e) => setScriptContent(e.target.value)}
                                    className="font-mono text-base sm:text-lg bg-transparent border-none focus-visible:ring-0 resize-none p-0"
                                />
                                <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-muted-foreground">
                                    <div className="flex items-center gap-4">
                                        <span>{scriptContent.split(/\s+/).filter(Boolean).length} words</span>
                                        <span className="flex items-center gap-1">
                                            <div className="h-2 w-2 rounded-full bg-green-500" />
                                            Synced
                                        </span>
                                    </div>
                                    <span>Last edited 2m ago</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Context Panel */}
                    <div className="lg:col-span-1">
                        <ContextPanel
                            projectId={PROJECT_ID}
                            query={getLastWords(scriptContent)}
                            isVisible={showContext}
                        />
                    </div>
                </div>
            </div>

            <SceneGenerator 
                isOpen={isGeneratorOpen}
                onClose={() => setIsGeneratorOpen(false)}
                sceneText={scriptContent}
                projectId={PROJECT_ID}
            />
        </div>
    );
}
