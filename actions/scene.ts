'use server';

import { geminiService } from '@/lib/ai/gemini';
import { nvidiaService } from '@/lib/ai/nvidia';
import { replicateService } from '@/lib/ai/replicate';
import prisma from '@/lib/db/prisma';

/**
 * Transform a scene into a Stable Diffusion prompt
 */
export async function transformSceneToPrompt(sceneText: string, projectId: string = 'default-project') {
    try {
        // Fetch provider preference
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            select: { aiProvider: true }
        });

        const provider = project?.aiProvider || 'gemini';
        let prompt;

        if (provider === 'nvidia') {
            prompt = await nvidiaService.transformSceneToPrompt(sceneText);
        } else {
            prompt = await geminiService.transformSceneToPrompt(sceneText);
        }

        return { success: true, data: prompt };
    } catch (error) {
        console.error('Error transforming scene to prompt:', error);
        return { success: false, error: 'Failed to transform scene to prompt' };
    }
}

/**
 * Generate an image from a prompt using Stable Diffusion XL
 */
export async function generateSceneImage(prompt: string) {
    try {
        const imageUrl = await replicateService.generateImage(prompt);
        return { success: true, data: imageUrl };
    } catch (error) {
        console.error('Error generating image:', error);
        return { success: false, error: 'Failed to generate image' };
    }
}

/**
 * Combined action: transform scene and generate image
 */
export async function processScene(sceneText: string) {
    try {
        // Transform scene to prompt
        const promptResult = await transformSceneToPrompt(sceneText);
        if (!promptResult.success) {
            return promptResult;
        }

        // Generate image from prompt
        const promptData = promptResult.data;
        if (!promptData) {
             return { success: false, error: 'Prompt generation returned empty data' };
        }

        const imageResult = await generateSceneImage(promptData);
        if (!imageResult.success) {
            return imageResult;
        }

        return {
            success: true,
            data: {
                prompt: promptResult.data,
                imageUrl: imageResult.data,
            },
        };
    } catch (error) {
        console.error('Error processing scene:', error);
        return { success: false, error: 'Failed to process scene' };
    }
}
