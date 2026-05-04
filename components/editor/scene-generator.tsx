'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Send, RefreshCw, X } from 'lucide-react';
import { processScene } from '@/actions/scene';
import { addToStoryboard } from '@/actions/storyboard';
import { toast } from 'sonner';
import Image from 'next/image';

interface SceneGeneratorProps {
    isOpen: boolean;
    onClose: () => void;
    sceneText: string;
    projectId: string;
}

export function SceneGenerator({ isOpen, onClose, sceneText, projectId }: SceneGeneratorProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [result, setResult] = useState<{ prompt: string; imageUrl: string } | null>(null);

    const handleGenerate = async () => {
        if (!sceneText) {
            toast.error('Please write some script content first');
            return;
        }

        setIsGenerating(true);
        setResult(null);
        
        try {
            const response = await processScene(sceneText);
            if (response.success && response.data) {
                setResult(response.data);
                toast.success('Scene generated successfully');
            } else {
                toast.error(response.error || 'Failed to generate scene');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAddToStoryboard = async () => {
        if (!result) return;

        setIsAdding(true);
        try {
            const response = await addToStoryboard(projectId, result.imageUrl, result.prompt);
            if (response.success) {
                toast.success('Added to Storyboard');
                onClose();
            } else {
                toast.error('Failed to add to storyboard');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-slate-200 dark:border-slate-800">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
                        <Sparkles className="h-6 w-6 text-indigo-600" />
                        Generate Scene
                    </DialogTitle>
                    <DialogDescription>
                        Transform your script into a cinematic storyboard asset.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6">
                    {!result ? (
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Input Context</h4>
                                <p className="text-sm line-clamp-3 italic text-slate-600 dark:text-slate-400">
                                    "{sceneText || 'No text selected...'}"
                                </p>
                            </div>
                            <Button 
                                onClick={handleGenerate} 
                                disabled={isGenerating || !sceneText}
                                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Processing Cinematic Translation...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-5 w-5" />
                                        Generate Visual Scene
                                    </>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 group">
                                <Image 
                                    src={result.imageUrl} 
                                    alt="Generated Scene" 
                                    fill 
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    <p className="text-white text-xs font-medium line-clamp-2">
                                        {result.prompt}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">AI Translation</h4>
                                <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                    {result.prompt}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <Button 
                                    variant="outline" 
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                    className="flex-1 rounded-xl"
                                >
                                    <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                                    Regenerate
                                </Button>
                                <Button 
                                    onClick={handleAddToStoryboard}
                                    disabled={isAdding}
                                    className="flex-[2] bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-500/20"
                                >
                                    {isAdding ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="mr-2 h-4 w-4" />
                                    )}
                                    Send to Storyboard
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} className="rounded-xl">
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
