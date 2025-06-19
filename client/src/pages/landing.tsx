import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, Building, Settings } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-blue-600 mb-4">Osmosis Portal</h1>
          <p className="text-xl text-gray-600 mb-8">
            Your comprehensive study visa management system
          </p>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => window.location.href = '/api/login'}
          >
            Get Started
          </Button>
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
