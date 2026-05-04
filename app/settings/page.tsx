'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Settings, Database, Cpu, Globe, ShieldCheck, RefreshCw, Loader2, Save, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { checkServiceStatus, updateProjectSettings, getProjectDetails } from '@/actions/settings';
import { toast } from 'sonner';

const DEFAULT_PROJECT_ID = 'default-project';

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    
    const [projectName, setProjectName] = useState('');
    const [projectDesc, setProjectDesc] = useState('');
    const [aiProvider, setAiProvider] = useState('gemini');
    
    const [status, setStatus] = useState<any>({
        database: { status: 'unknown', message: 'Ready to check' },
        gemini: { status: 'unknown', message: 'Ready to check' },
        pinecone: { status: 'unknown', message: 'Ready to check' },
        nvidia: { status: 'unknown', message: 'Ready to check' }
    });

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            const result = await getProjectDetails(DEFAULT_PROJECT_ID);
            if (result.success && result.data) {
                setProjectName(result.data.name);
                setProjectDesc(result.data.description || '');
                setAiProvider(result.data.aiProvider || 'gemini');
            }
            setIsLoading(false);
            
            // Initial health check
            runHealthCheck();
        };
        fetchData();
    }, []);

    const runHealthCheck = async () => {
        setIsChecking(true);
        const result = await checkServiceStatus();
        if (result.success) {
            setStatus(result.data);
            toast.success('System health check complete');
        } else {
            toast.error('Failed to run health check');
        }
        setIsChecking(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        const result = await updateProjectSettings(DEFAULT_PROJECT_ID, {
            name: projectName,
            description: projectDesc,
            aiProvider: aiProvider
        });
        
        if (result.success) {
            toast.success('Project settings updated successfully');
        } else {
            toast.error('Failed to update project settings');
        }
        setIsSaving(false);
    };

    const handleReset = () => {
        setProjectName('MythosFlow Default Project');
        setProjectDesc('The initial project for your mythic storytelling.');
        setAiProvider('gemini');
        toast.info('Preferences reset to defaults (unsaved)');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/50 to-slate-200/50 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-800/50">
            <div className="container mx-auto p-4 sm:p-6 lg:p-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-6">
                    <div className="flex items-center gap-4 sm:gap-6">
                        <SidebarTrigger className="h-10 w-10 shrink-0" />
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent flex items-center gap-3">
                                <Settings className="h-7 w-7 sm:h-9 sm:w-9 text-slate-700 dark:text-slate-300" />
                                Settings
                            </h1>
                            <p className="text-muted-foreground text-sm sm:text-lg mt-1 sm:mt-2 font-medium">
                                Manage your project configuration
                            </p>
                        </div>
                    </div>
                    <Button 
                        onClick={runHealthCheck} 
                        disabled={isChecking}
                        variant="outline" 
                        className="rounded-full gap-2 shadow-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm w-full sm:w-auto"
                    >
                        {isChecking ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                        Re-scan Infrastructure
                    </Button>
                </div>

                <div className="grid gap-6 sm:gap-8 max-w-4xl">
                    {/* Project Configuration */}
                    <Card className="border-none bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-xl">
                        <CardHeader className="p-5 sm:p-6">
                            <div className="flex items-center gap-2 text-primary mb-1">
                                <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Global</span>
                            </div>
                            <CardTitle className="text-xl sm:text-2xl">Project Configuration</CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                                Identity and fundamental settings for MythosFlow.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 p-5 sm:p-6 pt-0 sm:pt-0">
                            <div className="grid gap-2">
                                <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider">Project Name</label>
                                <Input 
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    placeholder="Enter project name..."
                                    className="rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider">Description</label>
                                <Textarea 
                                    value={projectDesc}
                                    onChange={(e) => setProjectDesc(e.target.value)}
                                    placeholder="Enter project description..."
                                    className="rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                                    rows={3}
                                />
                            </div>

                            <div className="grid gap-2">
                                <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider">Primary AI Provider</label>
                                <Select value={aiProvider} onValueChange={setAiProvider}>
                                    <SelectTrigger className="rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                                        <SelectValue placeholder="Select provider" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="gemini">Google Gemini 1.5 Pro</SelectItem>
                                        <SelectItem value="nvidia">NVIDIA Nemotron 3 Super</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider">Project ID (Read Only)</label>
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden">
                                    <code className="text-xs font-mono flex-1 text-slate-600 dark:text-slate-400 truncate">{DEFAULT_PROJECT_ID}</code>
                                    <span className="text-[10px] bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full font-bold">ACTIVE</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Infrastructure Status */}
                    <Card className="border-none bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-xl overflow-hidden">
                        <CardHeader className="p-5 sm:p-6">
                            <div className="flex items-center gap-2 text-indigo-600 mb-1">
                                <Database className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Infrastructure</span>
                            </div>
                            <CardTitle className="text-xl sm:text-2xl">Service Health</CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                                Real-time connection status to providers.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-0">
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                <StatusRow 
                                    title="Railway PostgreSQL" 
                                    status={status.database.status} 
                                    message={status.database.message}
                                    icon={<Database className="h-5 w-5" />}
                                    color="blue"
                                />
                                <StatusRow 
                                    title="Gemini 1.5 Pro" 
                                    status={status.gemini.status} 
                                    message={status.gemini.message}
                                    icon={<Cpu className="h-5 w-5" />}
                                    color="purple"
                                />
                                <StatusRow 
                                    title="NVIDIA Nemotron" 
                                    status={status.nvidia?.status || 'unknown'} 
                                    message={status.nvidia?.message || 'Not configured'}
                                    icon={<Zap className="h-5 w-5" />}
                                    color="orange"
                                />
                                <StatusRow 
                                    title="Pinecone Vector DB" 
                                    status={status.pinecone.status} 
                                    message={status.pinecone.message}
                                    icon={<ShieldCheck className="h-5 w-5" />}
                                    color="indigo"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col sm:flex-row justify-end gap-4 pb-10">
                        <Button 
                            variant="outline" 
                            className="rounded-xl px-6 w-full sm:w-auto order-2 sm:order-1"
                            onClick={handleReset}
                        >
                            Reset Defaults
                        </Button>
                        <Button 
                            className="rounded-xl bg-slate-900 dark:bg-slate-100 dark:text-slate-900 gap-2 px-8 min-w-[160px] shadow-lg shadow-slate-500/20 w-full sm:w-auto order-1 sm:order-2"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Commit Changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusRow({ title, status, message, icon, color }: { title: string, status: string, message: string, icon: React.ReactNode, color: string }) {
    const isConnected = status === 'connected';
    const isError = status === 'error';
    
    return (
        <div className="flex items-center justify-between p-4 sm:p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors gap-4">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className={`p-2 sm:p-3 rounded-2xl bg-${color}-100/50 dark:bg-${color}-900/20 text-${color}-600 dark:text-${color}-400 shrink-0`}>
                    {icon}
                </div>
                <div className="min-w-0">
                    <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 truncate">{title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        {isConnected ? (
                            <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
                        ) : isError ? (
                            <AlertCircle className="h-3 w-3 text-red-500 shrink-0" />
                        ) : (
                            <Loader2 className="h-3 w-3 animate-spin text-slate-400 shrink-0" />
                        )}
                        <p className={`text-[10px] sm:text-xs font-medium truncate ${
                            isConnected ? 'text-green-600 dark:text-green-400' : 
                            isError ? 'text-red-600 dark:text-red-400' : 
                            'text-slate-500'
                        }`}>
                            {message}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <span className={`hidden xs:inline-block text-[8px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                    isConnected ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                    isError ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                    'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                    {isConnected ? 'Active' : isError ? 'Offline' : 'Pending'}
                </span>
                <div className={`h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full ${
                    isConnected ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse' : 
                    isError ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]' : 
                    'bg-slate-300 dark:bg-slate-700'
                }`} />
            </div>
        </div>
    );
}
