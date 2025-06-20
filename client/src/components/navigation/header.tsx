import { Bell, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { User } from "@shared/schema";

interface HeaderProps {
  user: User;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ user, sidebarOpen, setSidebarOpen }: HeaderProps) {
  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 right-0 left-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden mr-2"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">Osmosis Portal</h1>
            </div>
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              <a href="#dashboard" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </a>
              <a href="#universities" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Universities
              </a>
              <a href="#applications" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Applications
              </a>
              <a href="#documents" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Documents
              </a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5 text-gray-400" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white text-right pl-[10px] pr-[10px]">
                  3
                </Badge>
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-700 hidden sm:block">
                {user.firstName} {user.lastName}
              </span>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.profileImageUrl || undefined} />
                <AvatarFallback className="bg-blue-600 text-white text-sm">
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = '/api/logout'}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
