import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [documentUploadOpen, setDocumentUploadOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(user?.role || "student");

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
        onRoleChange={setCurrentRole}
      />

      <DocumentUploadModal 
        open={documentUploadOpen}
        onOpenChange={setDocumentUploadOpen}
      />
    </div>
  );
}
