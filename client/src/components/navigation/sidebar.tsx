import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Building, 
  FileText, 
  Folder, 
  GraduationCap, 
  LifeBuoy, 
  Tickets, 
  UserCog, 
  Users 
} from "lucide-react";
import type { User } from "@shared/schema";

interface SidebarProps {
  user: User;
  currentRole: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onRoleSwitchClick: () => void;
}

export default function Sidebar({ 
  user, 
  currentRole, 
  sidebarOpen, 
  setSidebarOpen, 
  onRoleSwitchClick 
}: SidebarProps) {
  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "agent":
        return "Agent Dashboard";
      case "university":
        return "University Dashboard";
      case "admin":
        return "Admin Dashboard";
      default:
        return "Student Dashboard";
    }
  };

  const getNavigationItems = (role: string) => {
    switch (role) {
      case "agent":
        return [
          { name: "Overview", href: "#overview", icon: BarChart3, current: true },
          { name: "My Leads", href: "#leads", icon: Users },
          { name: "Applications", href: "#applications", icon: FileText, badge: "5" },
          { name: "Commission", href: "#commission", icon: Folder },
          { name: "Performance", href: "#performance", icon: BarChart3 },
          { name: "Support", href: "#support", icon: LifeBuoy },
        ];
      case "university":
        return [
          { name: "Overview", href: "#overview", icon: BarChart3, current: true },
          { name: "Applications", href: "#applications", icon: FileText, badge: "47" },
          { name: "Programs", href: "#programs", icon: GraduationCap },
          { name: "Students", href: "#students", icon: Users },
          { name: "Documents", href: "#documents", icon: Folder },
          { name: "Support", href: "#support", icon: LifeBuoy },
        ];
      case "admin":
        return [
          { name: "Overview", href: "#overview", icon: BarChart3, current: true },
          { name: "Users", href: "#users", icon: Users },
          { name: "Universities", href: "#universities", icon: Building },
          { name: "Applications", href: "#applications", icon: FileText },
          { name: "Analytics", href: "#analytics", icon: BarChart3 },
          { name: "Settings", href: "#settings", icon: UserCog },
        ];
      default:
        return [
          { name: "Overview", href: "#overview", icon: BarChart3, current: true },
          { name: "University Search", href: "#university-search", icon: Building },
          { name: "My Applications", href: "#my-applications", icon: FileText, badge: "5" },
          { name: "Documents", href: "#documents", icon: Folder },
          { name: "Visa Tracker", href: "#visa-tracker", icon: Tickets },
          { name: "Scholarships", href: "#scholarships", icon: GraduationCap },
          { name: "Support", href: "#support", icon: LifeBuoy },
        ];
    }
  };

  const navigationItems = getNavigationItems(currentRole);

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto border-r border-gray-200 mt-16">
          {/* Logo at the top of sidebar */}
          <div className="flex justify-center px-4 pb-4 border-b border-gray-200">
            <img 
              src="/attached_assets/WhatsApp_Image_2025-04-05_at_4.01.16_PM-removebg-preview-1_1750423087098.webp" 
              alt="Osmosis Portal" 
              className="h-10 w-auto"
            />
          </div>
          
          <div className="flex items-center flex-shrink-0 px-4 mt-4">
            <div className="w-full">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="text-sm font-medium text-gray-900">
                  {getRoleDisplay(currentRole)}
                </div>
                <div className="text-xs text-gray-500">
                  {user.email}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer",
                      item.current
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.hash = item.href.substring(1);
                    }}
                  >
                    <Icon className="mr-3 flex-shrink-0 h-4 w-4" />
                    {item.name}
                    {item.badge && (
                      <Badge className="ml-auto bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </Badge>
                    )}
                  </a>
                );
              })}
            </nav>
            
            {/* Role Switcher */}
            <div className="px-2 pb-4">
              <div className="border-t border-gray-200 pt-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm text-gray-600 hover:bg-gray-50 rounded-md"
                  onClick={onRoleSwitchClick}
                >
                  <UserCog className="mr-2 h-4 w-4" />
                  Switch Role
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
