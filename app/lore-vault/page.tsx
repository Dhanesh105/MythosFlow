'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { BookOpen, Loader2, Plus, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { createLoreEntry, getLoreEntries } from '@/actions/lore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LoreCard } from '@/components/lore/lore-card';
import { toast } from 'sonner';

// Temporary project ID - in a real app, this would come from user context
const PROJECT_ID = 'default-project';

export default function LoreVaultPage() {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);

    const { data: loreEntries, isLoading } = useQuery({
        queryKey: ['loreEntries', PROJECT_ID],
        queryFn: async () => {
            const result = await getLoreEntries(PROJECT_ID);
            return result.success ? result.data : [];
        },
    });

    const createMutation = useMutation({
        mutationFn: async () => {
            return await createLoreEntry(PROJECT_ID, title, content);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['loreEntries', PROJECT_ID] });
            setTitle('');
            setContent('');
            setIsFormOpen(false);
            toast.success('Lore entry added to vault');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title && content) {
            createMutation.mutate();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 dark:from-slate-950 dark:via-purple-950/30 dark:to-blue-950/30">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 sm:mb-12">
                    <div className="flex items-center gap-4">
                        <SidebarTrigger className="h-9 w-9 sm:h-10 sm:w-10 shrink-0" />
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
                                <BookOpen className="h-7 w-7 sm:h-8 sm:w-8 text-purple-600" />
                                <span className="truncate">Lore Vault</span>
                            </h1>
                            <p className="text-muted-foreground text-xs sm:text-base mt-1">
                                RAG-powered semantic knowledge base
                            </p>
                        </div>
                    </div>
                    <Button 
                        onClick={() => setIsFormOpen(!isFormOpen)} 
                        className="w-full sm:w-auto rounded-xl gap-2 bg-purple-600 hover:bg-purple-700 text-white"
                    >
                        {isFormOpen ? <ChevronUp className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        {isFormOpen ? 'Close Editor' : 'New Entry'}
                    </Button>
                </div>

                <div className="grid gap-8 lg:grid-cols-12 items-start">
                    {/* Upload Form - Expandable on Mobile */}
                    <div className={`lg:col-span-4 transition-all duration-300 ${isFormOpen ? 'block' : 'hidden lg:block'}`}>
                        <Card className="border-none shadow-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl sticky top-4">
                            <CardHeader className="p-5 sm:p-6 pb-2">
                                <CardTitle className="text-lg sm:text-xl">Add Lore Entry</CardTitle>
                                <CardDescription className="text-xs">
                                    Build your world bible knowledge base.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-5 sm:p-6 pt-0">
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label htmlFor="title" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                            Title
                                        </label>
                                        <Input
                                            id="title"
                                            placeholder="e.g., The Chronos Engine"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                            className="rounded-xl bg-slate-50/50 dark:bg-slate-800/50"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label htmlFor="content" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                            Content
                                        </label>
                                        <Textarea
                                            id="content"
                                            placeholder="Enter your lore content here..."
                                            rows={8}
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            required
                                            className="rounded-xl bg-slate-50/50 dark:bg-slate-800/50 text-sm"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full h-11 rounded-xl bg-slate-900 dark:bg-slate-100 dark:text-slate-900 shadow-lg shadow-slate-500/20"
                                        disabled={createMutation.isPending}
                                    >
                                        {createMutation.isPending ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add to Vault
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Lore Entries List */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">Universe Database</h2>
                            <div className="flex items-center gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="rounded-xl px-4"
                                    onClick={() => toast.info('Semantic search is always active in the Editor.')}
                                >
                                    <Search className="h-4 w-4 mr-2" />
                                    Search
                                </Button>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                                <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
                                <p className="text-sm font-medium text-muted-foreground animate-pulse">Accessing archives...</p>
                            </div>
                        ) : loreEntries && loreEntries.length > 0 ? (
                            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
                                {loreEntries.map((entry) => (
                                    <LoreCard key={entry.id} entry={entry} />
                                ))}
                            </div>
                        ) : (
                            <Card className="p-16 text-center border-dashed border-2 bg-transparent">
                                <div className="mx-auto max-w-sm">
                                    <BookOpen className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-20" />
                                    <h3 className="text-xl font-bold mb-2">The Archives are Empty</h3>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        Your universe bible has no entries. Add snippets of your world to enable AI context during writing.
                                    </p>
                                    <Button variant="outline" onClick={() => setIsFormOpen(true)} className="rounded-xl">
                                        Create First Entry
                                    </Button>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
