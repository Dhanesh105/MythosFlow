'use server';

import prisma from '@/lib/db/prisma';
import { geminiService } from '@/lib/ai/gemini';
import { pineconeService } from '@/lib/ai/pinecone';
import { revalidatePath } from 'next/cache';

/**
 * Create a new lore entry with embedding generation and Pinecone storage
 */
export async function createLoreEntry(
    projectId: string,
    title: string,
    content: string
) {
    try {
        // Generate embedding using Gemini
        const embedding = await geminiService.generateEmbedding(content);

        // Create the lore entry in the database
        const loreEntry = await prisma.loreEntry.create({
            data: {
                projectId,
                title,
                content,
            },
        });

        // Store in Pinecone with metadata
        const namespace = pineconeService.getProjectNamespace(projectId);
        await pineconeService.upsertVector(
            loreEntry.id,
            embedding,
            {
                title,
                content,
                projectId,
                createdAt: loreEntry.createdAt.toISOString(),
            },
            namespace
        );

        // Update the lore entry with Pinecone ID
        await prisma.loreEntry.update({
            where: { id: loreEntry.id },
            data: { pineconeId: loreEntry.id },
        });

        revalidatePath('/lore-vault');

        return { success: true, data: loreEntry };
    } catch (error) {
        console.error('Error creating lore entry:', error);
        return { success: false, error: 'Failed to create lore entry' };
    }
}

/**
 * Search for relevant lore entries using semantic search
 */
export async function searchLore(
    projectId: string,
    query: string,
    topK: number = 5
) {
    try {
        // Generate embedding for the search query
        const queryEmbedding = await geminiService.generateEmbedding(query);

        // Search in Pinecone
        const namespace = pineconeService.getProjectNamespace(projectId);
        const results = await pineconeService.queryVectors(
            queryEmbedding,
            topK,
            namespace,
            { projectId }
        );

        // Fetch full lore entries from database
        const loreEntries = await Promise.all(
            results.map(async (result) => {
                const entry = await prisma.loreEntry.findUnique({
                    where: { id: result.id },
                });
                return {
                    ...entry,
                    similarity: result.score,
                };
            })
        );

        return { success: true, data: loreEntries.filter(Boolean) };
    } catch (error) {
        console.error('Error searching lore:', error);
        return { success: false, error: 'Failed to search lore' };
    }
}

/**
 * Get all lore entries for a project
 */
export async function getLoreEntries(projectId: string) {
    try {
        const entries = await prisma.loreEntry.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' },
        });

        return { success: true, data: entries };
    } catch (error) {
        console.error('Error fetching lore entries:', error);
        return { success: false, error: 'Failed to fetch lore entries' };
    }
}

/**
 * Update a lore entry
 */
export async function updateLoreEntry(
    id: string,
    data: { title?: string; content?: string }
) {
    try {
        const entry = await prisma.loreEntry.update({
            where: { id },
            data,
        });

        // If content changed, update the embedding
        if (data.content) {
            const embedding = await geminiService.generateEmbedding(data.content);
            const namespace = pineconeService.getProjectNamespace(entry.projectId);

            await pineconeService.upsertVector(
                id,
                embedding,
                {
                    title: data.title || entry.title,
                    content: data.content,
                    projectId: entry.projectId,
                    updatedAt: new Date().toISOString(),
                },
                namespace
            );
        }

        revalidatePath('/lore-vault');

        return { success: true, data: entry };
    } catch (error) {
        console.error('Error updating lore entry:', error);
        return { success: false, error: 'Failed to update lore entry' };
    }
}

/**
 * Delete a lore entry
 */
export async function deleteLoreEntry(id: string) {
    try {
        const entry = await prisma.loreEntry.findUnique({
            where: { id },
        });

        if (!entry) {
            return { success: false, error: 'Lore entry not found' };
        }

        // Delete from Pinecone
        const namespace = pineconeService.getProjectNamespace(entry.projectId);
        await pineconeService.deleteVector(id, namespace);

        // Delete from database
        await prisma.loreEntry.delete({
            where: { id },
        });

        revalidatePath('/lore-vault');

        return { success: true };
    } catch (error) {
        console.error('Error deleting lore entry:', error);
        return { success: false, error: 'Failed to delete lore entry' };
    }
}
