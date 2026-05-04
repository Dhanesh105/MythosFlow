/**
 * NvidiaService - Service for NVIDIA NIM AI operations
 * OpenAI-compatible API implementation
 */
export class NvidiaService {
    private apiKey: string;
    private baseUrl = 'https://integrate.api.nvidia.com/v1';
    private model = 'nvidia/nemotron-4-340b-instruct'; // Default Nemotron model

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    /**
     * Transform a script scene into a detailed Stable Diffusion prompt
     */
    async transformSceneToPrompt(sceneText: string): Promise<string> {
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

        return this.generateText(prompt);
    }

    /**
     * General text generation with NVIDIA NIM
     */
    async generateText(prompt: string): Promise<string> {
        try {
            if (!this.apiKey || this.apiKey === 'your_nvidia_api_key_here') {
                throw new Error('NVIDIA API Key not configured');
            }

            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.5,
                    top_p: 1,
                    max_tokens: 1024,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('NVIDIA API Error:', error);
                throw new Error(`NVIDIA API error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0].message.content.trim();
        } catch (error) {
            console.error('Error generating text with NVIDIA:', error);
            throw new Error('Failed to generate text with NVIDIA');
        }
    }
}

// Export singleton instance
export const nvidiaService = new NvidiaService(process.env.NVIDIA_API_KEY || '');
