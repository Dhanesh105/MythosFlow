import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Trash2, GripVertical, Copy, Check } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { updateStoryboardItem, deleteStoryboardItem } from '@/actions/storyboard';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { toast } from 'sonner';

interface ImageCardProps {
    item: {
        id: string;
        imageUrl: string;
        positionX: number;
        positionY: number;
        dialogue?: string;
        cameraAngle?: string;
        scenePrompt?: string;
    };
    projectId: string;
}

export function ImageCard({ item, projectId }: ImageCardProps) {
    const queryClient = useQueryClient();
    const [dialogue, setDialogue] = useState(item.dialogue || '');
    const [cameraAngle, setCameraAngle] = useState(item.cameraAngle || '');
    const [copied, setCopied] = useState(false);

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: item.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        position: 'absolute' as const,
        left: `${item.positionX}px`,
        top: `${item.positionY}px`,
    };

    const updateMutation = useMutation({
        mutationFn: async (data: { dialogue?: string; cameraAngle?: string }) => {
            return await updateStoryboardItem(item.id, data);
        },
        onSuccess: () => {
            toast.success('Storyboard item updated');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            return await deleteStoryboardItem(item.id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['storyboardItems', projectId] });
            toast.error('Item removed from storyboard');
        },
    });

    const handleBlur = () => {
        if (dialogue !== (item.dialogue || '') || cameraAngle !== (item.cameraAngle || '')) {
            updateMutation.mutate({ dialogue, cameraAngle });
        }
    };

    const copyPrompt = () => {
        if (item.scenePrompt) {
            navigator.clipboard.writeText(item.scenePrompt);
            setCopied(true);
            toast.success('Prompt copied to clipboard');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Card 
            ref={setNodeRef} 
            style={style} 
            className="w-80 group border-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 ring-1 ring-slate-200 dark:ring-slate-800"
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-t-xl border-b border-slate-100 dark:border-slate-800">
                <div
                    {...listeners}
                    {...attributes}
                    className="cursor-grab active:cursor-grabbing p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex gap-1">
                    {item.scenePrompt && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={copyPrompt}
                            title="Copy Prompt"
                        >
                            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
                        onClick={() => deleteMutation.mutate()}
                        disabled={deleteMutation.isPending}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                <div className="relative w-full h-52 rounded-xl overflow-hidden shadow-inner bg-slate-100 dark:bg-slate-800">
                    <Image
                        src={item.imageUrl}
                        alt="Storyboard scene"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>
                <div className="space-y-3">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                            Dialogue
                        </label>
                        <Textarea
                            placeholder="Add character lines..."
                            rows={2}
                            value={dialogue}
                            onChange={(e) => setDialogue(e.target.value)}
                            onBlur={handleBlur}
                            className="text-sm rounded-xl border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                            Camera Angle
                        </label>
                        <Input
                            placeholder="e.g., Extreme Long Shot"
                            value={cameraAngle}
                            onChange={(e) => setCameraAngle(e.target.value)}
                            onBlur={handleBlur}
                            className="text-sm rounded-xl h-9 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
