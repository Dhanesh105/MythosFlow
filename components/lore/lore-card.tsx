'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Calendar, FileText } from 'lucide-react';
import { deleteLoreEntry } from '@/actions/lore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

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
            toast.success('Entry deleted from vault');
        },
        onError: () => {
            toast.error('Failed to delete entry');
        }
    });

    return (
        <Card className="group relative overflow-hidden border-none bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 opacity-50 group-hover:opacity-100 transition-opacity" />
            
            <CardHeader className="flex flex-row items-start justify-between p-5 pb-2">
                <div className="flex-1 min-w-0 mr-4">
                    <CardTitle className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 truncate">
                        {entry.title}
                    </CardTitle>
                    <div className="flex items-center gap-3 mt-1.5">
                        <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                            <Calendar className="h-3 w-3" />
                            {new Date(entry.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate()}
                    disabled={deleteMutation.isPending}
                    className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="p-5 pt-2">
                <div className="flex gap-2 mb-3">
                    <FileText className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-4 leading-relaxed">
                        {entry.content}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
