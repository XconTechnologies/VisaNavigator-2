import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Calendar,
  File
} from "lucide-react";
import DocumentUploadModal from "../modals/document-upload-modal";

export default function DocumentManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: documents, isLoading } = useQuery({
    queryKey: ["/api/documents"],
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/documents/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Success",
        description: "Document deleted successfully",
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
        description: "Failed to delete document",
        variant: "destructive",
      });
    },
  });

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case "passport":
        return "Passport";
      case "academic_transcripts":
        return "Academic Transcripts";
      case "ielts_toefl":
        return "IELTS/TOEFL Score";
      case "statement_of_purpose":
        return "Statement of Purpose";
      case "recommendation_letter":
        return "Recommendation Letter";
      case "cv_resume":
        return "CV/Resume";
      case "financial_documents":
        return "Financial Documents";
      case "other":
        return "Other";
      default:
        return "Unknown";
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType?.includes("pdf")) {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else if (mimeType?.includes("image")) {
      return <File className="h-5 w-5 text-green-500" />;
    }
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredDocuments = documents?.filter((doc: any) => 
    typeFilter === "all" || doc.documentType === typeFilter
  ) || [];

  const documentTypes = [
    { value: "all", label: "All Documents" },
    { value: "passport", label: "Passport" },
    { value: "academic_transcripts", label: "Academic Transcripts" },
    { value: "ielts_toefl", label: "IELTS/TOEFL Score" },
    { value: "statement_of_purpose", label: "Statement of Purpose" },
    { value: "recommendation_letter", label: "Recommendation Letters" },
    { value: "cv_resume", label: "CV/Resume" },
    { value: "financial_documents", label: "Financial Documents" },
    { value: "other", label: "Other" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Document Manager</h2>
        <div className="flex items-center space-x-3">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={() => setUploadModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-500 text-center mb-6">
              {typeFilter === "all" 
                ? "You haven't uploaded any documents yet. Upload your first document to get started."
                : `No documents of type "${getDocumentTypeLabel(typeFilter)}" found.`
              }
            </p>
            <Button 
              onClick={() => setUploadModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((document: any) => (
            <Card key={document.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getFileIcon(document.mimeType)}
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-medium line-clamp-1">
                        {document.fileName}
                      </CardTitle>
                      <p className="text-xs text-gray-500">
                        {getDocumentTypeLabel(document.documentType)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {document.isVerified ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Size:</span>
                    <span className="font-medium">
                      {document.fileSize ? formatFileSize(document.fileSize) : "Unknown"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Status:</span>
                    <Badge variant={document.isVerified ? "default" : "secondary"}>
                      {document.isVerified ? "Verified" : "Pending"}
                    </Badge>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(document.createdAt).toLocaleDateString()}
                  </div>

                  {document.expiryDate && (
                    <div className="text-sm">
                      <span className="text-gray-500">Expires:</span>
                      <span className={`ml-1 font-medium ${
                        new Date(document.expiryDate) < new Date() 
                          ? "text-red-600" 
                          : "text-gray-900"
                      }`}>
                        {new Date(document.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => deleteDocumentMutation.mutate(document.id)}
                      disabled={deleteDocumentMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <DocumentUploadModal 
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
      />
    </div>
  );
}
