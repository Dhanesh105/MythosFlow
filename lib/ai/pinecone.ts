import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || '',
});

const INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'mythosflow';

/**
 * PineconeService - Service for vector storage and semantic search
 */
export class PineconeService {
    private index = pinecone.index(INDEX_NAME);

    /**
     * Upsert a vector with metadata to Pinecone
     */
    async upsertVector(
        id: string,
        vector: number[],
        metadata: Record<string, any>,
        namespace?: string
    ): Promise<void> {
        try {
            const ns = this.index.namespace(namespace || 'default');
            await ns.upsert([
                {
                    id,
                    values: vector,
                    metadata,
                },
            ]);
        } catch (error) {
            console.error('Error upserting vector:', error);
            throw new Error('Failed to upsert vector to Pinecone');
        }
    }

    /**
     * Query vectors for semantic search
     */
    async queryVectors(
        vector: number[],
        topK: number = 5,
        namespace?: string,
        filter?: Record<string, any>
    ): Promise<{
        id: string;
        score: number;
        metadata: Record<string, any>;
    }[]> {
        try {
            const ns = this.index.namespace(namespace || 'default');
            const queryResponse = await ns.query({
                vector,
                topK,
                includeMetadata: true,
                filter,
            });

            return (queryResponse.matches || []).map((match) => ({
                id: match.id,
                score: match.score || 0,
                metadata: (match.metadata as Record<string, any>) || {},
            }));
        } catch (error) {
            console.error('Error querying vectors:', error);
            throw new Error('Failed to query vectors from Pinecone');
        }
    }

    /**
     * Delete a vector by ID
     */
    async deleteVector(id: string, namespace?: string): Promise<void> {
        try {
            const ns = this.index.namespace(namespace || 'default');
            await ns.deleteOne(id);
        } catch (error) {
            console.error('Error deleting vector:', error);
            throw new Error('Failed to delete vector from Pinecone');
        }
    }

    /**
     * Delete vectors by filter
     */
    async deleteVectorsByFilter(
        filter: Record<string, any>,
        namespace?: string
    ): Promise<void> {
        try {
            const ns = this.index.namespace(namespace || 'default');
            await ns.deleteMany(filter);
        } catch (error) {
            console.error('Error deleting vectors by filter:', error);
            throw new Error('Failed to delete vectors from Pinecone');
        }
    }

    /**
     * Get namespace for a project
     */
    getProjectNamespace(projectId: string): string {
        return `project-${projectId}`;
    }
}

// Export singleton instance
export const pineconeService = new PineconeService();
