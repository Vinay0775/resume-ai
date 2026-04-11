export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  website: string;
  linkedin: string;
  summary: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
  description: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: string; // beginner, intermediate, advanced, expert
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  technologies: string;
  startDate: string;
  endDate: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  workExperience: WorkExperience[];
  skills: Skill[];
  projects: Project[];
  sectionOrder: string[];
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
  isPremium: boolean;
  category: string;
}

export type Page = 'landing' | 'login' | 'signup' | 'forgotPassword' | 'dashboard' | 'builder' | 'admin';

export interface UserState {
  user: {
    id: string;
    name: string;
    email: string;
    plan: string;
    role: string;
    image?: string;
  } | null;
  isAuthenticated: boolean;
}
