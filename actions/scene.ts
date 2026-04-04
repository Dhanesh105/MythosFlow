'use server';

import { geminiService } from '@/lib/ai/gemini';
import { replicateService } from '@/lib/ai/replicate';

/**
 * Transform a scene into a Stable Diffusion prompt
 */
export async function transformSceneToPrompt(sceneText: string) {
    try {
        const prompt = await geminiService.transformSceneToPrompt(sceneText);
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
        const imageResult = await generateSceneImage(promptResult.data);
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
