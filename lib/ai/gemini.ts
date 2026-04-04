import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * GeminiService - Centralized service for Gemini AI operations
 */
export class GeminiService {
    private model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    private embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });

    /**
     * Generate embeddings for text (for RAG/vector search)
     */
    async generateEmbedding(text: string): Promise<number[]> {
        try {
            const result = await this.embeddingModel.embedContent(text);
            return result.embedding.values;
        } catch (error) {
            console.error('Error generating embedding:', error);
            throw new Error('Failed to generate embedding');
        }
    }

    /**
     * Transform a script scene into a detailed Stable Diffusion prompt
     */
    async transformSceneToPrompt(sceneText: string): Promise<string> {
        try {
            const prompt = `Transform this script scene into a highly detailed, cinematic Stable Diffusion prompt focused on mythic sci-fi aesthetics. The prompt should be vivid, specific, and optimized for image generation.

Scene:
${sceneText}

Create a detailed Stable Diffusion prompt that captures the essence of this scene. Include:
- Visual style (mythic sci-fi, cinematic, epic)
- Composition and framing
- Lighting and atmosphere
- Key subjects and their appearance
- Environmental details
- Mood and tone

Output only the prompt, no preamble or explanation.`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error) {
            console.error('Error transforming scene to prompt:', error);
            throw new Error('Failed to transform scene to prompt');
        }
    }

    /**
     * General text generation with Gemini
     */
    async generateText(prompt: string): Promise<string> {
        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error generating text:', error);
            throw new Error('Failed to generate text');
        }
    }
}

// Export singleton instance
export const geminiService = new GeminiService();
