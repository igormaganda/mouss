"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Calendar,
  Award,
  Code,
  ExternalLink,
} from "lucide-react";
import {
  CVData,
  CVTemplateId,
  CV_TEMPLATES,
  SKILL_LEVELS,
} from "./CVTemplates";

interface CVPreviewProps {
  data: CVData;
  template: CVTemplateId;
}

export function CVPreview({ data, template }: CVPreviewProps) {
  const templateConfig = CV_TEMPLATES.find((t) => t.id === template);
  if (!templateConfig) return null;

  const colors = templateConfig.colorScheme;

  // Render based on template layout
  switch (templateConfig.layout) {
    case "two-column":
      return <TwoColumnPreview data={data} colors={colors} />;
    case "header-sidebar":
      return <HeaderSidebarPreview data={data} colors={colors} />;
    case "single-column":
    default:
      return <SingleColumnPreview data={data} colors={colors} />;
  }
}

// Single Column Layout (Classic, Minimal)
function SingleColumnPreview({
  data,
  colors,
}: {
  data: CVData;
  colors: CVTemplate["colorScheme"];
}) {
  return (
    <div
      className="w-[210mm] bg-white shadow-xl"
      style={{ fontFamily: "Georgia, serif" }}
    >
      {/* Header */}
      <div
        className="p-8 text-center border-b-2"
        style={{ borderColor: colors.primary }}
      >
        <h1
          className="text-3xl font-bold tracking-wide"
          style={{ color: colors.primary }}
        >
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </h1>
        {data.personalInfo.summary && (
          <p className="mt-2 text-gray-600 max-w-lg mx-auto">
            {data.personalInfo.summary}
          </p>
        )}
        <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
          {data.personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {data.personalInfo.email}
            </span>
          )}
          {data.personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {data.personalInfo.phone}
            </span>
          )}
          {data.personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {data.personalInfo.location}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
        {/* Experience */}
        {data.experience.length > 0 && (
          <Section title="Expérience Professionnelle" color={colors.primary}>
            {data.experience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{exp.position}</h4>
                    <p style={{ color: colors.accent }}>
                      {exp.company}
                      {exp.location && ` • ${exp.location}`}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {exp.startDate} - {exp.current ? "Présent" : exp.endDate}
                  </span>
                </div>
                {exp.description && (
                  <p className="mt-2 text-sm text-gray-600">{exp.description}</p>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <Section title="Formation" color={colors.primary}>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{edu.degree}</h4>
                    <p style={{ color: colors.accent }}>
                      {edu.school}
                      {edu.field && ` • ${edu.field}`}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
              </div>
            ))}
          </Section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <Section title="Compétences" color={colors.primary}>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-3 py-1 rounded text-sm"
                  style={{
                    backgroundColor: `${colors.primary}15`,
                    color: colors.primary,
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <Section title="Langues" color={colors.primary}>
            <div className="flex flex-wrap gap-4">
              {data.languages.map((lang) => (
                <span key={lang.id} className="text-sm">
                  <strong>{lang.name}</strong> • {lang.level}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <Section title="Certifications" color={colors.primary}>
            {data.certifications.map((cert) => (
              <div key={cert.id} className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4" style={{ color: colors.accent }} />
                <span className="font-medium">{cert.name}</span>
                <span className="text-sm text-gray-500">
                  - {cert.issuer} ({cert.date})
                </span>
              </div>
            ))}
          </Section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <Section title="Projets" color={colors.primary}>
            {data.projects.map((project) => (
              <div key={project.id} className="mb-3">
                <h4 className="font-semibold flex items-center gap-2">
                  {project.name}
                  {project.url && (
                    <ExternalLink className="w-3 h-3 text-gray-400" />
                  )}
                </h4>
                {project.description && (
                  <p className="text-sm text-gray-600">{project.description}</p>
                )}
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 rounded bg-gray-100"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

// Two Column Layout (Modern, Executive)
function TwoColumnPreview({
  data,
  colors,
}: {
  data: CVData;
  colors: CVTemplate["colorScheme"];
}) {
  return (
    <div className="w-[210mm] bg-white shadow-xl flex" style={{ minHeight: "297mm" }}>
      {/* Sidebar */}
      <div className="w-1/3 text-white p-6" style={{ backgroundColor: colors.primary }}>
        {/* Photo/Name */}
        <div className="text-center mb-6">
          <div
            className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold"
            style={{ backgroundColor: colors.secondary }}
          >
            {data.personalInfo.firstName[0]}
            {data.personalInfo.lastName[0]}
          </div>
          <h1 className="text-xl font-bold">{data.personalInfo.firstName}</h1>
          <h1 className="text-xl font-bold">{data.personalInfo.lastName}</h1>
        </div>

        {/* Contact */}
        <div className="space-y-2 mb-6">
          <h3 className="text-sm uppercase tracking-wider opacity-70 mb-2">
            Contact
          </h3>
          {data.personalInfo.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4" />
              <span className="break-all">{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4" />
              {data.personalInfo.phone}
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4" />
              {data.personalInfo.location}
            </div>
          )}
          {data.personalInfo.linkedin && (
            <div className="flex items-center gap-2 text-sm">
              <Linkedin className="w-4 h-4" />
              {data.personalInfo.linkedin}
            </div>
          )}
        </div>

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm uppercase tracking-wider opacity-70 mb-2">
              Compétences
            </h3>
            {data.skills.map((skill) => (
              <div key={skill.id} className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>{skill.name}</span>
                  <span className="opacity-70">{SKILL_LEVELS[skill.level].label}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/30">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${SKILL_LEVELS[skill.level].value}%`,
                      backgroundColor: colors.accent,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm uppercase tracking-wider opacity-70 mb-2">
              Langues
            </h3>
            {data.languages.map((lang) => (
              <div key={lang.id} className="text-sm mb-1">
                <span className="font-medium">{lang.name}</span>
                <span className="opacity-70 ml-2">• {lang.level}</span>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <div>
            <h3 className="text-sm uppercase tracking-wider opacity-70 mb-2">
              Certifications
            </h3>
            {data.certifications.map((cert) => (
              <div key={cert.id} className="mb-2">
                <p className="text-sm font-medium">{cert.name}</p>
                <p className="text-xs opacity-70">{cert.issuer}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Summary */}
        {data.personalInfo.summary && (
          <div className="mb-6">
            <Section title="Profil" color={colors.primary}>
              <p className="text-sm text-gray-600">{data.personalInfo.summary}</p>
            </Section>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div className="mb-6">
            <Section title="Expérience Professionnelle" color={colors.primary}>
              {data.experience.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className="font-semibold">{exp.position}</h4>
                      <p className="text-sm" style={{ color: colors.accent }}>
                        {exp.company}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {exp.startDate} - {exp.current ? "Présent" : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                  )}
                </div>
              ))}
            </Section>
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div className="mb-6">
            <Section title="Formation" color={colors.primary}>
              {data.education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{edu.degree}</h4>
                      <p className="text-sm" style={{ color: colors.accent }}>
                        {edu.school}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {edu.endDate}
                    </span>
                  </div>
                </div>
              ))}
            </Section>
          </div>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <div>
            <Section title="Projets" color={colors.primary}>
              {data.projects.map((project) => (
                <div key={project.id} className="mb-3">
                  <h4 className="font-semibold">{project.name}</h4>
                  {project.description && (
                    <p className="text-sm text-gray-600">{project.description}</p>
                  )}
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: `${colors.primary}15`,
                            color: colors.primary,
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}

// Header + Sidebar Layout (Creative)
function HeaderSidebarPreview({
  data,
  colors,
}: {
  data: CVData;
  colors: CVTemplate["colorScheme"];
}) {
  return (
    <div className="w-[210mm] bg-white shadow-xl" style={{ minHeight: "297mm" }}>
      {/* Header */}
      <div
        className="p-8 text-white text-center"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
        }}
      >
        <h1 className="text-3xl font-bold">
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </h1>
        {data.personalInfo.summary && (
          <p className="mt-2 opacity-90 max-w-lg mx-auto">
            {data.personalInfo.summary}
          </p>
        )}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm opacity-80">
          {data.personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              {data.personalInfo.email}
            </span>
          )}
          {data.personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              {data.personalInfo.phone}
            </span>
          )}
          {data.personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {data.personalInfo.location}
            </span>
          )}
        </div>
      </div>

      {/* Content with sidebar */}
      <div className="flex">
        {/* Main */}
        <div className="flex-1 p-6">
          {/* Experience */}
          {data.experience.length > 0 && (
            <Section title="Expérience" color={colors.primary}>
              {data.experience.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <h4 className="font-semibold">{exp.position}</h4>
                  <p className="text-sm" style={{ color: colors.accent }}>
                    {exp.company} • {exp.startDate} - {exp.current ? "Présent" : exp.endDate}
                  </p>
                  {exp.description && (
                    <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <Section title="Formation" color={colors.primary}>
              {data.education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <h4 className="font-semibold">{edu.degree}</h4>
                  <p className="text-sm" style={{ color: colors.accent }}>
                    {edu.school} • {edu.endDate}
                  </p>
                </div>
              ))}
            </Section>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <Section title="Projets" color={colors.primary}>
              {data.projects.map((project) => (
                <div key={project.id} className="mb-3">
                  <h4 className="font-semibold">{project.name}</h4>
                  <p className="text-sm text-gray-600">{project.description}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: `${colors.primary}15`,
                          color: colors.primary,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </Section>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-1/3 p-6 border-l border-gray-100 bg-gray-50">
          {/* Skills */}
          {data.skills.length > 0 && (
            <div className="mb-6">
              <h3
                className="text-sm font-semibold uppercase tracking-wider mb-3"
                style={{ color: colors.primary }}
              >
                Compétences
              </h3>
              {data.skills.map((skill) => (
                <div key={skill.id} className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{skill.name}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${SKILL_LEVELS[skill.level].value}%`,
                        backgroundColor: colors.primary,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {data.languages.length > 0 && (
            <div className="mb-6">
              <h3
                className="text-sm font-semibold uppercase tracking-wider mb-3"
                style={{ color: colors.primary }}
              >
                Langues
              </h3>
              {data.languages.map((lang) => (
                <div key={lang.id} className="text-sm mb-1">
                  <strong>{lang.name}</strong>: {lang.level}
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <div>
              <h3
                className="text-sm font-semibold uppercase tracking-wider mb-3"
                style={{ color: colors.primary }}
              >
                Certifications
              </h3>
              {data.certifications.map((cert) => (
                <div key={cert.id} className="mb-2 text-sm">
                  <strong>{cert.name}</strong>
                  <br />
                  <span className="text-gray-500">{cert.issuer}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Section component
function Section({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <h3
        className="text-sm font-bold uppercase tracking-wider pb-2 mb-3 border-b-2"
        style={{ borderColor: color, color }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

export default CVPreview;
