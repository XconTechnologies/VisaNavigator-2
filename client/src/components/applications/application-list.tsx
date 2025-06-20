import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Eye, Edit, MoreHorizontal, Calendar, MapPin, Plus } from "lucide-react";
import { useState } from "react";

export default function ApplicationList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [newApplicationOpen, setNewApplicationOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");

  const { data: applications, isLoading } = useQuery({
    queryKey: ["/api/applications"],
  });

  const { data: universities } = useQuery({
    queryKey: ["/api/universities"],
  });

  const { data: programs } = useQuery({
    queryKey: ["/api/programs", selectedUniversity],
    queryFn: () => fetch(`/api/programs/${selectedUniversity}`).then(res => res.json()),
    enabled: !!selectedUniversity,
  });

  const createApplicationMutation = useMutation({
    mutationFn: async (applicationData: any) => {
      await apiRequest('POST', '/api/applications', applicationData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/applications'] });
      setNewApplicationOpen(false);
      setSelectedUniversity("");
      setSelectedProgram("");
      toast({
        title: "Success",
        description: "Application created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create application.",
        variant: "destructive",
      });
    }
  });

  const handleCreateApplication = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    createApplicationMutation.mutate({
      universityId: parseInt(selectedUniversity),
      programId: parseInt(selectedProgram),
      personalStatement: formData.get('personalStatement'),
      status: 'draft'
    });
  };

  const updateApplicationMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PUT", `/api/applications/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success",
        description: "Application status updated successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "offer_received":
        return "bg-green-100 text-green-800";
      case "under_review":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "enrolled":
        return "bg-blue-100 text-blue-800";
      case "visa_approved":
        return "bg-emerald-100 text-emerald-800";
      case "visa_rejected":
        return "bg-red-100 text-red-800";
      case "interview_scheduled":
        return "bg-purple-100 text-purple-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "offer_received":
        return "Offer Received";
      case "under_review":
        return "Under Review";
      case "rejected":
        return "Rejected";
      case "enrolled":
        return "Enrolled";
      case "visa_approved":
        return "Visa Approved";
      case "visa_rejected":
        return "Visa Rejected";
      case "interview_scheduled":
        return "Interview Scheduled";
      case "submitted":
        return "Submitted";
      case "draft":
        return "Draft";
      default:
        return "Unknown";
    }
  };

  const filteredApplications = applications?.filter((app: any) => 
    statusFilter === "all" || app.status === statusFilter
  ) || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">My Applications</h3>
          <p className="text-sm text-gray-500">Track your university applications</p>
        </div>
        
        <div className="flex space-x-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Applications</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
              <SelectItem value="offer_received">Offer Received</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="enrolled">Enrolled</SelectItem>
              <SelectItem value="visa_approved">Visa Approved</SelectItem>
              <SelectItem value="visa_rejected">Visa Rejected</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={newApplicationOpen} onOpenChange={setNewApplicationOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                New Application
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl" aria-describedby="create-application-description">
              <DialogHeader>
                <DialogTitle>Create New Application</DialogTitle>
                <div id="create-application-description" className="text-sm text-gray-600">
                  Select a university and program to start your application process.
                </div>
              </DialogHeader>
              <form onSubmit={handleCreateApplication} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="university">University</Label>
                    <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select university" />
                      </SelectTrigger>
                      <SelectContent>
                        {universities?.map((uni: any) => (
                          <SelectItem key={uni.id} value={uni.id.toString()}>
                            {uni.universityName} - {uni.country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="program">Program</Label>
                    <Select value={selectedProgram} onValueChange={setSelectedProgram} disabled={!selectedUniversity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        {programs?.map((program: any) => (
                          <SelectItem key={program.id} value={program.id.toString()}>
                            {program.programName} ({program.degree})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="personalStatement">Personal Statement</Label>
                  <Textarea
                    name="personalStatement"
                    placeholder="Tell us why you want to study this program..."
                    className="min-h-[100px]"
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button type="button" variant="outline" onClick={() => setNewApplicationOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={createApplicationMutation.isPending || !selectedUniversity || !selectedProgram}
                  >
                    {createApplicationMutation.isPending ? "Creating..." : "Create Application"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Applications Grid */}
      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Eye className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-500 text-center mb-6">
              {statusFilter === "all" 
                ? "You haven't submitted any applications yet. Start by searching for universities."
                : `No applications with status "${getStatusText(statusFilter)}" found.`
              }
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Search Universities
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredApplications.map((application: any) => (
            <Card key={application.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">
                      {application.university?.universityName || "Unknown University"}
                    </CardTitle>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {application.university?.city}, {application.university?.country}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {application.program?.programName || "Unknown Program"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {application.program?.degree} • {application.program?.field}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(application.status)}>
                      {getStatusText(application.status)}
                    </Badge>
                    {application.program?.tuitionFee && (
                      <div className="text-sm font-medium text-gray-900">
                        ${application.program.tuitionFee.toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    Applied: {new Date(application.createdAt).toLocaleDateString()}
                  </div>

                  {application.submittedAt && (
                    <div className="text-sm text-gray-500">
                      Submitted: {new Date(application.submittedAt).toLocaleDateString()}
                    </div>
                  )}

                  {application.offerDate && (
                    <div className="text-sm text-green-600 font-medium">
                      Offer received: {new Date(application.offerDate).toLocaleDateString()}
                    </div>
                  )}

                  <div className="flex items-center space-x-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>

                  {application.status === "draft" && (
                    <Button 
                      size="sm" 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => updateApplicationMutation.mutate({
                        id: application.id,
                        status: "submitted"
                      })}
                      disabled={updateApplicationMutation.isPending}
                    >
                      Submit Application
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
