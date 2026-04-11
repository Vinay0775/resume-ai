'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAppStore } from '@/store';
import type { ResumeData, PersonalInfo, Education, WorkExperience, Skill, Project } from '@/types';
import {
  ModernTemplate, ClassicTemplate, CreativeTemplate,
  MinimalTemplate, ExecutiveTemplate, TechTemplate
} from '@/components/resume/Templates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  ArrowLeft, Save, Download, FileText, Plus, Trash2,
  Sparkles, ChevronDown, ChevronUp, Eye, Layout,
  Loader2, Wand2, Target, Shield, FileDown, GripVertical,
  Moon, Sun
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

const templateList = [
  { id: 'modern', name: 'Modern' },
  { id: 'classic', name: 'Classic' },
  { id: 'creative', name: 'Creative' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'executive', name: 'Executive' },
  { id: 'tech', name: 'Tech' },
];

const sectionLabels: Record<string, string> = {
  personalInfo: 'Personal Info',
  workExperience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
};

export default function BuilderPage() {
  const {
    user, resumeData, setResumeData, currentResumeId,
    setCurrentResumeId, setCurrentPage, selectedTemplate, setSelectedTemplate,
    isAuthenticated,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('personalInfo');
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [atsOpen, setAtsOpen] = useState(false);
  const [atsResult, setAtsResult] = useState<Record<string, unknown> | null>(null);
  const [atsLoading, setAtsLoading] = useState(false);
  const [tailorOpen, setTailorOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [tailorLoading, setTailorLoading] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(false);
  const { theme, setTheme } = useTheme();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    personalInfo: true, workExperience: true, education: true, skills: true, projects: true,
  });

  const previewRef = useRef<HTMLDivElement>(null);

  // Auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentResumeId) saveResume();
    }, 2000);
    return () => clearTimeout(timer);
  }, [resumeData, selectedTemplate]);

  const saveResume = async () => {
    if (!currentResumeId) return;
    setSaving(true);
    try {
      await fetch(`/api/resumes/${currentResumeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData, templateId: selectedTemplate }),
      });
    } catch {
      // silent fail for auto-save
    } finally {
      setSaving(false);
    }
  };

  // AI: Improve text
  const handleImprove = async (text: string, field: string) => {
    if (!text.trim()) return;
    setAiLoading(field);
    try {
      const res = await fetch('/api/ai/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, context: resumeData.personalInfo.title }),
      });
      const data = await res.json();
      if (data.result) {
        toast.success('Text improved with AI!');
        return data.result;
      }
    } catch {
      toast.error('Failed to improve text');
    } finally {
      setAiLoading(null);
    }
    return text;
  };

  // AI: Generate summary
  const handleGenerateSummary = async () => {
    setAiLoading('summary');
    try {
      const res = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalInfo: resumeData.personalInfo,
          experience: resumeData.workExperience,
          targetRole: resumeData.personalInfo.title,
        }),
      });
      const data = await res.json();
      if (data.result) {
        setResumeData({
          personalInfo: { ...resumeData.personalInfo, summary: data.result },
        });
        toast.success('Summary generated!');
      }
    } catch {
      toast.error('Failed to generate summary');
    } finally {
      setAiLoading(null);
    }
  };

  // AI: ATS Score
  const handleAtsScore = async () => {
    setAtsLoading(true);
    try {
      const res = await fetch('/api/ai/ats-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData, jobDescription }),
      });
      const data = await res.json();
      setAtsResult(data.result);
    } catch {
      toast.error('Failed to check ATS score');
    } finally {
      setAtsLoading(false);
    }
  };

  // AI: Tailor resume
  const handleTailor = async () => {
    setTailorLoading(true);
    try {
      const res = await fetch('/api/ai/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData, jobDescription }),
      });
      const data = await res.json();
      if (data.result && typeof data.result === 'object') {
        setResumeData(data.result);
        toast.success('Resume tailored to job description!');
        setTailorOpen(false);
      }
    } catch {
      toast.error('Failed to tailor resume');
    } finally {
      setTailorLoading(false);
    }
  };

  // Export PDF
  const handleExportPDF = async () => {
    if (!isAuthenticated) {
      setCurrentPage('login');
      toast.error('Please sign in to download your resume');
      return;
    }
    if (!previewRef.current) return;
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = previewRef.current.querySelector('.resume-content');
      if (!element) return;
      const opt = {
        margin: 0,
        filename: `${resumeData.personalInfo.fullName || 'resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
      };
      html2pdf().set(opt).from(element).save();
      toast.success('PDF exported!');
    } catch {
      toast.error('Failed to export PDF');
    }
  };

  // Export DOCX
  const handleExportDocx = async () => {
    if (!isAuthenticated) {
      setCurrentPage('login');
      toast.error('Please sign in to download your resume');
      return;
    }
    try {
      const res = await fetch('/api/export/docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData,
          title: resumeData.personalInfo.fullName || 'resume',
          userId: user?.id,
        }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resumeData.personalInfo.fullName || 'resume'}.doc`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('DOCX exported!');
      }
    } catch {
      toast.error('Failed to export DOCX');
    }
  };

  // Update helpers
  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setResumeData({
      personalInfo: { ...resumeData.personalInfo, [field]: value },
    });
  };

  const addEducation = () => {
    const newEdu: Education = { id: Date.now().toString(), institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', description: '' };
    setResumeData({ education: [...resumeData.education, newEdu] });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData({
      education: resumeData.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    });
  };

  const removeEducation = (id: string) => {
    setResumeData({ education: resumeData.education.filter((e) => e.id !== id) });
  };

  const addWorkExperience = () => {
    const newExp: WorkExperience = { id: Date.now().toString(), company: '', position: '', startDate: '', endDate: '', current: false, description: '' };
    setResumeData({ workExperience: [...resumeData.workExperience, newExp] });
  };

  const updateWorkExperience = (id: string, field: keyof WorkExperience, value: string | boolean) => {
    setResumeData({
      workExperience: resumeData.workExperience.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    });
  };

  const removeWorkExperience = (id: string) => {
    setResumeData({ workExperience: resumeData.workExperience.filter((e) => e.id !== id) });
  };

  const addSkill = () => {
    const newSkill: Skill = { id: Date.now().toString(), name: '', level: 'intermediate' };
    setResumeData({ skills: [...resumeData.skills, newSkill] });
  };

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    setResumeData({
      skills: resumeData.skills.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    });
  };

  const removeSkill = (id: string) => {
    setResumeData({ skills: resumeData.skills.filter((s) => s.id !== id) });
  };

  const addProject = () => {
    const newProj: Project = { id: Date.now().toString(), name: '', description: '', url: '', technologies: '', startDate: '', endDate: '' };
    setResumeData({ projects: [...resumeData.projects, newProj] });
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setResumeData({
      projects: resumeData.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    });
  };

  const removeProject = (id: string) => {
    setResumeData({ projects: resumeData.projects.filter((p) => p.id !== id) });
  };

  // Move section up/down
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...resumeData.sectionOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    setResumeData({ sectionOrder: newOrder });
  };

  // Render template preview
  const renderTemplate = () => {
    const templateMap: Record<string, React.ComponentType<{ data: ResumeData }>> = {
      modern: ModernTemplate,
      classic: ClassicTemplate,
      creative: CreativeTemplate,
      minimal: MinimalTemplate,
      executive: ExecutiveTemplate,
      tech: TechTemplate,
    };
    const TemplateComponent = templateMap[selectedTemplate] || ModernTemplate;
    return <TemplateComponent data={resumeData} />;
  };

  // Improve experience description
  const handleImproveExperience = async (expId: string) => {
    const exp = resumeData.workExperience.find(e => e.id === expId);
    if (!exp?.description) return;
    const improved = await handleImprove(exp.description, `exp-${expId}`);
    if (improved !== exp.description) {
      updateWorkExperience(expId, 'description', improved);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Top Bar */}
      <header className="h-14 bg-white dark:bg-gray-900 border-b flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => { setCurrentPage('dashboard'); setCurrentResumeId(null); }}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-sm hidden sm:inline">Resume Builder</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Template Switcher */}
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <Layout className="w-3.5 h-3.5 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {templateList.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="h-6" />

          {/* AI Tools */}
          <Button variant="outline" size="sm" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="w-8 h-8 p-0">
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTailorOpen(true)} className="hidden sm:flex">
            <Target className="w-3.5 h-3.5 mr-1" /> Tailor
          </Button>
          <Button variant="outline" size="sm" onClick={() => setAtsOpen(true)} className="hidden sm:flex">
            <Shield className="w-3.5 h-3.5 mr-1" /> ATS Check
          </Button>

          <Separator orientation="vertical" className="h-6 hidden sm:block" />

          {/* Save indicator */}
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {saving ? <Loader2 className="w-3 h-3 animate-spin inline" /> : 'Saved'}
          </span>

          {/* Export */}
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <FileDown className="w-3.5 h-3.5 mr-1" /> PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportDocx} className="hidden sm:flex">
            <Download className="w-3.5 h-3.5 mr-1" /> DOCX
          </Button>

          {/* Mobile preview toggle */}
          <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setMobilePreview(!mobilePreview)}>
            <Eye className="w-3.5 h-3.5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Form Editor */}
        <div className={`w-full lg:w-1/2 overflow-y-auto ${mobilePreview ? 'hidden lg:block' : ''}`}>
          <div className="max-w-2xl mx-auto p-4 space-y-4">
            {/* Section reordering + tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full flex-wrap h-auto gap-1 bg-white dark:bg-gray-900 p-1">
                {resumeData.sectionOrder.map((section, index) => (
                  <TabsTrigger key={section} value={section} className="text-xs flex items-center gap-1">
                    {sectionLabels[section] || section}
                    <div className="flex flex-col ml-1">
                      <button onClick={(e) => { e.stopPropagation(); moveSection(index, 'up'); }} className="leading-none hover:text-emerald-600">
                        <ChevronUp className="w-2.5 h-2.5" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); moveSection(index, 'down'); }} className="leading-none hover:text-emerald-600">
                        <ChevronDown className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Personal Info Tab */}
              <TabsContent value="personalInfo" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      Personal Information
                      <Badge variant="secondary" className="text-[10px]">
                        <Sparkles className="w-3 h-3 mr-1" /> AI Ready
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Full Name</Label>
                        <Input placeholder="John Doe" value={resumeData.personalInfo.fullName} onChange={(e) => updatePersonalInfo('fullName', e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Professional Title</Label>
                        <Input placeholder="Software Engineer" value={resumeData.personalInfo.title} onChange={(e) => updatePersonalInfo('title', e.target.value)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Email</Label>
                        <Input placeholder="john@example.com" value={resumeData.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Phone</Label>
                        <Input placeholder="+1 (555) 000-0000" value={resumeData.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Location</Label>
                        <Input placeholder="San Francisco, CA" value={resumeData.personalInfo.location} onChange={(e) => updatePersonalInfo('location', e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">LinkedIn</Label>
                        <Input placeholder="linkedin.com/in/..." value={resumeData.personalInfo.linkedin} onChange={(e) => updatePersonalInfo('linkedin', e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Website / Portfolio</Label>
                      <Input placeholder="yourwebsite.com" value={resumeData.personalInfo.website} onChange={(e) => updatePersonalInfo('website', e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Professional Summary</Label>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-emerald-600 hover:text-emerald-700" onClick={handleGenerateSummary} disabled={aiLoading === 'summary'}>
                          {aiLoading === 'summary' ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Wand2 className="w-3 h-3 mr-1" />}
                          Generate with AI
                        </Button>
                      </div>
                      <Textarea
                        placeholder="A brief professional summary highlighting your key qualifications and career goals..."
                        value={resumeData.personalInfo.summary}
                        onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Work Experience Tab */}
              <TabsContent value="workExperience" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Work Experience</h3>
                  <Button variant="outline" size="sm" onClick={addWorkExperience}>
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Experience
                  </Button>
                </div>
                {resumeData.workExperience.length === 0 && (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center py-8 text-muted-foreground">
                      <FileText className="w-10 h-10 mb-2 opacity-50" />
                      <p className="text-sm">No work experience added yet</p>
                      <Button variant="link" onClick={addWorkExperience} className="text-emerald-600">Add your first experience</Button>
                    </CardContent>
                  </Card>
                )}
                {resumeData.workExperience.map((exp) => (
                  <Card key={exp.id} className="relative">
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label className="text-xs">Position</Label>
                              <Input placeholder="Software Engineer" value={exp.position} onChange={(e) => updateWorkExperience(exp.id, 'position', e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs">Company</Label>
                              <Input placeholder="Google" value={exp.company} onChange={(e) => updateWorkExperience(exp.id, 'company', e.target.value)} />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label className="text-xs">Start Date</Label>
                              <Input placeholder="Jan 2022" value={exp.startDate} onChange={(e) => updateWorkExperience(exp.id, 'startDate', e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs">End Date</Label>
                              <Input placeholder="Dec 2023" value={exp.endDate} onChange={(e) => updateWorkExperience(exp.id, 'endDate', e.target.value)} disabled={exp.current} />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch checked={exp.current} onCheckedChange={(checked) => updateWorkExperience(exp.id, 'current', checked)} />
                            <Label className="text-xs">Currently working here</Label>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs">Description</Label>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-emerald-600 hover:text-emerald-700"
                                onClick={() => handleImproveExperience(exp.id)}
                                disabled={aiLoading === `exp-${exp.id}`}
                              >
                                {aiLoading === `exp-${exp.id}` ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                                Improve with AI
                              </Button>
                            </div>
                            <Textarea
                              placeholder="Describe your responsibilities and achievements...&#10;Use separate lines for bullet points"
                              value={exp.description}
                              onChange={(e) => updateWorkExperience(exp.id, 'description', e.target.value)}
                              rows={4}
                            />
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 ml-2 mt-0" onClick={() => removeWorkExperience(exp.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Education Tab */}
              <TabsContent value="education" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Education</h3>
                  <Button variant="outline" size="sm" onClick={addEducation}>
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Education
                  </Button>
                </div>
                {resumeData.education.length === 0 && (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center py-8 text-muted-foreground">
                      <FileText className="w-10 h-10 mb-2 opacity-50" />
                      <p className="text-sm">No education added yet</p>
                      <Button variant="link" onClick={addEducation} className="text-emerald-600">Add your education</Button>
                    </CardContent>
                  </Card>
                )}
                {resumeData.education.map((edu) => (
                  <Card key={edu.id}>
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label className="text-xs">Institution</Label>
                              <Input placeholder="Stanford University" value={edu.institution} onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs">Degree</Label>
                              <Input placeholder="Bachelor of Science" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label className="text-xs">Field of Study</Label>
                              <Input placeholder="Computer Science" value={edu.field} onChange={(e) => updateEducation(edu.id, 'field', e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs">GPA</Label>
                              <Input placeholder="3.8/4.0" value={edu.gpa} onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)} />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label className="text-xs">Start Date</Label>
                              <Input placeholder="Sep 2018" value={edu.startDate} onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs">End Date</Label>
                              <Input placeholder="Jun 2022" value={edu.endDate} onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)} />
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 ml-2" onClick={() => removeEducation(edu.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Skills Tab */}
              <TabsContent value="skills" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Skills</h3>
                  <Button variant="outline" size="sm" onClick={addSkill}>
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Skill
                  </Button>
                </div>
                {resumeData.skills.length === 0 && (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center py-8 text-muted-foreground">
                      <FileText className="w-10 h-10 mb-2 opacity-50" />
                      <p className="text-sm">No skills added yet</p>
                      <Button variant="link" onClick={addSkill} className="text-emerald-600">Add your first skill</Button>
                    </CardContent>
                  </Card>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {resumeData.skills.map((skill) => (
                    <Card key={skill.id}>
                      <CardContent className="pt-3 flex items-center gap-2">
                        <div className="flex-1 space-y-2">
                          <Input placeholder="JavaScript" value={skill.name} onChange={(e) => updateSkill(skill.id, 'name', e.target.value)} className="h-8 text-sm" />
                          <Select value={skill.level} onValueChange={(val) => updateSkill(skill.id, 'level', val)}>
                            <SelectTrigger className="h-7 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                              <SelectItem value="expert">Expert</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => removeSkill(skill.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Projects Tab */}
              <TabsContent value="projects" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Projects</h3>
                  <Button variant="outline" size="sm" onClick={addProject}>
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Project
                  </Button>
                </div>
                {resumeData.projects.length === 0 && (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center py-8 text-muted-foreground">
                      <FileText className="w-10 h-10 mb-2 opacity-50" />
                      <p className="text-sm">No projects added yet</p>
                      <Button variant="link" onClick={addProject} className="text-emerald-600">Add your first project</Button>
                    </CardContent>
                  </Card>
                )}
                {resumeData.projects.map((proj) => (
                  <Card key={proj.id}>
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label className="text-xs">Project Name</Label>
                              <Input placeholder="My Awesome Project" value={proj.name} onChange={(e) => updateProject(proj.id, 'name', e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs">Technologies</Label>
                              <Input placeholder="React, Node.js, PostgreSQL" value={proj.technologies} onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)} />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs">URL</Label>
                            <Input placeholder="https://github.com/..." value={proj.url} onChange={(e) => updateProject(proj.id, 'url', e.target.value)} />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs">Description</Label>
                            <Textarea placeholder="Describe what this project does..." value={proj.description} onChange={(e) => updateProject(proj.id, 'description', e.target.value)} rows={3} />
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 ml-2" onClick={() => removeProject(proj.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className={`w-full lg:w-1/2 bg-gray-100 dark:bg-gray-900 border-l ${!mobilePreview ? 'hidden lg:block' : ''}`}>
          <div className="h-full flex flex-col">
            <div className="p-3 bg-white dark:bg-gray-900 border-b flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                Live Preview
              </div>
              <Badge variant="secondary" className="text-xs">{templateList.find(t => t.id === selectedTemplate)?.name}</Badge>
            </div>
            <div className="flex-1 overflow-auto p-4 flex justify-center" ref={previewRef}>
              <div className="resume-content w-[210mm] min-h-[297mm] bg-white shadow-2xl rounded-sm" style={{ transform: 'scale(0.55)', transformOrigin: 'top center' }}>
                {renderTemplate()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ATS Score Dialog */}
      <Dialog open={atsOpen} onOpenChange={setAtsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" /> ATS Score Checker
            </DialogTitle>
            <DialogDescription>
              Check how well your resume performs with Applicant Tracking Systems.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm">Job Description (optional)</Label>
              <Textarea
                placeholder="Paste the job description here for more accurate scoring..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={4}
              />
            </div>
            {atsResult && (
              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  <div className="relative w-28 h-28">
                    <svg className="w-28 h-28 -rotate-90">
                      <circle cx="56" cy="56" r="48" stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeWidth="8" fill="none" />
                      <circle cx="56" cy="56" r="48" stroke="currentColor" className={(atsResult.score as number) >= 70 ? 'text-emerald-500' : (atsResult.score as number) >= 40 ? 'text-yellow-500' : 'text-red-500'} strokeWidth="8" fill="none" strokeDasharray={`${((atsResult.score as number) / 100) * 301.6} 301.6`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold">{String(atsResult.score)}</span>
                    </div>
                  </div>
                </div>
                {(atsResult.suggestions as string[])?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Suggestions:</p>
                    <ul className="space-y-1">
                      {(atsResult.suggestions as string[]).map((s: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-emerald-500 mt-0.5">•</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            <Button
              onClick={handleAtsScore}
              disabled={atsLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
            >
              {atsLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
              Check ATS Score
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tailor Resume Dialog */}
      <Dialog open={tailorOpen} onOpenChange={setTailorOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" /> Tailor Resume to Job
            </DialogTitle>
            <DialogDescription>
              Customize your resume content to match a specific job description using AI.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm">Job Description</Label>
              <Textarea
                placeholder="Paste the full job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={6}
              />
            </div>
            <Button
              onClick={handleTailor}
              disabled={tailorLoading || !jobDescription}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
            >
              {tailorLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Target className="w-4 h-4 mr-2" />}
              Tailor My Resume
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
