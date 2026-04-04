'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Trash2, GripVertical } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { updateStoryboardItem, deleteStoryboardItem } from '@/actions/storyboard';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';

interface ImageCardProps {
    item: {
        id: string;
        imageUrl: string;
        positionX: number;
        positionY: number;
        dialogue?: string;
        cameraAngle?: string;
    };
    projectId: string;
}

export function ImageCard({ item, projectId }: ImageCardProps) {
    const queryClient = useQueryClient();
    const [dialogue, setDialogue] = useState(item.dialogue || '');
    const [cameraAngle, setCameraAngle] = useState(item.cameraAngle || '');

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
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            return await deleteStoryboardItem(item.id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['storyboardItems', projectId] });
        },
    });

    const handleBlur = () => {
        updateMutation.mutate({ dialogue, cameraAngle });
    };

    return (
        <Card ref={setNodeRef} style={style} className="w-80 cursor-move hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div
                    {...listeners}
                    {...attributes}
                    className="cursor-grab active:cursor-grabbing"
                >
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
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
            <CardContent className="space-y-3">
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                    <Image
                        src={item.imageUrl}
                        alt="Storyboard scene"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="space-y-2">
                    <div>
                        <label className="text-xs font-medium text-muted-foreground">
                            Dialogue
                        </label>
                        <Textarea
                            placeholder="Add dialogue..."
                            rows={2}
                            value={dialogue}
                            onChange={(e) => setDialogue(e.target.value)}
                            onBlur={handleBlur}
                            className="text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-muted-foreground">
                            Camera Angle
                        </label>
                        <Input
                            placeholder="e.g., Wide shot, Close-up"
                            value={cameraAngle}
                            onChange={(e) => setCameraAngle(e.target.value)}
                            onBlur={handleBlur}
                            className="text-sm"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
