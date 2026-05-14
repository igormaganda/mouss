"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  FileText,
  Mic,
  MicOff,
  Wand2,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Eye,
  Download,
  Palette,
  Layout,
  Briefcase,
  GraduationCap,
  Code,
  Languages,
  Award,
  FolderGit2,
  User,
  Loader2,
  Check,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Printer,
} from "lucide-react";
import {
  CVData,
  CVTemplate,
  CVTemplateId,
  CV_TEMPLATES,
  DEFAULT_CV_DATA,
  generateId,
  SKILL_LEVELS,
  SKILL_CATEGORIES,
  LANGUAGE_LEVELS,
} from "./CVTemplates";
import { CVPreview } from "./CVPreview";
import { useVoiceDictation } from "@/hooks/useVoiceDictation";

interface CVBuilderProps {
  initialData?: CVData;
  onExport?: (data: CVData, template: CVTemplateId) => void;
  language?: "fr" | "ar";
}

interface AIAssistRequest {
  section: string;
  context: string;
  currentText?: string;
}

export function CVBuilder({ initialData, onExport, language = "fr" }: CVBuilderProps) {
  const [cvData, setCvData] = React.useState<CVData>(initialData || DEFAULT_CV_DATA);
  const [selectedTemplate, setSelectedTemplate] = React.useState<CVTemplateId>("modern");
  const [activeSection, setActiveSection] = React.useState<string>("personal");
  const [isAILoading, setIsAILoading] = React.useState(false);
  const [aiSuggestion, setAiSuggestion] = React.useState<string | null>(null);
  const [previewScale, setPreviewScale] = React.useState(0.6);
  const [showPreview, setShowPreview] = React.useState(true);
  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({});

  // Voice dictation
  const [activeVoiceField, setActiveVoiceField] = React.useState<string | null>(null);
  const {
    isListening,
    isSupported: voiceSupported,
    transcript,
    interimTranscript,
    toggleListening,
    resetTranscript,
  } = useVoiceDictation({
    language: language === "fr" ? "fr-FR" : "ar-SA",
    onResult: (text) => {
      if (activeVoiceField) {
        updateField(activeVoiceField, text);
      }
    },
  });

  // Apply voice transcript to active field
  React.useEffect(() => {
    if (transcript && activeVoiceField) {
      updateField(activeVoiceField, transcript, true);
    }
  }, [transcript, activeVoiceField]);

  // Update field helper
  const updateField = (field: string, value: unknown, append = false) => {
    const keys = field.split(".");
    setCvData((prev) => {
      const newData = { ...prev };
      let current: Record<string, unknown> = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key] as Record<string, unknown>;
      }
      
      const lastKey = keys[keys.length - 1];
      if (append && typeof current[lastKey] === "string") {
        current[lastKey] = (current[lastKey] as string) + " " + value;
      } else {
        current[lastKey] = value;
      }
      
      return newData;
    });
  };

  // AI Assistance
  const handleAIAssist = async (section: string, context: string) => {
    setIsAILoading(true);
    setAiSuggestion(null);

    try {
      const response = await fetch("/api/cv-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section,
          context,
          currentData: cvData,
          language,
        } as AIAssistRequest & { currentData: CVData; language: string }),
      });

      if (!response.ok) {
        throw new Error("AI assistance failed");
      }

      const data = await response.json();
      setAiSuggestion(data.suggestion);
    } catch (error) {
      console.error("AI assist error:", error);
    } finally {
      setIsAILoading(false);
    }
  };

  // Apply AI suggestion
  const applyAISuggestion = () => {
    if (aiSuggestion) {
      updateField(activeSection, aiSuggestion);
      setAiSuggestion(null);
    }
  };

  // Add new item to array sections
  const addItem = (section: keyof CVData) => {
    const id = generateId();
    let newItem: Record<string, unknown> = { id };

    switch (section) {
      case "experience":
        newItem = {
          id,
          company: "",
          position: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
          achievements: [],
        };
        break;
      case "education":
        newItem = {
          id,
          school: "",
          degree: "",
          field: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
        };
        break;
      case "skills":
        newItem = {
          id,
          name: "",
          level: "intermediate" as const,
          category: "Technique",
        };
        break;
      case "languages":
        newItem = {
          id,
          name: "",
          level: "Intermédiaire (B2)",
        };
        break;
      case "certifications":
        newItem = {
          id,
          name: "",
          issuer: "",
          date: "",
        };
        break;
      case "projects":
        newItem = {
          id,
          name: "",
          description: "",
          technologies: [],
        };
        break;
    }

    setCvData((prev) => ({
      ...prev,
      [section]: [...(prev[section] as Array<unknown>), newItem],
    }));
  };

  // Remove item from array sections
  const removeItem = (section: keyof CVData, id: string) => {
    setCvData((prev) => ({
      ...prev,
      [section]: (prev[section] as Array<{ id: string }>).filter((item) => item.id !== id),
    }));
  };

  // Toggle item expansion
  const toggleItemExpansion = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Export CV
  const handleExport = () => {
    onExport?.(cvData, selectedTemplate);
  };

  // Template selection
  const currentTemplate = CV_TEMPLATES.find((t) => t.id === selectedTemplate);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Editor */}
        <div className="w-1/2 border-r border-gray-200 dark:border-gray-800 flex flex-col">
          {/* Template Selection */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Layout className="w-4 h-4 text-emerald-500" />
                Choisir un template
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPreviewScale((s) => Math.max(0.3, s - 0.1))}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPreviewScale((s) => Math.min(1, s + 0.1))}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {CV_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={cn(
                    "flex-shrink-0 p-3 rounded-xl border-2 transition-all",
                    selectedTemplate === template.id
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  )}
                >
                  <div
                    className="w-20 h-24 rounded-lg mb-2 flex items-center justify-center"
                    style={{ backgroundColor: template.colorScheme.background }}
                  >
                    <div
                      className="w-16 h-20 rounded border-2 flex flex-col items-center justify-center gap-1"
                      style={{ borderColor: template.colorScheme.primary }}
                    >
                      <div
                        className="w-8 h-2 rounded"
                        style={{ backgroundColor: template.colorScheme.primary }}
                      />
                      <div
                        className="w-10 h-1 rounded"
                        style={{ backgroundColor: template.colorScheme.accent }}
                      />
                      <div className="flex gap-1 mt-1">
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: template.colorScheme.secondary }}
                        />
                        <div className="flex-1 space-y-0.5">
                          <div className="w-full h-0.5 bg-gray-200" />
                          <div className="w-3/4 h-0.5 bg-gray-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-center">{template.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Section Tabs */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <Tabs value={activeSection} onValueChange={setActiveSection}>
              <TabsList className="grid grid-cols-4 gap-1 h-auto">
                <TabsTrigger value="personal" className="text-xs py-2">
                  <User className="w-3 h-3 mr-1" />
                  Infos
                </TabsTrigger>
                <TabsTrigger value="experience" className="text-xs py-2">
                  <Briefcase className="w-3 h-3 mr-1" />
                  Expérience
                </TabsTrigger>
                <TabsTrigger value="education" className="text-xs py-2">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  Formation
                </TabsTrigger>
                <TabsTrigger value="skills" className="text-xs py-2">
                  <Code className="w-3 h-3 mr-1" />
                  Compétences
                </TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-3 gap-1 h-auto mt-1">
                <TabsTrigger value="languages" className="text-xs py-2">
                  <Languages className="w-3 h-3 mr-1" />
                  Langues
                </TabsTrigger>
                <TabsTrigger value="certifications" className="text-xs py-2">
                  <Award className="w-3 h-3 mr-1" />
                  Certifications
                </TabsTrigger>
                <TabsTrigger value="projects" className="text-xs py-2">
                  <FolderGit2 className="w-3 h-3 mr-1" />
                  Projets
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Editor Content */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {/* Personal Info Section */}
              {activeSection === "personal" && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Informations personnelles</CardTitle>
                    <CardDescription>
                      Vos coordonnées et présentation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Prénom</Label>
                        <Input
                          value={cvData.personalInfo.firstName}
                          onChange={(e) => updateField("personalInfo.firstName", e.target.value)}
                          placeholder="Jean"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Nom</Label>
                        <Input
                          value={cvData.personalInfo.lastName}
                          onChange={(e) => updateField("personalInfo.lastName", e.target.value)}
                          placeholder="Dupont"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={cvData.personalInfo.email}
                          onChange={(e) => updateField("personalInfo.email", e.target.value)}
                          placeholder="jean.dupont@email.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Téléphone</Label>
                        <Input
                          value={cvData.personalInfo.phone}
                          onChange={(e) => updateField("personalInfo.phone", e.target.value)}
                          placeholder="+33 6 12 34 56 78"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Localisation</Label>
                      <Input
                        value={cvData.personalInfo.location}
                        onChange={(e) => updateField("personalInfo.location", e.target.value)}
                        placeholder="Paris, France"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>LinkedIn</Label>
                        <Input
                          value={cvData.personalInfo.linkedin || ""}
                          onChange={(e) => updateField("personalInfo.linkedin", e.target.value)}
                          placeholder="linkedin.com/in/jeandupont"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Site web</Label>
                        <Input
                          value={cvData.personalInfo.website || ""}
                          onChange={(e) => updateField("personalInfo.website", e.target.value)}
                          placeholder="jeandupont.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Résumé professionnel</Label>
                        <div className="flex gap-2">
                          {voiceSupported && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setActiveVoiceField("personalInfo.summary");
                                toggleListening();
                              }}
                              className={cn(
                                isListening && activeVoiceField === "personalInfo.summary"
                                  ? "text-rose-500"
                                  : ""
                              )}
                            >
                              {isListening && activeVoiceField === "personalInfo.summary" ? (
                                <MicOff className="w-4 h-4" />
                              ) : (
                                <Mic className="w-4 h-4" />
                              )}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleAIAssist("summary", "Génère un résumé professionnel impactant")
                            }
                            disabled={isAILoading}
                          >
                            {isAILoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Wand2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        value={cvData.personalInfo.summary}
                        onChange={(e) => updateField("personalInfo.summary", e.target.value)}
                        placeholder="Décrivez brièvement votre profil professionnel..."
                        className="min-h-[120px]"
                      />
                      {aiSuggestion && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-purple-500" />
                              <p className="text-sm text-purple-700 dark:text-purple-300">
                                Suggestion IA
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setAiSuggestion(null)}
                              >
                                <RotateCcw className="w-3 h-3" />
                              </Button>
                              <Button size="sm" onClick={applyAISuggestion}>
                                <Check className="w-3 h-3 mr-1" />
                                Appliquer
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm mt-2">{aiSuggestion}</p>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Experience Section */}
              {activeSection === "experience" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Expériences professionnelles</h3>
                    <Button variant="outline" size="sm" onClick={() => addItem("experience")}>
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                  <AnimatePresence>
                    {cvData.experience.map((exp, index) => (
                      <motion.div
                        key={exp.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Card>
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{index + 1}</Badge>
                                <span className="font-medium">
                                  {exp.position || "Nouvelle expérience"}
                                </span>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => toggleItemExpansion(exp.id)}
                                >
                                  {expandedItems[exp.id] ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-rose-500"
                                  onClick={() => removeItem("experience", exp.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          {(expandedItems[exp.id] || index === 0) && (
                            <CardContent className="space-y-3 pt-0">
                              <div className="grid grid-cols-2 gap-3">
                                <Input
                                  value={exp.position}
                                  onChange={(e) => {
                                    const updated = [...cvData.experience];
                                    updated[index] = { ...exp, position: e.target.value };
                                    setCvData((prev) => ({ ...prev, experience: updated }));
                                  }}
                                  placeholder="Poste occupé"
                                />
                                <Input
                                  value={exp.company}
                                  onChange={(e) => {
                                    const updated = [...cvData.experience];
                                    updated[index] = { ...exp, company: e.target.value };
                                    setCvData((prev) => ({ ...prev, experience: updated }));
                                  }}
                                  placeholder="Entreprise"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <Input
                                  value={exp.startDate}
                                  onChange={(e) => {
                                    const updated = [...cvData.experience];
                                    updated[index] = { ...exp, startDate: e.target.value };
                                    setCvData((prev) => ({ ...prev, experience: updated }));
                                  }}
                                  placeholder="Date début (MM/AAAA)"
                                />
                                <Input
                                  value={exp.endDate}
                                  onChange={(e) => {
                                    const updated = [...cvData.experience];
                                    updated[index] = { ...exp, endDate: e.target.value };
                                    setCvData((prev) => ({ ...prev, experience: updated }));
                                  }}
                                  placeholder="Date fin"
                                  disabled={exp.current}
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={exp.current}
                                  onChange={(e) => {
                                    const updated = [...cvData.experience];
                                    updated[index] = { ...exp, current: e.target.checked };
                                    setCvData((prev) => ({ ...prev, experience: updated }));
                                  }}
                                  className="rounded"
                                />
                                <Label className="text-sm">Poste actuel</Label>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label>Description</Label>
                                  <div className="flex gap-1">
                                    {voiceSupported && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setActiveVoiceField(`experience.${index}.description`);
                                          toggleListening();
                                        }}
                                      >
                                        {isListening &&
                                        activeVoiceField === `experience.${index}.description` ? (
                                          <MicOff className="w-3 h-3 text-rose-500" />
                                        ) : (
                                          <Mic className="w-3 h-3" />
                                        )}
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleAIAssist(
                                          "experience",
                                          `Poste: ${exp.position} chez ${exp.company}`
                                        )
                                      }
                                    >
                                      <Wand2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                                <Textarea
                                  value={exp.description}
                                  onChange={(e) => {
                                    const updated = [...cvData.experience];
                                    updated[index] = { ...exp, description: e.target.value };
                                    setCvData((prev) => ({ ...prev, experience: updated }));
                                  }}
                                  placeholder="Décrivez vos responsabilités et réalisations..."
                                  className="min-h-[80px]"
                                />
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Education Section */}
              {activeSection === "education" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Formation</h3>
                    <Button variant="outline" size="sm" onClick={() => addItem("education")}>
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                  {cvData.education.map((edu, index) => (
                    <Card key={edu.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {edu.degree || "Nouvelle formation"}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-rose-500"
                            onClick={() => removeItem("education", edu.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-0">
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            value={edu.school}
                            onChange={(e) => {
                              const updated = [...cvData.education];
                              updated[index] = { ...edu, school: e.target.value };
                              setCvData((prev) => ({ ...prev, education: updated }));
                            }}
                            placeholder="Établissement"
                          />
                          <Input
                            value={edu.degree}
                            onChange={(e) => {
                              const updated = [...cvData.education];
                              updated[index] = { ...edu, degree: e.target.value };
                              setCvData((prev) => ({ ...prev, education: updated }));
                            }}
                            placeholder="Diplôme"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            value={edu.field}
                            onChange={(e) => {
                              const updated = [...cvData.education];
                              updated[index] = { ...edu, field: e.target.value };
                              setCvData((prev) => ({ ...prev, education: updated }));
                            }}
                            placeholder="Domaine d'études"
                          />
                          <Input
                            value={edu.location}
                            onChange={(e) => {
                              const updated = [...cvData.education];
                              updated[index] = { ...edu, location: e.target.value };
                              setCvData((prev) => ({ ...prev, education: updated }));
                            }}
                            placeholder="Ville"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            value={edu.startDate}
                            onChange={(e) => {
                              const updated = [...cvData.education];
                              updated[index] = { ...edu, startDate: e.target.value };
                              setCvData((prev) => ({ ...prev, education: updated }));
                            }}
                            placeholder="Date début"
                          />
                          <Input
                            value={edu.endDate}
                            onChange={(e) => {
                              const updated = [...cvData.education];
                              updated[index] = { ...edu, endDate: e.target.value };
                              setCvData((prev) => ({ ...prev, education: updated }));
                            }}
                            placeholder="Date fin"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Skills Section */}
              {activeSection === "skills" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Compétences</h3>
                    <Button variant="outline" size="sm" onClick={() => addItem("skills")}>
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {cvData.skills.map((skill, index) => (
                      <Card key={skill.id} className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <Input
                            value={skill.name}
                            onChange={(e) => {
                              const updated = [...cvData.skills];
                              updated[index] = { ...skill, name: e.target.value };
                              setCvData((prev) => ({ ...prev, skills: updated }));
                            }}
                            placeholder="Compétence"
                            className="border-0 p-0 h-auto font-medium"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-rose-500"
                            onClick={() => removeItem("skills", skill.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Select
                            value={skill.level}
                            onValueChange={(value) => {
                              const updated = [...cvData.skills];
                              updated[index] = {
                                ...skill,
                                level: value as keyof typeof SKILL_LEVELS,
                              };
                              setCvData((prev) => ({ ...prev, skills: updated }));
                            }}
                          >
                            <SelectTrigger className="h-7 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(SKILL_LEVELS).map(([key, { label }]) => (
                                <SelectItem key={key} value={key}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={skill.category}
                            onValueChange={(value) => {
                              const updated = [...cvData.skills];
                              updated[index] = { ...skill, category: value };
                              setCvData((prev) => ({ ...prev, skills: updated }));
                            }}
                          >
                            <SelectTrigger className="h-7 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {SKILL_CATEGORIES.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Progress
                          value={SKILL_LEVELS[skill.level].value}
                          className="h-1 mt-2"
                        />
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages Section */}
              {activeSection === "languages" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Langues</h3>
                    <Button variant="outline" size="sm" onClick={() => addItem("languages")}>
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {cvData.languages.map((lang, index) => (
                      <Card key={lang.id} className="p-3">
                        <div className="flex items-center gap-2">
                          <Input
                            value={lang.name}
                            onChange={(e) => {
                              const updated = [...cvData.languages];
                              updated[index] = { ...lang, name: e.target.value };
                              setCvData((prev) => ({ ...prev, languages: updated }));
                            }}
                            placeholder="Langue"
                            className="border-0 p-0 h-auto"
                          />
                          <Select
                            value={lang.level}
                            onValueChange={(value) => {
                              const updated = [...cvData.languages];
                              updated[index] = { ...lang, level: value };
                              setCvData((prev) => ({ ...prev, languages: updated }));
                            }}
                          >
                            <SelectTrigger className="h-7 text-xs w-auto">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {LANGUAGE_LEVELS.map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-rose-500"
                            onClick={() => removeItem("languages", lang.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications Section */}
              {activeSection === "certifications" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Certifications</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addItem("certifications")}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                  {cvData.certifications.map((cert, index) => (
                    <Card key={cert.id} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Award className="w-5 h-5 text-amber-500" />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-rose-500"
                          onClick={() => removeItem("certifications", cert.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Input
                          value={cert.name}
                          onChange={(e) => {
                            const updated = [...cvData.certifications];
                            updated[index] = { ...cert, name: e.target.value };
                            setCvData((prev) => ({ ...prev, certifications: updated }));
                          }}
                          placeholder="Nom de la certification"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            value={cert.issuer}
                            onChange={(e) => {
                              const updated = [...cvData.certifications];
                              updated[index] = { ...cert, issuer: e.target.value };
                              setCvData((prev) => ({ ...prev, certifications: updated }));
                            }}
                            placeholder="Organisme"
                          />
                          <Input
                            value={cert.date}
                            onChange={(e) => {
                              const updated = [...cvData.certifications];
                              updated[index] = { ...cert, date: e.target.value };
                              setCvData((prev) => ({ ...prev, certifications: updated }));
                            }}
                            placeholder="Date"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Projects Section */}
              {activeSection === "projects" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Projets</h3>
                    <Button variant="outline" size="sm" onClick={() => addItem("projects")}>
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                  {cvData.projects.map((project, index) => (
                    <Card key={project.id} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <FolderGit2 className="w-5 h-5 text-blue-500" />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-rose-500"
                          onClick={() => removeItem("projects", project.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Input
                          value={project.name}
                          onChange={(e) => {
                            const updated = [...cvData.projects];
                            updated[index] = { ...project, name: e.target.value };
                            setCvData((prev) => ({ ...prev, projects: updated }));
                          }}
                          placeholder="Nom du projet"
                        />
                        <Textarea
                          value={project.description}
                          onChange={(e) => {
                            const updated = [...cvData.projects];
                            updated[index] = { ...project, description: e.target.value };
                            setCvData((prev) => ({ ...prev, projects: updated }));
                          }}
                          placeholder="Description du projet..."
                          className="min-h-[60px]"
                        />
                        <Input
                          value={project.technologies.join(", ")}
                          onChange={(e) => {
                            const updated = [...cvData.projects];
                            updated[index] = {
                              ...project,
                              technologies: e.target.value.split(",").map((t) => t.trim()),
                            };
                            setCvData((prev) => ({ ...prev, projects: updated }));
                          }}
                          placeholder="Technologies (séparées par des virgules)"
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Action Buttons */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.print()}
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimer
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                onClick={handleExport}
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        {showPreview && (
          <div className="w-1/2 bg-gray-100 dark:bg-gray-900 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-500" />
                  Aperçu en direct
                </h3>
                <Badge variant="outline" className="text-xs">
                  {currentTemplate?.name}
                </Badge>
              </div>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div
                className="mx-auto origin-top transition-transform"
                style={{ transform: `scale(${previewScale})` }}
              >
                <CVPreview data={cvData} template={selectedTemplate} />
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* Voice Dictation Indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-rose-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Mic className="w-4 h-4" />
            </motion.div>
            <span>Écoute en cours...</span>
            {interimTranscript && (
              <span className="text-rose-200 text-sm ml-2">
                "{interimTranscript}"
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CVBuilder;
