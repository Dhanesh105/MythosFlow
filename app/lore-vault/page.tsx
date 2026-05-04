'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { BookOpen, Loader2, Plus, Search } from 'lucide-react';
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
            <div className="container mx-auto p-6 lg:p-8">
                <div className="flex items-center gap-4 mb-8">
                    <SidebarTrigger />
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
                            <BookOpen className="h-8 w-8 text-purple-600" />
                            Lore Vault
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your world bible with RAG-powered semantic search
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Upload Form */}
                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle>Add Lore Entry</CardTitle>
                            <CardDescription>
                                Upload world bible snippets to build your knowledge base
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="title" className="text-sm font-medium">
                                        Title
                                    </label>
                                    <Input
                                        id="title"
                                        placeholder="e.g., The Mythic Reactor"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="content" className="text-sm font-medium">
                                        Content
                                    </label>
                                    <Textarea
                                        id="content"
                                        placeholder="Enter your lore content here..."
                                        rows={8}
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={createMutation.isPending}
                                >
                                    {createMutation.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
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

                    {/* Lore Entries List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-semibold">Your Lore</h2>
                            <Button 
                                variant="outline" 
                                size="sm"
                                className="rounded-xl"
                                onClick={() => toast.info('Semantic search is always active in the Editor context panel.')}
                            >
                                <Search className="h-4 w-4 mr-2" />
                                Search
                            </Button>
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center p-12">
                                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                            </div>
                        ) : loreEntries && loreEntries.length > 0 ? (
                            <div className="space-y-4">
                                {loreEntries.map((entry) => (
                                    <LoreCard key={entry.id} entry={entry} />
                                ))}
                            </div>
                        ) : (
                            <Card className="p-12 text-center border-dashed">
                                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <p className="text-muted-foreground">
                                    No lore entries yet. Add your first entry to get started!
                                </p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
