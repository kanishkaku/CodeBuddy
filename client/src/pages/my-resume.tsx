import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Clock, Github, Globe, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function MyResume() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("preview");

  const { data: user } = useQuery({
    queryKey: ["/api/current-user"],
  });

  const { data: resume, isLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/resume`],
    enabled: !!user,
  });

  const { data: contributions } = useQuery({
    queryKey: [`/api/users/${user?.id}/contributions`],
    enabled: !!user,
  });

  const updateResumeMutation = useMutation({
    mutationFn: async (resumeData: any) => {
      if (!user) throw new Error("You must be logged in to update your resume");
      return await apiRequest("PATCH", `/api/users/${user.id}/resume`, resumeData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/resume`] });
      toast({
        title: "Resume updated",
        description: "Your resume has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update resume",
        variant: "destructive",
      });
    },
  });

  // Form state
  const [formData, setFormData] = useState({
    personalInfo: resume?.personalInfo || {
      name: user?.displayName || "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
    },
    skills: resume?.skills || [],
    education: resume?.education || [],
    experience: resume?.experience || [],
    projects: resume?.projects || [],
    certifications: resume?.certifications || [],
  });

  const [newSkill, setNewSkill] = useState("");

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      personalInfo: {
        ...formData.personalInfo,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() === "") return;
    setFormData({
      ...formData,
      skills: [...formData.skills, newSkill.trim()],
    });
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove),
    });
  };

  const handleSaveResume = () => {
    // Calculate completion percentage
    const sections = [
      !!formData.personalInfo.name,
      formData.skills.length > 0,
      true, // Contributions are tracked automatically
      formData.education.length > 0,
      formData.projects.length > 0,
      formData.certifications.length > 0
    ];
    
    const completedSections = sections.filter(Boolean).length;
    const completionPercentage = Math.round((completedSections / sections.length) * 100);
    
    updateResumeMutation.mutate({
      ...formData,
      completionPercentage
    });
  };

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>
        <div className="h-[600px] bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">My Resume</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setActiveTab("preview")}>Preview</Button>
          <Button variant="outline" onClick={() => setActiveTab("edit")}>Edit</Button>
          <Button onClick={handleSaveResume}>Save Resume</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="edit">Edit</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="mt-4">
          <ScrollArea className="h-[calc(100vh-220px)] rounded-md border">
            <div className="bg-white p-8">
              {/* Personal Information */}
              <div className="mb-6 pb-6 border-b">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {formData.personalInfo.name || user?.displayName || "Your Name"}
                </h1>
                <p className="text-gray-500 mb-4">
                  {user?.role || "Position/Role"}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {formData.personalInfo.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {formData.personalInfo.email}
                    </div>
                  )}
                  {formData.personalInfo.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {formData.personalInfo.phone}
                    </div>
                  )}
                  {formData.personalInfo.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {formData.personalInfo.location}
                    </div>
                  )}
                  {formData.personalInfo.github && (
                    <div className="flex items-center">
                      <Github className="h-4 w-4 mr-1" />
                      {formData.personalInfo.github}
                    </div>
                  )}
                  {formData.personalInfo.linkedin && (
                    <div className="flex items-center">
                      <Linkedin className="h-4 w-4 mr-1" />
                      {formData.personalInfo.linkedin}
                    </div>
                  )}
                  {formData.personalInfo.website && (
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-1" />
                      {formData.personalInfo.website}
                    </div>
                  )}
                </div>
              </div>

              {/* Skills */}
              {formData.skills.length > 0 && (
                <div className="mb-6 pb-6 border-b">
                  <h2 className="text-xl font-semibold mb-2">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-50 text-primary rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Open Source Contributions */}
              {contributions && contributions.length > 0 && (
                <div className="mb-6 pb-6 border-b">
                  <h2 className="text-xl font-semibold mb-2">Open Source Contributions</h2>
                  <div className="space-y-4">
                    {contributions.map((contribution: any) => (
                      <div key={contribution.id} className="border-l-2 border-primary pl-4">
                        <h3 className="font-medium">
                          {contribution.task && contribution.task.projectName ? 
                            `${contribution.task.projectName}: ${contribution.task.title}` : 
                            'Contributed Task'}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">{contribution.description}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>
                            {new Date(contribution.completedAt).toLocaleDateString()}
                          </span>
                          {contribution.pullRequestUrl && (
                            <a 
                              href={contribution.pullRequestUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="ml-3 flex items-center text-primary"
                            >
                              <Github className="h-3 w-3 mr-1" />
                              Pull Request
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {formData.education.length > 0 && (
                <div className="mb-6 pb-6 border-b">
                  <h2 className="text-xl font-semibold mb-2">Education</h2>
                  <div className="space-y-4">
                    {formData.education.map((edu: any, index: number) => (
                      <div key={index}>
                        <h3 className="font-medium">{edu.institution}</h3>
                        <p className="text-sm">{edu.degree}</p>
                        <p className="text-xs text-gray-500">
                          {edu.startDate} - {edu.endDate || 'Present'}
                        </p>
                        {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {formData.projects.length > 0 && (
                <div className="mb-6 pb-6 border-b">
                  <h2 className="text-xl font-semibold mb-2">Projects</h2>
                  <div className="space-y-4">
                    {formData.projects.map((project: any, index: number) => (
                      <div key={index}>
                        <h3 className="font-medium">{project.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{project.description}</p>
                        {project.technologies && (
                          <div className="flex flex-wrap gap-1 mb-1">
                            {project.technologies.map((tech: string, techIndex: number) => (
                              <span key={techIndex} className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        {project.link && (
                          <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-primary flex items-center"
                          >
                            <Globe className="h-3 w-3 mr-1" />
                            Project Link
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {formData.certifications.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Certifications</h2>
                  <div className="space-y-4">
                    {formData.certifications.map((cert: any, index: number) => (
                      <div key={index}>
                        <h3 className="font-medium">{cert.name}</h3>
                        <p className="text-sm">{cert.issuer}</p>
                        <p className="text-xs text-gray-500">{cert.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="edit" className="mt-4">
          <Card className="border">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.personalInfo.name}
                    onChange={handlePersonalInfoChange}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.personalInfo.email}
                    onChange={handlePersonalInfoChange}
                    placeholder="your.email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.personalInfo.phone}
                    onChange={handlePersonalInfoChange}
                    placeholder="(123) 456-7890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.personalInfo.location}
                    onChange={handlePersonalInfoChange}
                    placeholder="City, State"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    name="github"
                    value={formData.personalInfo.github}
                    onChange={handlePersonalInfoChange}
                    placeholder="github.com/username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    name="linkedin"
                    value={formData.personalInfo.linkedin}
                    onChange={handlePersonalInfoChange}
                    placeholder="linkedin.com/in/username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Personal Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.personalInfo.website}
                    onChange={handlePersonalInfoChange}
                    placeholder="yourwebsite.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border mt-4">
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
                <Button onClick={handleAddSkill}>Add</Button>
              </div>
              
              {formData.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center bg-blue-50 text-primary rounded-full px-3 py-1">
                      <span className="text-sm">{skill}</span>
                      <button 
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 text-primary hover:text-primary-dark focus:outline-none"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No skills added yet.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border mt-4">
            <CardHeader>
              <CardTitle>Open Source Contributions</CardTitle>
            </CardHeader>
            <CardContent>
              {contributions && contributions.length > 0 ? (
                <div className="space-y-4">
                  {contributions.map((contribution: any) => (
                    <div key={contribution.id} className="border-l-2 border-primary pl-4">
                      <h3 className="font-medium">
                        {contribution.task && contribution.task.projectName ? 
                          `${contribution.task.projectName}: ${contribution.task.title}` : 
                          'Contributed Task'}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">{contribution.description}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          {new Date(contribution.completedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-2">No contributions yet.</p>
                  <p className="text-sm text-gray-400">Complete tasks from the Explore section to add them here.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* In a real app, you would add more sections for Education, Projects, and Certifications with their own form fields */}
          
          <div className="mt-6 text-center">
            <Button size="lg" onClick={handleSaveResume}>Save Resume</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
