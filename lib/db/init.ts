import prisma from './prisma';

const DEFAULT_PROJECT_ID = 'default-project';

/**
 * Ensures that the default project exists in the database.
 * This is crucial for fresh deployments where the DB might be empty.
 */
export async function ensureDefaultProject() {
    try {
        const project = await prisma.project.findUnique({
            where: { id: DEFAULT_PROJECT_ID },
        });

        if (!project) {
            console.log('Creating default project...');
            await prisma.project.create({
                data: {
                    id: DEFAULT_PROJECT_ID,
                    name: 'MythosFlow Default Project',
                    description: 'The initial project for your mythic storytelling.',
                    userId: 'system', // Default system user
                },
            });
            console.log('Default project created successfully.');
        }
    } catch (error) {
        console.error('Error ensuring default project:', error);
        // We don't throw here to avoid crashing the whole action, 
        // but it might cause foreign key errors later if it fails.
    }
}
