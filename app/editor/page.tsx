'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { FileText, Sparkles, Search, Save, ChevronRight, ChevronLeft } from 'lucide-react';
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
        setShowContext(!showContext);
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
    };

    // Get last 200 words for context search
    const getLastWords = (text: string, wordCount: number = 200) => {
        const words = text.trim().split(/\s+/);
        const lastWords = words.slice(-wordCount);
        return lastWords.join(' ');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/30 flex flex-col">
            <div className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <SidebarTrigger className="h-9 w-9 sm:h-10 sm:w-10 shrink-0" />
                        <div>
                            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                                <span className="truncate">Script Editor</span>
                            </h1>
                            <p className="text-muted-foreground text-[10px] sm:text-base mt-0.5">
                                AI-powered storytelling engine
                            </p>
                        </div>
                    </div>
                    <Button onClick={handleSaveScript} variant="outline" size="sm" className="w-full sm:w-auto gap-2 rounded-xl">
                        <Save className="h-4 w-4" />
                        Save Draft
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-3 h-full">
                    {/* Editor Main Section */}
                    <div className={`lg:col-span-2 transition-all duration-300 ${showContext ? 'hidden lg:block' : 'block'}`}>
                        <Card className="border-none shadow-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl h-full flex flex-col">
                            <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-4 sm:p-6">
                                <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-4">
                                    <CardTitle className="text-lg sm:text-xl">Scene Writing</CardTitle>
                                    <div className="flex gap-2 w-full xs:w-auto">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleSearchLore}
                                            disabled={!scriptContent}
                                            className={`flex-1 xs:flex-none rounded-xl ${showContext ? 'bg-indigo-50 border-indigo-200' : ''}`}
                                        >
                                            <Search className="h-4 w-4 mr-2" />
                                            {showContext ? 'Hide Lore' : 'Search Lore'}
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="secondary"
                                            onClick={handleGenerateScene}
                                            className="flex-1 xs:flex-none rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white border-none"
                                        >
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            Generate
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 p-4 sm:p-6 overflow-hidden flex flex-col">
                                <Textarea
                                    placeholder="Start writing your script here..."
                                    value={scriptContent}
                                    onChange={(e) => setScriptContent(e.target.value)}
                                    className="flex-1 font-mono text-base sm:text-lg bg-transparent border-none focus-visible:ring-0 resize-none p-0 min-h-[300px] lg:min-h-[500px]"
                                />
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-[10px] sm:text-xs text-muted-foreground">
                                    <div className="flex items-center gap-3">
                                        <span>{scriptContent.split(/\s+/).filter(Boolean).length} words</span>
                                        <span className="flex items-center gap-1">
                                            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                            Cloud Sync Active
                                        </span>
                                    </div>
                                    <span className="hidden xs:inline">Auto-saved at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Context Panel Section */}
                    <div className={`lg:col-span-1 transition-all duration-300 ${showContext ? 'block' : 'hidden lg:block'}`}>
                        <div className="sticky top-4 space-y-4">
                            {/* Mobile Back Button */}
                            {showContext && (
                                <Button 
                                    variant="ghost" 
                                    onClick={() => setShowContext(false)}
                                    className="lg:hidden mb-2 gap-2 text-indigo-600"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Back to Editor
                                </Button>
                            )}
                            <ContextPanel
                                projectId={PROJECT_ID}
                                query={getLastWords(scriptContent)}
                                isVisible={true}
                            />
                        </div>
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
