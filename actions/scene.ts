'use server';

import prisma from '@/lib/db/prisma';
import { geminiService } from '@/lib/ai/gemini';
import { nvidiaService } from '@/lib/ai/nvidia';
import { replicateService } from '@/lib/ai/replicate';
import { pollinationsService } from '@/lib/ai/pollinations';

/**
 * Transform a raw scene description into a high-quality image prompt
 */
export async function transformSceneToPrompt(sceneText: string, projectId: string = 'default-project') {
    try {
        let provider = 'nvidia';
        
        try {
            // Try to fetch provider preference
            const project = await prisma.project.findUnique({
                where: { id: projectId },
            }) as any; // Cast to any to bypass Prisma sync lag
            
            provider = project?.aiProvider || 'nvidia';
        } catch (dbError) {
            console.warn('Database unreachable, defaulting to NVIDIA for prompt transformation');
            // Fallback to NVIDIA if DB is down
        }

        let prompt;
        if (provider === 'nvidia') {
            prompt = await nvidiaService.transformSceneToPrompt(sceneText);
        } else {
            prompt = await geminiService.transformSceneToPrompt(sceneText);
        }

        return { success: true, data: prompt };
    } catch (error) {
        console.error('Error transforming scene to prompt:', error);
        return { success: false, error: 'AI generation failed. Please check your API keys.' };
    }
}

/**
 * Generate an image from a prompt using the preferred provider
 */
export async function generateSceneImage(prompt: string, projectId: string = 'default-project') {
    try {
        let provider = 'pollinations';
        
        try {
            const project = await prisma.project.findUnique({
                where: { id: projectId },
            }) as any; // Cast to any to bypass Prisma sync lag
            
            provider = project?.imageProvider || 'pollinations';
        } catch (dbError) {
            console.warn('Database unreachable, defaulting to Pollinations for image generation');
        }

        if (provider === 'pollinations') {
            const imageUrl = await pollinationsService.generateImage(prompt);
            return { success: true, data: imageUrl };
        }

        const imageUrl = await replicateService.generateImage(prompt);
        return { success: true, data: imageUrl };
    } catch (error) {
        console.error('Error generating image:', error);
        return { success: false, error: 'Image engine failed. Try switching to Pollinations (Free) in Settings.' };
    }
}

/**
 * Full pipeline: Text -> Prompt -> Image
 */
export async function processScene(sceneText: string, projectId: string = 'default-project') {
    try {
        // 1. Transform scene to prompt
        const promptResult = await transformSceneToPrompt(sceneText, projectId);
        if (!promptResult.success || !promptResult.data) {
            return promptResult;
        }

        // 2. Generate image from prompt
        const imageResult = await generateSceneImage(promptResult.data, projectId);
        if (!imageResult.success || !imageResult.data) {
            return imageResult;
        }

        return {
            success: true,
            data: {
                prompt: promptResult.data,
                imageUrl: imageResult.data
            }
        };
    } catch (error) {
        console.error('Error in scene processing pipeline:', error);
        return { success: false, error: 'Failed to process scene' };
    }
}
