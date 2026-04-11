'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft, Users, FileText, Layout, Database,
  Shield, Crown, Clock, Mail, Key, CreditCard
} from 'lucide-react';

interface UserRecord {
  id: string;
  name: string | null;
  email: string;
  plan: string;
  aiCreditsUsed: number;
  aiCreditsLimit: number;
  createdAt: string;
}

interface ResumeRecord {
  id: string;
  userId: string;
  title: string;
  templateId: string;
  resumeData: string;
  createdAt: string;
  updatedAt: string;
}

interface TemplateRecord {
  id: string;
  name: string;
  description: string | null;
  isPremium: boolean;
  category: string;
}

export default function AdminPanel() {
  const { setCurrentPage } = useAppStore();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [templates, setTemplates] = useState<TemplateRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users via admin API
        const usersRes = await fetch('/api/admin/data');
        if (usersRes.ok) {
          const data = await usersRes.json();
          setUsers(data.users || []);
          setResumes(data.resumes || []);
          setTemplates(data.templates || []);
        }
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setCurrentPage('dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Dashboard
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-lg">Admin Panel</span>
            </div>
          </div>
          <Badge variant="outline" className="gap-1">
            <Shield className="w-3 h-3" /> Database Viewer
          </Badge>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{loading ? '...' : users.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center">
                <FileText className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Resumes</p>
                <p className="text-2xl font-bold">{loading ? '...' : resumes.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 flex items-center justify-center">
                <Layout className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Templates</p>
                <p className="text-2xl font-bold">{loading ? '...' : templates.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Tables */}
        <Tabs defaultValue="users">
          <TabsList className="mb-4">
            <TabsTrigger value="users" className="gap-1.5">
              <Users className="w-4 h-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="resumes" className="gap-1.5">
              <FileText className="w-4 h-4" /> Resumes
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-1.5">
              <Layout className="w-4 h-4" /> Templates
            </TabsTrigger>
          </TabsList>

          {/* Users Table */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" /> All Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                    ))}
                  </div>
                ) : users.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No users found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Plan</TableHead>
                          <TableHead>AI Credits</TableHead>
                          <TableHead>Created</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-mono text-xs">
                              <span className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
                                {user.id.substring(0, 12)}...
                              </span>
                            </TableCell>
                            <TableCell className="font-medium">{user.name || '—'}</TableCell>
                            <TableCell>
                              <span className="flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                                {user.email}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.plan === 'premium' ? 'default' : 'secondary'} className="gap-1">
                                {user.plan === 'premium' ? <Crown className="w-3 h-3" /> : <CreditCard className="w-3 h-3" />}
                                {user.plan}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {user.aiCreditsUsed} / {user.aiCreditsLimit}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-xs">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(user.createdAt).toLocaleDateString()}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resumes Table */}
          <TabsContent value="resumes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" /> All Resumes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                    ))}
                  </div>
                ) : resumes.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No resumes created yet</p>
                    <p className="text-sm mt-1">Resumes will appear here when users create them</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Template</TableHead>
                          <TableHead>User ID</TableHead>
                          <TableHead>Data Size</TableHead>
                          <TableHead>Updated</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {resumes.map((resume) => (
                          <TableRow key={resume.id}>
                            <TableCell className="font-mono text-xs">
                              <span className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
                                {resume.id.substring(0, 12)}...
                              </span>
                            </TableCell>
                            <TableCell className="font-medium">{resume.title}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{resume.templateId}</Badge>
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {resume.userId.substring(0, 12)}...
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {(resume.resumeData?.length || 0) > 1024
                                ? `${Math.round((resume.resumeData?.length || 0) / 1024)} KB`
                                : `${resume.resumeData?.length || 0} B`}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-xs">
                              {new Date(resume.updatedAt).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Table */}
          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="w-5 h-5" /> All Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Access</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {templates.map((template) => (
                          <TableRow key={template.id}>
                            <TableCell className="font-mono text-xs">
                              <span className="bg-muted px-1.5 py-0.5 rounded">{template.id}</span>
                            </TableCell>
                            <TableCell className="font-medium">{template.name}</TableCell>
                            <TableCell className="text-muted-foreground text-sm max-w-[300px] truncate">
                              {template.description || '—'}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">{template.category}</Badge>
                            </TableCell>
                            <TableCell>
                              {template.isPremium ? (
                                <Badge className="bg-amber-500 text-white gap-1">
                                  <Crown className="w-3 h-3" /> Premium
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Free</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
