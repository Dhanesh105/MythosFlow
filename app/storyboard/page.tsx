'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Image as ImageIcon, Save, Download } from 'lucide-react';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStoryboardItems, saveStoryboard } from '@/actions/storyboard';
import { StoryboardCanvas } from '@/components/storyboard/storyboard-canvas';

// Temporary project ID - in a real app, this would come from user context
const PROJECT_ID = 'default-project';

export default function StoryboardPage() {
    const queryClient = useQueryClient();
    const [items, setItems] = useState<any[]>([]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const { data: storyboardItems, isLoading } = useQuery({
        queryKey: ['storyboardItems', PROJECT_ID],
        queryFn: async () => {
            const result = await getStoryboardItems(PROJECT_ID);
            if (result.success) {
                setItems(result.data || []);
                return result.data || [];
            }
            return [];
        },
    });

    const saveMutation = useMutation({
        mutationFn: async () => {
            return await saveStoryboard(PROJECT_ID, items);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['storyboardItems', PROJECT_ID] });
        },
    });

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event;
        const itemId = active.id as string;

        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId
                    ? {
                        ...item,
                        positionX: item.positionX + delta.x,
                        positionY: item.positionY + delta.y,
                    }
                    : item
            )
        );
    };

    const handleSave = () => {
        saveMutation.mutate();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 dark:from-slate-950 dark:via-indigo-950/30 dark:to-purple-950/30">
            <div className="container mx-auto p-6 lg:p-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <SidebarTrigger />
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                                <ImageIcon className="h-8 w-8 text-indigo-600" />
                                Storyboard
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Organize and visualize your scenes
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handleSave}
                            disabled={saveMutation.isPending}
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {saveMutation.isPending ? 'Saving...' : 'Save'}
                        </Button>
                        <Button variant="secondary">
                            <Download className="h-4 w-4 mr-2" />
                            Export PDF
                        </Button>
                    </div>
                </div>

                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                    <StoryboardCanvas items={items} isLoading={isLoading} projectId={PROJECT_ID} />
                </DndContext>
            </div>
        </div>
    );
}
