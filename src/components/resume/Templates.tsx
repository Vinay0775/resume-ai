'use client';

import React from 'react';
import type { ResumeData, PersonalInfo, Education, WorkExperience, Skill, Project } from '@/types';

// Modern Professional Template
function ModernTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, education, workExperience, skills, projects } = data;

  return (
    <div className="font-sans text-[10px] leading-[1.4] text-gray-800 bg-white" style={{ fontSize: '10px' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-5">
        <h1 className="text-[20px] font-bold tracking-tight">{personalInfo.fullName || 'Your Name'}</h1>
        {personalInfo.title && <p className="text-[12px] text-slate-200 mt-0.5">{personalInfo.title}</p>}
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2 text-[9px] text-slate-300">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Summary */}
        {personalInfo.summary && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1 mb-1.5">Professional Summary</h2>
            <p className="text-[9.5px] text-gray-600 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1 mb-1.5">Work Experience</h2>
            <div className="space-y-2.5">
              {workExperience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-[10px]">{exp.position || 'Position'}</p>
                      <p className="text-[9.5px] text-slate-600">{exp.company || 'Company'}</p>
                    </div>
                    <p className="text-[8.5px] text-slate-500 whitespace-nowrap">
                      {exp.startDate}{exp.startDate && ' - '}{exp.current ? 'Present' : exp.endDate}
                    </p>
                  </div>
                  {exp.description && (
                    <ul className="mt-1 space-y-0.5">
                      {exp.description.split('\n').filter(b => b.trim()).map((bullet, i) => (
                        <li key={i} className="text-[9px] text-gray-600 pl-3 relative before:absolute before:left-0 before:top-[5px] before:w-1 before:h-1 before:bg-slate-400 before:rounded-full">
                          {bullet.trim()}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1 mb-1.5">Education</h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-[10px]">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                      <p className="text-[9.5px] text-slate-600">{edu.institution}</p>
                    </div>
                    <p className="text-[8.5px] text-slate-500 whitespace-nowrap">{edu.startDate}{edu.startDate && ' - '}{edu.endDate}</p>
                  </div>
                  {edu.gpa && <p className="text-[8.5px] text-slate-500 mt-0.5">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1 mb-1.5">Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span key={skill.id} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[8.5px]">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1 mb-1.5">Projects</h2>
            <div className="space-y-2">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-[10px]">{proj.name}</p>
                    {proj.url && <a className="text-[8.5px] text-teal-600">{proj.url}</a>}
                  </div>
                  {proj.technologies && <p className="text-[8.5px] text-slate-500">{proj.technologies}</p>}
                  {proj.description && <p className="text-[9px] text-gray-600 mt-0.5">{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Classic Elegant Template
function ClassicTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, education, workExperience, skills, projects } = data;

  return (
    <div className="font-serif text-[10px] leading-[1.4] text-gray-800 bg-white p-6" style={{ fontSize: '10px' }}>
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-3 mb-4">
        <h1 className="text-[22px] font-bold tracking-wide uppercase">{personalInfo.fullName || 'Your Name'}</h1>
        {personalInfo.title && <p className="text-[11px] text-gray-600 mt-0.5">{personalInfo.title}</p>}
        <div className="flex justify-center flex-wrap gap-x-2 gap-y-0.5 mt-1.5 text-[9px] text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.email && personalInfo.phone && <span>|</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <><span>|</span><span>{personalInfo.location}</span></>}
        </div>
      </div>

      <div className="space-y-4">
        {personalInfo.summary && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-2">Summary</h2>
            <p className="text-[9.5px] text-gray-600 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {workExperience.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-2">Experience</h2>
            {workExperience.map((exp) => (
              <div key={exp.id} className="mb-2.5">
                <div className="flex justify-between">
                  <p className="font-bold text-[10px]">{exp.position}</p>
                  <p className="text-[8.5px] text-gray-500 italic">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                </div>
                <p className="text-[9.5px] text-gray-600 italic">{exp.company}</p>
                {exp.description && (
                  <ul className="mt-1 space-y-0.5 list-disc list-inside text-[9px] text-gray-600">
                    {exp.description.split('\n').filter(b => b.trim()).map((b, i) => <li key={i}>{b.trim()}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-2">Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <div className="flex justify-between">
                  <p className="font-bold text-[10px]">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                  <p className="text-[8.5px] text-gray-500">{edu.startDate} - {edu.endDate}</p>
                </div>
                <p className="text-[9.5px] text-gray-600">{edu.institution}{edu.gpa ? ` — GPA: ${edu.gpa}` : ''}</p>
              </div>
            ))}
          </div>
        )}

        {skills.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-2">Skills</h2>
            <p className="text-[9.5px] text-gray-600">{skills.map(s => s.name).join('  •  ')}</p>
          </div>
        )}

        {projects.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-2">Projects</h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-2">
                <p className="font-bold text-[10px]">{proj.name}{proj.url ? ` — ${proj.url}` : ''}</p>
                {proj.technologies && <p className="text-[8.5px] text-gray-500 italic">{proj.technologies}</p>}
                {proj.description && <p className="text-[9px] text-gray-600">{proj.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Creative Template (with sidebar)
function CreativeTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, education, workExperience, skills, projects } = data;

  return (
    <div className="flex text-[10px] leading-[1.4] bg-white" style={{ fontSize: '10px', minHeight: '100%' }}>
      {/* Sidebar */}
      <div className="w-[35%] bg-gradient-to-b from-emerald-700 to-teal-800 text-white p-4">
        <div className="mb-4">
          <h1 className="text-[16px] font-bold leading-tight">{personalInfo.fullName || 'Your Name'}</h1>
          {personalInfo.title && <p className="text-[10px] text-emerald-200 mt-0.5">{personalInfo.title}</p>}
        </div>
        <div className="space-y-2 text-[8.5px] text-emerald-100">
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.location && <p>{personalInfo.location}</p>}
          {personalInfo.linkedin && <p>{personalInfo.linkedin}</p>}
          {personalInfo.website && <p>{personalInfo.website}</p>}
        </div>

        {skills.length > 0 && (
          <div className="mt-5">
            <h2 className="text-[10px] font-bold uppercase tracking-wider border-b border-emerald-500 pb-1 mb-2">Skills</h2>
            <div className="space-y-1">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  <span className="text-[8.5px]">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div className="mt-5">
            <h2 className="text-[10px] font-bold uppercase tracking-wider border-b border-emerald-500 pb-1 mb-2">Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <p className="font-semibold text-[9px]">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                <p className="text-[8px] text-emerald-200">{edu.institution}</p>
                <p className="text-[8px] text-emerald-300">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-[65%] p-5 space-y-4">
        {personalInfo.summary && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 border-b border-emerald-200 pb-1 mb-1.5">About Me</h2>
            <p className="text-[9px] text-gray-600 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {workExperience.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 border-b border-emerald-200 pb-1 mb-1.5">Experience</h2>
            {workExperience.map((exp) => (
              <div key={exp.id} className="mb-2.5">
                <div className="flex justify-between">
                  <p className="font-semibold text-[10px]">{exp.position}</p>
                  <p className="text-[8px] text-gray-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                </div>
                <p className="text-[9px] text-emerald-700">{exp.company}</p>
                {exp.description && (
                  <ul className="mt-1 space-y-0.5">
                    {exp.description.split('\n').filter(b => b.trim()).map((b, i) => (
                      <li key={i} className="text-[8.5px] text-gray-600 pl-3 relative before:absolute before:left-0 before:top-[5px] before:w-1 before:h-1 before:bg-emerald-400 before:rounded-full">
                        {b.trim()}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 border-b border-emerald-200 pb-1 mb-1.5">Projects</h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-2">
                <p className="font-semibold text-[10px]">{proj.name}</p>
                {proj.technologies && <p className="text-[8px] text-emerald-600">{proj.technologies}</p>}
                {proj.description && <p className="text-[8.5px] text-gray-600 mt-0.5">{proj.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Minimal Template
function MinimalTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, education, workExperience, skills, projects } = data;

  return (
    <div className="font-sans text-[10px] leading-[1.5] text-gray-800 bg-white p-6" style={{ fontSize: '10px' }}>
      <div className="space-y-4">
        <div>
          <h1 className="text-[20px] font-light tracking-wide">{personalInfo.fullName || 'Your Name'}</h1>
          {personalInfo.title && <p className="text-[11px] text-gray-500 font-light">{personalInfo.title}</p>}
          <div className="flex flex-wrap gap-x-3 mt-1.5 text-[9px] text-gray-500">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
        </div>

        <div className="h-px bg-gray-200" />

        {personalInfo.summary && (
          <div>
            <h2 className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-1.5">Summary</h2>
            <p className="text-[9.5px] text-gray-600">{personalInfo.summary}</p>
          </div>
        )}

        {workExperience.length > 0 && (
          <div>
            <h2 className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-1.5">Experience</h2>
            {workExperience.map((exp) => (
              <div key={exp.id} className="mb-2.5">
                <div className="flex justify-between items-baseline">
                  <p className="font-medium text-[10px]">{exp.position} <span className="text-gray-400 font-normal">at</span> {exp.company}</p>
                  <p className="text-[8px] text-gray-400">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</p>
                </div>
                {exp.description && (
                  <p className="text-[9px] text-gray-500 mt-0.5">{exp.description.split('\n').filter(b => b.trim()).join('. ')}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div>
            <h2 className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-1.5">Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-1.5">
                <div className="flex justify-between items-baseline">
                  <p className="font-medium text-[10px]">{edu.degree}{edu.field ? `, ${edu.field}` : ''}</p>
                  <p className="text-[8px] text-gray-400">{edu.startDate} — {edu.endDate}</p>
                </div>
                <p className="text-[9px] text-gray-500">{edu.institution}</p>
              </div>
            ))}
          </div>
        )}

        {skills.length > 0 && (
          <div>
            <h2 className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-1.5">Skills</h2>
            <p className="text-[9.5px] text-gray-600">{skills.map(s => s.name).join(' · ')}</p>
          </div>
        )}

        {projects.length > 0 && (
          <div>
            <h2 className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400 mb-1.5">Projects</h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-1.5">
                <p className="font-medium text-[10px]">{proj.name}</p>
                {proj.description && <p className="text-[9px] text-gray-500">{proj.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Executive Template
function ExecutiveTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, education, workExperience, skills, projects } = data;

  return (
    <div className="font-sans text-[10px] leading-[1.4] text-gray-800 bg-white" style={{ fontSize: '10px' }}>
      <div className="bg-gradient-to-r from-amber-700 to-amber-900 text-white p-5">
        <h1 className="text-[22px] font-bold tracking-wide">{personalInfo.fullName || 'Your Name'}</h1>
        {personalInfo.title && <p className="text-[12px] text-amber-200 font-light mt-0.5">{personalInfo.title}</p>}
        <div className="flex flex-wrap gap-x-3 mt-2 text-[9px] text-amber-100">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {personalInfo.summary && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-amber-800 border-l-4 border-amber-600 pl-2 mb-2">Executive Summary</h2>
            <p className="text-[9.5px] text-gray-600 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {workExperience.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-amber-800 border-l-4 border-amber-600 pl-2 mb-2">Professional Experience</h2>
            {workExperience.map((exp) => (
              <div key={exp.id} className="mb-2.5">
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold text-[10px]">{exp.position}</p>
                    <p className="text-[9px] text-amber-700">{exp.company}</p>
                  </div>
                  <p className="text-[8.5px] text-gray-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                </div>
                {exp.description && (
                  <ul className="mt-1 space-y-0.5 list-disc list-inside text-[9px] text-gray-600">
                    {exp.description.split('\n').filter(b => b.trim()).map((b, i) => <li key={i}>{b.trim()}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-amber-800 border-l-4 border-amber-600 pl-2 mb-2">Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-1.5">
                <p className="font-bold text-[10px]">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                <p className="text-[9px] text-gray-600">{edu.institution} • {edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </div>
        )}

        {skills.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-amber-800 border-l-4 border-amber-600 pl-2 mb-2">Core Competencies</h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span key={skill.id} className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded text-[8.5px] border border-amber-200">{skill.name}</span>
              ))}
            </div>
          </div>
        )}

        {projects.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-amber-800 border-l-4 border-amber-600 pl-2 mb-2">Key Projects</h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-2">
                <p className="font-bold text-[10px]">{proj.name}</p>
                {proj.description && <p className="text-[9px] text-gray-600">{proj.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Tech Template
function TechTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, education, workExperience, skills, projects } = data;

  return (
    <div className="font-mono text-[10px] leading-[1.4] text-gray-800 bg-white" style={{ fontSize: '10px' }}>
      <div className="bg-gradient-to-r from-cyan-700 to-teal-700 text-white p-5">
        <h1 className="text-[20px] font-bold">{personalInfo.fullName || 'Your Name'}</h1>
        {personalInfo.title && <p className="text-[11px] text-cyan-200 mt-0.5">{personalInfo.title}</p>}
        <div className="flex flex-wrap gap-x-3 mt-2 text-[9px] text-cyan-100">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.github && <span>{personalInfo.website}</span>}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {personalInfo.summary && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-teal-700 mb-1.5">{'// '}About</h2>
            <p className="text-[9px] text-gray-600">{personalInfo.summary}</p>
          </div>
        )}

        {skills.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-teal-700 mb-1.5">{'// '}Tech Stack</h2>
            <div className="flex flex-wrap gap-1">
              {skills.map((skill) => (
                <span key={skill.id} className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded text-[8px] border border-teal-200">{skill.name}</span>
              ))}
            </div>
          </div>
        )}

        {workExperience.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-teal-700 mb-1.5">{'// '}Experience</h2>
            {workExperience.map((exp) => (
              <div key={exp.id} className="mb-2.5">
                <div className="flex justify-between">
                  <p className="font-bold text-[10px]">{exp.position} @ {exp.company}</p>
                  <p className="text-[8px] text-gray-400">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                </div>
                {exp.description && (
                  <ul className="mt-0.5 space-y-0.5">
                    {exp.description.split('\n').filter(b => b.trim()).map((b, i) => (
                      <li key={i} className="text-[8.5px] text-gray-600">→ {b.trim()}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-teal-700 mb-1.5">{'// '}Projects</h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-2">
                <p className="font-bold text-[10px]">{proj.name}</p>
                {proj.technologies && <p className="text-[8px] text-teal-600">[{proj.technologies}]</p>}
                {proj.description && <p className="text-[8.5px] text-gray-600 mt-0.5">{proj.description}</p>}
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-teal-700 mb-1.5">{'// '}Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-1">
                <p className="font-bold text-[10px]">{edu.degree}{edu.field ? ` — ${edu.field}` : ''}</p>
                <p className="text-[8.5px] text-gray-600">{edu.institution} • {edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export { ModernTemplate, ClassicTemplate, CreativeTemplate, MinimalTemplate, ExecutiveTemplate, TechTemplate };
