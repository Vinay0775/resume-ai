'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus, FileText, Trash2, Edit, Copy, MoreVertical,
  LogOut, Crown, Layout, Loader2, Sparkles, Clock, Moon, Sun,
  Database
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useFirebaseAuth } from '@/lib/useFirebaseAuth';

const templates = [
  { id: 'modern', name: 'Modern Professional', isPremium: false, gradient: 'from-slate-600 to-slate-800' },
  { id: 'classic', name: 'Classic Elegant', isPremium: false, gradient: 'from-gray-500 to-gray-700' },
  { id: 'creative', name: 'Creative Bold', isPremium: true, gradient: 'from-emerald-500 to-teal-600' },
  { id: 'minimal', name: 'Minimal Clean', isPremium: false, gradient: 'from-stone-400 to-stone-600' },
  { id: 'executive', name: 'Executive Suite', isPremium: true, gradient: 'from-amber-600 to-amber-800' },
  { id: 'tech', name: 'Tech Forward', isPremium: true, gradient: 'from-cyan-600 to-teal-700' },
];

interface Resume {
  id: string;
  title: string;
  templateId: string;
  resumeData: string;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const { user, setCurrentPage, setCurrentResumeId, setResumeData, setUser, setIsAuthenticated } = useAppStore();
  const { theme, setTheme } = useTheme();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [creating, setCreating] = useState(false);

  const fetchResumes = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/resumes?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setResumes(data);
      }
    } catch (err) {
      // Resume fetch error handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, [user?.id]);

  const handleCreateResume = async () => {
    if (!user?.id) return;
    setCreating(true);
    try {
      const defaultData = {
        personalInfo: { fullName: user.name || '', email: user.email || '', phone: '', location: '', title: '', website: '', linkedin: '', summary: '' },
        education: [],
        workExperience: [],
        skills: [],
        projects: [],
        sectionOrder: ['personalInfo', 'workExperience', 'education', 'skills', 'projects'],
      };

      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          title: newTitle || 'Untitled Resume',
          templateId: selectedTemplate,
          resumeData: defaultData,
        }),
      });

      if (res.ok) {
        const resume = await res.json();
        setResumeData(defaultData);
        setCurrentResumeId(resume.id);
        setCreateOpen(false);
        setNewTitle('');
        setCurrentPage('builder');
      }
    } catch (err) {
      // Resume creation error handled
    } finally {
      setCreating(false);
    }
  };

  const handleEditResume = async (resume: Resume) => {
    try {
      const data = JSON.parse(resume.resumeData || '{}');
      setResumeData({
        personalInfo: data.personalInfo || { fullName: '', email: '', phone: '', location: '', title: '', website: '', linkedin: '', summary: '' },
        education: data.education || [],
        workExperience: data.workExperience || [],
        skills: data.skills || [],
        projects: data.projects || [],
        sectionOrder: data.sectionOrder || ['personalInfo', 'workExperience', 'education', 'skills', 'projects'],
      });
      setCurrentResumeId(resume.id);
      setCurrentPage('builder');
    } catch (err) {
      // Parse error handled
    }
  };

  const handleDeleteResume = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/resumes/${deleteId}`, { method: 'DELETE' });
      setResumes(resumes.filter((r) => r.id !== deleteId));
    } catch (err) {
      // Delete error handled
    } finally {
      setDeleteId(null);
    }
  };

  const handleDuplicateResume = async (resume: Resume) => {
    if (!user?.id) return;
    try {
      await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          title: `${resume.title} (Copy)`,
          templateId: resume.templateId,
          resumeData: JSON.parse(resume.resumeData || '{}'),
        }),
      });
      fetchResumes();
    } catch (err) {
      // Resume duplication error handled
    }
  };

  const { logout: firebaseLogout } = useFirebaseAuth();

  const handleLogout = async () => {
    // Sign out from Firebase as well
    try {
      await firebaseLogout();
    } catch {
      // Firebase logout may fail if not initialized — that's fine
    }
    localStorage.removeItem('resumeai_user');
    setUser(null);
    setIsAuthenticated(false);
    setCurrentPage('landing');
  };

  const getTemplateName = (id: string) => templates.find((t) => t.id === id)?.name || id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button onClick={() => setCurrentPage('landing')} className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              ResumeAI
            </span>
          </button>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Badge variant={user?.plan === 'premium' ? 'default' : 'secondary'} className="gap-1">
              {user?.plan === 'premium' ? <Crown className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
              {user?.plan === 'premium' ? 'Premium' : 'Free Plan'}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-medium">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline">{user?.name || 'User'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setCurrentPage('admin')} className={user?.role === 'admin' ? '' : 'hidden'}>
                  <Database className="w-4 h-4 mr-2" />
                  Admin Panel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.name?.split(' ')[0] || 'User'}!
            </h1>
            <p className="text-muted-foreground mt-1">Manage your resumes and create new ones</p>
          </div>
          <Button
            onClick={() => setCreateOpen(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Resume
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-40 bg-muted rounded mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && resumes.length === 0 && (
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-4">
                <FileText className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No resumes yet</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Create your first professional resume with AI assistance. Our builder makes it easy to craft the perfect resume.
              </p>
              <Button
                onClick={() => setCreateOpen(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Resume
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Resume Grid */}
        {!loading && resumes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create New Card */}
            <Card
              className="border-dashed border-2 cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors group"
              onClick={() => setCreateOpen(true)}
            >
              <CardContent className="flex flex-col items-center justify-center h-64">
                <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-4 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950/50 transition-colors">
                  <Plus className="w-8 h-8 text-emerald-500" />
                </div>
                <p className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  Create New Resume
                </p>
              </CardContent>
            </Card>

            {/* Resume Cards */}
            {resumes.map((resume) => (
              <Card key={resume.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  {/* Preview Area */}
                  <div
                    className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-t-lg flex items-center justify-center cursor-pointer relative overflow-hidden"
                    onClick={() => handleEditResume(resume)}
                  >
                    <div className="w-24 h-32 bg-white dark:bg-gray-800 rounded shadow-lg p-2 scale-75">
                      <div className="h-2 w-12 bg-slate-300 dark:bg-slate-600 rounded mb-1.5" />
                      <div className="h-1.5 w-16 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                      <div className="space-y-1">
                        <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                        <div className="h-1 w-4/5 bg-slate-200 dark:bg-slate-700 rounded" />
                        <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditResume(resume)}>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateResume(resume)}>
                            <Copy className="w-4 h-4 mr-2" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteId(resume.id)}
                            className="text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold truncate">{resume.title}</h3>
                    <div className="flex items-center gap-2 mt-1.5 text-sm text-muted-foreground">
                      <Layout className="w-3.5 h-3.5" />
                      <span>{getTemplateName(resume.templateId)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(resume.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => handleEditResume(resume)}
                    >
                      <Edit className="w-3.5 h-3.5 mr-1.5" />
                      Edit Resume
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Create Resume Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>
              Choose a template and give your resume a name to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Resume Title</Label>
              <Input
                placeholder="e.g., Software Engineer Resume"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Choose Template</Label>
              <div className="grid grid-cols-3 gap-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`relative rounded-lg border-2 p-2 transition-all text-left ${
                      selectedTemplate === template.id
                        ? 'border-emerald-500 shadow-md'
                        : 'border-transparent hover:border-muted'
                    }`}
                  >
                    <div className={`h-16 rounded bg-gradient-to-br ${template.gradient} mb-1.5`} />
                    <p className="text-xs font-medium truncate">{template.name}</p>
                    {template.isPremium && (
                      <Badge className="absolute -top-1 -right-1 text-[10px] px-1 py-0" variant="secondary">
                        <Crown className="w-2.5 h-2.5 mr-0.5" /> Pro
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateResume}
              disabled={creating}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
            >
              {creating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" /> Create Resume
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resume</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this resume? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteResume} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
