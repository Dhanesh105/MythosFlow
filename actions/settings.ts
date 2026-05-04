'use server';

import prisma from '@/lib/db/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Pinecone } from '@pinecone-database/pinecone';

export async function checkServiceStatus() {
    const results = {
        database: { status: 'unknown', message: 'Not checked' },
        gemini: { status: 'unknown', message: 'Not checked' },
        pinecone: { status: 'unknown', message: 'Not checked' },
    };

    try {
        // 1. Check Database
        try {
            await prisma.$queryRaw`SELECT 1`;
            results.database = { status: 'connected', message: 'Railway PostgreSQL is online' };
        } catch (e) {
            results.database = { status: 'error', message: 'Database unreachable' };
        }

        // 2. Check Gemini
        try {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            await model.generateContent('ping');
            results.gemini = { status: 'connected', message: 'Gemini 1.5 Pro is active' };
        } catch (e) {
            results.gemini = { status: 'error', message: 'Invalid API Key or quota exceeded' };
        }

        // 3. Check Pinecone
        try {
            const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' });
            await pinecone.listIndexes();
            results.pinecone = { status: 'connected', message: 'Pinecone Vector DB is ready' };
        } catch (e) {
            results.pinecone = { status: 'error', message: 'Pinecone connection failed' };
        }

        // 4. Check NVIDIA
        try {
            if (process.env.NVIDIA_API_KEY && process.env.NVIDIA_API_KEY !== 'your_nvidia_api_key_here') {
                const response = await fetch('https://integrate.api.nvidia.com/v1/models', {
                    headers: { 'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}` }
                });
                if (response.ok) {
                    results.nvidia = { status: 'connected', message: 'NVIDIA Nemotron is active' };
                } else {
                    results.nvidia = { status: 'error', message: 'Invalid NVIDIA API Key' };
                }
            } else {
                results.nvidia = { status: 'unknown', message: 'NVIDIA Key not configured' };
            }
        } catch (e) {
            results.nvidia = { status: 'error', message: 'NVIDIA service unreachable' };
        }

        return { success: true, data: results };
    } catch (error) {
        console.error('Service Check Failed:', error);
        return { success: false, error: 'Health check failed' };
    }
}

export async function updateProjectSettings(id: string, data: { name: string; description?: string; aiProvider?: string }) {
    try {
        await prisma.project.update({
            where: { id },
            data,
        });
        return { success: true };
    } catch (error) {
        console.error('Update Project Error:', error);
        return { success: false, error: 'Failed to update settings' };
    }
}

export async function getProjectDetails(id: string = 'default-project') {
    try {
        const project = await prisma.project.findUnique({
            where: { id },
        });
        return { success: true, data: project };
    } catch (error) {
        console.error('Get Project Error:', error);
        return { success: false, error: 'Failed to fetch project' };
    }
}

