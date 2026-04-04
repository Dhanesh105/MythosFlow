'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteLoreEntry } from '@/actions/lore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface LoreCardProps {
    entry: {
        id: string;
        title: string;
        content: string;
        createdAt: Date;
        projectId: string;
    };
}

export function LoreCard({ entry }: LoreCardProps) {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: async () => {
            return await deleteLoreEntry(entry.id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['loreEntries', entry.projectId] });
        },
    });

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="flex-1">
                    <CardTitle className="text-lg">{entry.title}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                        {new Date(entry.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate()}
                    disabled={deleteMutation.isPending}
                >
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {entry.content}
                </p>
            </CardContent>
        </Card>
    );
}
