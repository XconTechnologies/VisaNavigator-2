import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/navigation/header";
import Sidebar from "@/components/navigation/sidebar";
import StudentDashboard from "@/components/dashboard/student-dashboard";
import AgentDashboard from "@/components/dashboard/agent-dashboard";
import UniversityDashboard from "@/components/dashboard/university-dashboard";
import AdminDashboard from "@/components/dashboard/admin-dashboard";
import RoleSwitcherModal from "@/components/modals/role-switcher-modal";
import DocumentUploadModal from "@/components/modals/document-upload-modal";

export default function Home() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [documentUploadOpen, setDocumentUploadOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(user?.role || "student");

  const updateRoleMutation = useMutation({
    mutationFn: async (role: string) => {
      await apiRequest('/api/auth/user/role', {
        method: 'POST',
        body: JSON.stringify({ role }),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({
        title: "Role updated",
        description: "Your role has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update role.",
        variant: "destructive",
      });
    }
  });

  // Handle pending role from localStorage after login
  useEffect(() => {
    const pendingRole = localStorage.getItem('pendingRole');
    if (pendingRole && user && user.role !== pendingRole) {
      updateRoleMutation.mutate(pendingRole);
      localStorage.removeItem('pendingRole');
    }
  }, [user]);

  const handleRoleChange = (newRole: string) => {
    setCurrentRole(newRole);
    if (user && user.role !== newRole) {
      updateRoleMutation.mutate(newRole);
    }
  };

  const renderDashboard = () => {
    switch (currentRole) {
      case "agent":
        return <AgentDashboard />;
      case "university":
        return <UniversityDashboard />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user} 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="flex h-screen pt-16">
        <Sidebar 
          user={user} 
          currentRole={currentRole}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onRoleSwitchClick={() => setRoleSwitcherOpen(true)}
        />
        
        <div className="flex-1 overflow-hidden">
          <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
            {renderDashboard()}
          </main>
        </div>
      </div>

      <RoleSwitcherModal 
        open={roleSwitcherOpen}
        onOpenChange={setRoleSwitcherOpen}
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
      />

      <DocumentUploadModal 
        open={documentUploadOpen}
        onOpenChange={setDocumentUploadOpen}
      />
    </div>
  );
}
