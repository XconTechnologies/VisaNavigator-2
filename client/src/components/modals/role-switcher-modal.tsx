import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { GraduationCap, Users, Building, Settings } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

interface RoleSwitcherModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRole: string;
  onRoleChange: (role: string) => void;
}

export default function RoleSwitcherModal({ 
  open, 
  onOpenChange, 
  currentRole, 
  onRoleChange 
}: RoleSwitcherModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const switchRoleMutation = useMutation({
    mutationFn: async (role: string) => {
      await apiRequest("POST", "/api/switch-role", { role });
    },
    onSuccess: (_, role) => {
      onRoleChange(role);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      onOpenChange(false);
      toast({
        title: "Role switched",
        description: `Successfully switched to ${role} dashboard`,
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
        description: "Failed to switch role. Please try again.",
        variant: "destructive",
      });
    },
  });

  const roles = [
    {
      id: "student",
      name: "Student Dashboard",
      description: "Manage applications and university search",
      icon: GraduationCap,
      color: "bg-blue-600",
    },
    {
      id: "agent",
      name: "Agent Dashboard", 
      description: "Lead management and commission tracking",
      icon: Users,
      color: "bg-emerald-600",
    },
    {
      id: "university",
      name: "University Dashboard",
      description: "Manage applications and course information",
      icon: Building,
      color: "bg-amber-500",
    },
    {
      id: "admin",
      name: "Admin Dashboard",
      description: "System management and analytics",
      icon: Settings,
      color: "bg-purple-500",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Switch Dashboard Role</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Button
                key={role.id}
                variant="outline"
                className="w-full flex items-center p-3 h-auto justify-start hover:bg-gray-50"
                onClick={() => switchRoleMutation.mutate(role.id)}
                disabled={switchRoleMutation.isPending || currentRole === role.id}
              >
                <div className={`w-10 h-10 ${role.color} rounded-full flex items-center justify-center mr-3`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">{role.name}</div>
                  <div className="text-sm text-gray-500">{role.description}</div>
                </div>
                {currentRole === role.id && (
                  <div className="ml-auto text-xs text-blue-600 font-medium">Current</div>
                )}
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
