import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GraduationCap, Users, Building, Settings } from "lucide-react";

export default function Landing() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const handleLogin = () => {
    if (!selectedRole) {
      return;
    }
    // Store selected role in localStorage for after login
    localStorage.setItem('pendingRole', selectedRole);
    window.location.href = '/api/login';
  };

  const roles = [
    {
      id: "student",
      name: "Student",
      description: "Apply to universities and track your applications",
      icon: GraduationCap,
      color: "text-blue-600",
    },
    {
      id: "agent",
      name: "Educational Agent",
      description: "Manage student leads and track commissions",
      icon: Users,
      color: "text-emerald-600",
    },
    {
      id: "university",
      name: "University Representative",
      description: "Manage applications and university programs",
      icon: Building,
      color: "text-amber-600",
    },
    {
      id: "admin",
      name: "System Administrator",
      description: "Manage system users and analytics",
      icon: Settings,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-blue-600 mb-4">Osmosis Portal</h1>
          <p className="text-xl text-gray-600 mb-8">
            Your comprehensive study visa management system
          </p>
          
          <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
            <DialogTrigger asChild>
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700"
              >
                Get Started
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Choose Your Role</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Please select your role to access the appropriate dashboard and features.
                </p>
                
                <div className="space-y-3">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    return (
                      <div
                        key={role.id}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedRole === role.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedRole(role.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-6 h-6 ${role.color}`} />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{role.name}</div>
                            <div className="text-sm text-gray-500">{role.description}</div>
                          </div>
                          {selectedRole === role.id && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setLoginModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={handleLogin}
                    disabled={!selectedRole}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <GraduationCap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Students</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Manage applications, track progress, and find your dream university
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <CardTitle>Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Lead management, commission tracking, and performance analytics
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Building className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <CardTitle>Universities</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Manage applications, programs, and student admissions
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Settings className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                System management, analytics, and comprehensive oversight
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Why Choose Osmosis Portal?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Comprehensive Management</h3>
              <p className="text-gray-600">
                Handle everything from university search to visa approval in one place
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Real-time Tracking</h3>
              <p className="text-gray-600">
                Stay updated with application status and important deadlines
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Multi-role Support</h3>
              <p className="text-gray-600">
                Designed for students, agents, universities, and administrators
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
