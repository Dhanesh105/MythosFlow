'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { FileText, Sparkles, Search } from 'lucide-react';
import { ContextPanel } from '@/components/editor/context-panel';

// Temporary project ID - in a real app, this would come from user context
const PROJECT_ID = 'default-project';

export default function EditorPage() {
    const [scriptContent, setScriptContent] = useState('');
    const [showContext, setShowContext] = useState(false);

    const handleSearchLore = () => {
        setShowContext(true);
    };

    // Get last 200 words for context search
    const getLastWords = (text: string, wordCount: number = 200) => {
        const words = text.trim().split(/\s+/);
        const lastWords = words.slice(-wordCount);
        return lastWords.join(' ');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/30">
            <div className="container mx-auto p-6 lg:p-8">
                <div className="flex items-center gap-4 mb-8">
                    <SidebarTrigger />
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                            <FileText className="h-8 w-8 text-blue-600" />
                            Script Editor
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Write with AI-powered context from your lore vault
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Editor */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Your Script</CardTitle>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleSearchLore}
                                            disabled={!scriptContent}
                                        >
                                            <Search className="h-4 w-4 mr-2" />
                                            Search Lore
                                        </Button>
                                        <Button size="sm" variant="secondary">
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            Generate Scene
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    placeholder="Start writing your script here... As you write, use 'Search Lore' to find relevant context from your lore vault."
                                    rows={20}
                                    value={scriptContent}
                                    onChange={(e) => setScriptContent(e.target.value)}
                                    className="font-mono"
                                />
                                <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                                    <span>{scriptContent.split(/\s+/).filter(Boolean).length} words</span>
                                    <span>Auto-saved</span>
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
        </div>
    );
}
