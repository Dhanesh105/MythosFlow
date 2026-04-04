'use client';

import { Card } from '@/components/ui/card';
import { Loader2, Plus } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { ImageCard } from './image-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface StoryboardCanvasProps {
    items: any[];
    isLoading: boolean;
    projectId: string;
}

export function StoryboardCanvas({ items, isLoading, projectId }: StoryboardCanvasProps) {
    const { setNodeRef } = useDroppable({
        id: 'storyboard-canvas',
    });

    if (isLoading) {
        return (
            <Card className="flex items-center justify-center p-24">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </Card>
        );
    }

    if (items.length === 0) {
        return (
            <Card className="p-24 text-center border-dashed">
                <div className="mx-auto max-w-md">
                    <Plus className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
                    <h3 className="text-2xl font-semibold mb-2">Your Canvas Awaits</h3>
                    <p className="text-muted-foreground mb-6">
                        Generate scenes in the Script Editor, then send them here to build your storyboard
                    </p>
                    <Button asChild>
                        <Link href="/editor">Go to Script Editor</Link>
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <div
            ref={setNodeRef}
            className="relative min-h-[600px] bg-grid-pattern rounded-lg border-2 border-dashed border-muted-foreground/25 p-8"
            style={{
                backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
                backgroundSize: '20px 20px',
            }}
        >
            {items.map((item) => (
                <ImageCard
                    key={item.id}
                    item={item}
                    projectId={projectId}
                />
            ))}
        </div>
    );
}
