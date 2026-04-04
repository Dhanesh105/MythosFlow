'use server';

import prisma from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Add an image to the storyboard
 */
export async function addToStoryboard(
    projectId: string,
    imageUrl: string,
    scenePrompt?: string
) {
    try {
        // Get the current max order
        const maxOrder = await prisma.storyboardItem.aggregate({
            where: { projectId },
            _max: { order: true },
        });

        const item = await prisma.storyboardItem.create({
            data: {
                projectId,
                imageUrl,
                scenePrompt,
                order: (maxOrder._max.order || 0) + 1,
            },
        });

        revalidatePath('/storyboard');

        return { success: true, data: item };
    } catch (error) {
        console.error('Error adding to storyboard:', error);
        return { success: false, error: 'Failed to add to storyboard' };
    }
}

/**
 * Update a storyboard item
 */
export async function updateStoryboardItem(
    id: string,
    data: {
        positionX?: number;
        positionY?: number;
        dialogue?: string;
        cameraAngle?: string;
    }
) {
    try {
        const item = await prisma.storyboardItem.update({
            where: { id },
            data,
        });

        revalidatePath('/storyboard');

        return { success: true, data: item };
    } catch (error) {
        console.error('Error updating storyboard item:', error);
        return { success: false, error: 'Failed to update storyboard item' };
    }
}

/**
 * Save all storyboard positions (batch update)
 */
export async function saveStoryboard(
    projectId: string,
    items: Array<{
        id: string;
        positionX: number;
        positionY: number;
        order: number;
    }>
) {
    try {
        await Promise.all(
            items.map((item) =>
                prisma.storyboardItem.update({
                    where: { id: item.id },
                    data: {
                        positionX: item.positionX,
                        positionY: item.positionY,
                        order: item.order,
                    },
                })
            )
        );

        revalidatePath('/storyboard');

        return { success: true };
    } catch (error) {
        console.error('Error saving storyboard:', error);
        return { success: false, error: 'Failed to save storyboard' };
    }
}

/**
 * Get all storyboard items for a project
 */
export async function getStoryboardItems(projectId: string) {
    try {
        const items = await prisma.storyboardItem.findMany({
            where: { projectId },
            orderBy: { order: 'asc' },
        });

        return { success: true, data: items };
    } catch (error) {
        console.error('Error fetching storyboard items:', error);
        return { success: false, error: 'Failed to fetch storyboard items' };
    }
}

/**
 * Delete a storyboard item
 */
export async function deleteStoryboardItem(id: string) {
    try {
        await prisma.storyboardItem.delete({
            where: { id },
        });

        revalidatePath('/storyboard');

        return { success: true };
    } catch (error) {
        console.error('Error deleting storyboard item:', error);
        return { success: false, error: 'Failed to delete storyboard item' };
    }
}
