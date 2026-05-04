'use server';

import prisma from '@/lib/db/prisma';
import { ensureDefaultProject } from '@/lib/db/init';

export async function getProjectStats(projectId: string = 'default-project') {
    try {
        await ensureDefaultProject();

        const [loreCount, scriptCount, storyboardCount] = await Promise.all([
            prisma.loreEntry.count({ where: { projectId } }),
            prisma.script.count({ where: { projectId } }),
            prisma.storyboardItem.count({ where: { projectId } }),
        ]);

        // Get last updated lore entry
        const lastLore = await prisma.loreEntry.findFirst({
            where: { projectId },
            orderBy: { updatedAt: 'desc' },
            select: { updatedAt: true },
        });

        return {
            success: true,
            data: {
                loreCount,
                scriptCount,
                storyboardCount,
                lastUpdated: lastLore?.updatedAt || null,
            }
        };
    } catch (error) {
        console.error('Error fetching project stats:', error);
        return { success: false, error: 'Failed to fetch stats' };
    }
}
