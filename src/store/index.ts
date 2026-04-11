import { create } from 'zustand';
import type { Page, ResumeData } from '@/types';

interface AppState {
  // Navigation
  currentPage: Page;
  setCurrentPage: (page: Page) => void;

  // Auth
  user: { id: string; name: string; email: string; plan: string; image?: string } | null;
  setUser: (user: AppState['user']) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;

  // Resume Builder
  currentResumeId: string | null;
  setCurrentResumeId: (id: string | null) => void;
  resumeData: ResumeData;
  setResumeData: (data: Partial<ResumeData>) => void;
  selectedTemplate: string;
  setSelectedTemplate: (template: string) => void;
  previewScale: number;
  setPreviewScale: (scale: number) => void;
}

const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    website: '',
    linkedin: '',
    summary: '',
  },
  education: [],
  workExperience: [],
  skills: [],
  projects: [],
  sectionOrder: ['personalInfo', 'workExperience', 'education', 'skills', 'projects'],
};

export const useAppStore = create<AppState>((set) => ({
  // Navigation
  currentPage: 'landing',
  setCurrentPage: (page) => set({ currentPage: page }),

  // Auth
  user: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  isAuthenticated: false,
  setIsAuthenticated: (val) => set({ isAuthenticated: val }),

  // Resume Builder
  currentResumeId: null,
  setCurrentResumeId: (id) => set({ currentResumeId: id }),
  resumeData: defaultResumeData,
  setResumeData: (data) =>
    set((state) => ({ resumeData: { ...state.resumeData, ...data } })),
  selectedTemplate: 'modern',
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  previewScale: 0.5,
  setPreviewScale: (scale) => set({ previewScale: scale }),
}));
