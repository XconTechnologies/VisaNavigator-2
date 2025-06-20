import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Plus, Search, FileText, CheckCircle, Clock, Tickets, Upload, GraduationCap, LifeBuoy } from "lucide-react";
import UniversitySearch from "@/components/university/university-search";
import ApplicationList from "@/components/applications/application-list";
import DocumentManager from "@/components/documents/document-manager";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: applications, isLoading: applicationsLoading } = useQuery({
    queryKey: ["/api/applications"],
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ["/api/tasks"],
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
      case "draft":
        return "Draft";
      default:
        return "Unknown";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-400";
      case "medium":
        return "bg-yellow-400";
      case "low":
        return "bg-green-400";
      default:
        return "bg-gray-400";
    }
  };

  // Helper function to handle URL hash changes for navigation
  const handleNavigation = (section: string) => {
    setActiveTab(section);
    window.location.hash = section;
  };

  // Listen for hash changes from sidebar navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const sectionMap: { [key: string]: string } = {
          'overview': 'overview',
          'university-search': 'university-search',
          'my-applications': 'applications',
          'documents': 'documents',
          'visa-tracker': 'visa',
          'scholarships': 'scholarships',
          'support': 'support'
        };
        const mappedSection = sectionMap[hash] || 'overview';
        setActiveTab(mappedSection);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Handle initial load

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Welcome back!
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Track your study abroad journey and manage your applications
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <Button variant="outline" className="inline-flex items-center">
            <CalendarDays className="mr-2 h-4 w-4" />
            Schedule Call
          </Button>
          <Button 
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700"
            onClick={() => handleNavigation('applications')}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Application
          </Button>
        </div>
      </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Applications</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {statsLoading ? "..." : stats?.totalApplications || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-emerald-600 rounded-md flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Offer Letters</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {statsLoading ? "..." : stats?.offerLetters || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-amber-500 rounded-md flex items-center justify-center">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Reviews</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {statsLoading ? "..." : stats?.pendingReviews || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <Tickets className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Visa Status</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {statsLoading ? "..." : stats?.visaStatus || "In Progress"}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications and Tasks */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applicationsLoading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : applications && applications.length > 0 ? (
                  applications.slice(0, 3).map((app: any) => (
                    <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-600 font-medium text-sm">
                            {app.university?.country?.substring(0, 2).toUpperCase() || "UN"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {app.university?.universityName || "Unknown University"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {app.program?.programName || "Unknown Program"}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(app.status)}>
                        {getStatusText(app.status)}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No applications yet
                  </div>
                )}
              </div>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleNavigation('applications')}
                >
                  View All Applications
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasksLoading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : tasks && tasks.length > 0 ? (
                  tasks.slice(0, 3).map((task: any) => (
                    <div key={task.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`w-2 h-2 ${getPriorityColor(task.priority)} rounded-full mt-2`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{task.title}</p>
                        <p className="text-xs text-gray-500">
                          Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                        </p>
                      </div>
                      <Button size="sm" variant="link" className="text-xs text-blue-600 hover:text-blue-700">
                        Mark Done
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No pending tasks
                  </div>
                )}
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  View All Tasks
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

      {/* University Search Section */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Smart University Finder</CardTitle>
          </CardHeader>
          <CardContent className="max-h-screen overflow-visible">
            <UniversitySearch />
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderVisaTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Visa Tracker</h2>
        <p className="text-gray-600 mb-6">Track your visa application progress and important dates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Visa Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">Current Status</span>
                <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Application Submitted</span>
                  <span className="text-green-600">✓ Complete</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Biometrics Appointment</span>
                  <span className="text-yellow-600">⏳ Pending</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Interview Scheduled</span>
                  <span className="text-gray-400">⚪ Not Started</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Important Dates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                <p className="font-medium text-sm">Biometrics Appointment</p>
                <p className="text-xs text-gray-600">Schedule your appointment soon</p>
              </div>
              <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50">
                <p className="font-medium text-sm">Document Deadline</p>
                <p className="text-xs text-gray-600">Submit remaining documents by Dec 15</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderScholarshipsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Scholarships</h2>
        <p className="text-gray-600 mb-6">Discover and apply for scholarships that match your profile</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="mr-2 h-5 w-5" />
              Available Scholarships
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">Merit-Based Scholarship</h4>
                <p className="text-sm text-gray-600 mt-1">Up to $25,000 for exceptional academic performance</p>
                <div className="flex justify-between items-center mt-3">
                  <Badge className="bg-green-100 text-green-800">Eligible</Badge>
                  <Button size="sm">Apply Now</Button>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">Need-Based Grant</h4>
                <p className="text-sm text-gray-600 mt-1">Financial assistance for qualified students</p>
                <div className="flex justify-between items-center mt-3">
                  <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>
                  <Button size="sm" variant="outline">View Status</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Start early</p>
                  <p className="text-xs text-gray-600">Begin applications 6 months before deadlines</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Tailor your essays</p>
                  <p className="text-xs text-gray-600">Customize each application to the specific scholarship</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSupportTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Support Center</h2>
        <p className="text-gray-600 mb-6">Get help with your study abroad journey</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LifeBuoy className="mr-2 h-5 w-5" />
              Quick Help
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Application Guidelines
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Upload className="mr-2 h-4 w-4" />
                Document Requirements
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Tickets className="mr-2 h-4 w-4" />
                Visa Information
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="How can we help you?"
                />
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Send Message
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="overview">
            {renderOverviewTab()}
          </TabsContent>
          
          <TabsContent value="university-search">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">University Search</h2>
                <p className="text-gray-600 mb-6">Find the perfect university for your study abroad journey</p>
              </div>
              <Card>
                <CardContent className="p-6">
                  <UniversitySearch />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="applications">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
                  <p className="text-gray-600">Track and manage your university applications</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  New Application
                </Button>
              </div>
              <ApplicationList />
            </div>
          </TabsContent>
          
          <TabsContent value="documents">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Document Manager</h2>
                <p className="text-gray-600 mb-6">Upload and manage your application documents</p>
              </div>
              <DocumentManager />
            </div>
          </TabsContent>
          
          <TabsContent value="visa">
            {renderVisaTab()}
          </TabsContent>
          
          <TabsContent value="scholarships">
            {renderScholarshipsTab()}
          </TabsContent>
          
          <TabsContent value="support">
            {renderSupportTab()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
