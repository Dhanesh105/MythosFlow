/**
 * PollinationsService - Service for free AI image generation
 * No API key required.
 */
export class PollinationsService {
    /**
     * Generate an image URL from a prompt
     * @param prompt The image generation prompt
     * @returns The URL of the generated image
     */
    async generateImage(prompt: string): Promise<string> {
        try {
            // Pollinations AI uses a simple URL structure
            // We encode the prompt and add a seed for variety
            const encodedPrompt = encodeURIComponent(prompt);
            const seed = Math.floor(Math.random() * 1000000);
            const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}&width=1024&height=1024&nologo=true&enhance=true`;
            
            // We return the URL directly as Pollinations generates on-the-fly
            return imageUrl;
        } catch (error) {
            console.error('Error generating image with Pollinations:', error);
            throw new Error('Failed to generate image with Pollinations');
        }
    }
}

// Export singleton instance
export const pollinationsService = new PollinationsService();
