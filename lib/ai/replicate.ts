import Replicate from 'replicate';

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN || '',
});

/**
 * ReplicateService - Service for AI image generation using Stable Diffusion XL
 */
export class ReplicateService {
    /**
     * Generate an image using Stable Diffusion XL
     */
    async generateImage(
        prompt: string,
        options?: {
            negativePrompt?: string;
            width?: number;
            height?: number;
            numInferenceSteps?: number;
            guidanceScale?: number;
        }
    ): Promise<string> {
        try {
            const input = {
                prompt,
                negative_prompt: options?.negativePrompt || 'ugly, blurry, low quality, distorted',
                width: options?.width || 1024,
                height: options?.height || 1024,
                num_inference_steps: options?.numInferenceSteps || 50,
                guidance_scale: options?.guidanceScale || 7.5,
            };

            const output = await replicate.run(
                'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
                { input }
            ) as string[];

            // Return the first generated image URL
            if (output && output.length > 0) {
                return output[0];
            }

            throw new Error('No image generated');
        } catch (error) {
            console.error('Error generating image:', error);
            throw new Error('Failed to generate image');
        }
    }

    /**
     * Generate an image with progress tracking
     */
    async generateImageWithProgress(
        prompt: string,
        onProgress?: (progress: number) => void
    ): Promise<string> {
        try {
            const prediction = await replicate.predictions.create({
                version: '39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
                input: {
                    prompt,
                    negative_prompt: 'ugly, blurry, low quality, distorted',
                    width: 1024,
                    height: 1024,
                },
            });

            let completedPrediction = prediction;

            // Poll for completion
            while (
                completedPrediction.status === 'starting' ||
                completedPrediction.status === 'processing'
            ) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                completedPrediction = await replicate.predictions.get(prediction.id);

                // Report progress if callback provided
                if (onProgress) {
                    const progressPercent = this.calculateProgress(completedPrediction.status);
                    onProgress(progressPercent);
                }
            }

            if (completedPrediction.status === 'succeeded' && completedPrediction.output) {
                const output = completedPrediction.output as string[];
                return output[0];
            }

            throw new Error('Image generation failed');
        } catch (error) {
            console.error('Error generating image with progress:', error);
            throw new Error('Failed to generate image');
        }
    }

    private calculateProgress(status: string): number {
        switch (status) {
            case 'starting':
                return 10;
            case 'processing':
                return 50;
            case 'succeeded':
                return 100;
            default:
                return 0;
        }
    }
}

// Export singleton instance
export const replicateService = new ReplicateService();
