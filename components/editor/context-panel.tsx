'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, BookOpen } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { searchLore } from '@/actions/lore';

interface ContextPanelProps {
    projectId: string;
    query: string;
    isVisible: boolean;
}

export function ContextPanel({ projectId, query, isVisible }: ContextPanelProps) {
    const { data: results, isLoading, refetch } = useQuery({
        queryKey: ['loreSearch', projectId, query],
        queryFn: async () => {
            if (!query) return [];
            const result = await searchLore(projectId, query, 5);
            return result.success ? result.data : [];
        },
        enabled: false, // Don't auto-fetch
    });

    useEffect(() => {
        if (isVisible && query) {
            refetch();
        }
    }, [isVisible, query, refetch]);

    if (!isVisible) {
        return (
            <Card className="border-dashed">
                <CardContent className="p-12 text-center">
                    <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">
                        Click "Search Lore" to find relevant context
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="sticky top-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Relevant Lore
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                ) : results && results.length > 0 ? (
                    results.map((entry: any) => (
                        <Card key={entry.id} className="bg-muted/50">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm">{entry.title}</CardTitle>
                                    {entry.similarity && (
                                        <span className="text-xs text-muted-foreground">
                                            {(entry.similarity * 100).toFixed(0)}% match
                                        </span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground line-clamp-4">
                                    {entry.content}
                                </p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center p-8">
                        <p className="text-sm text-muted-foreground">
                            No relevant lore found. Try adding more entries to your vault!
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function Search(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    );
}
