import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, Plus, Search, FileText, CheckCircle, Clock, Tickets } from "lucide-react";
import UniversitySearch from "@/components/university/university-search";

export default function StudentDashboard() {
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

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="md:flex md:items-center md:justify-between mb-8">
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
            <Button className="inline-flex items-center bg-blue-600 hover:bg-blue-700">
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
                <Button variant="outline" className="w-full">
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
            <CardContent>
              <UniversitySearch />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
