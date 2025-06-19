import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, GraduationCap, DollarSign, Globe } from "lucide-react";

export default function UniversitySearch() {
  const [filters, setFilters] = useState({
    country: "",
    field: "",
    budgetMin: "",
    budgetMax: "",
  });

  const { data: universities, isLoading, refetch } = useQuery({
    queryKey: ["/api/universities/search", filters],
    enabled: false, // Only search when button is clicked
  });

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (filters.country) searchParams.append("country", filters.country);
    if (filters.field) searchParams.append("field", filters.field);
    if (filters.budgetMin) searchParams.append("budgetMin", filters.budgetMin);
    if (filters.budgetMax) searchParams.append("budgetMax", filters.budgetMax);
    
    refetch();
  };

  const countries = [
    "Canada",
    "United Kingdom", 
    "Australia",
    "United States",
    "Germany",
    "France",
    "Netherlands",
    "Sweden",
    "Ireland",
    "New Zealand"
  ];

  const fields = [
    "Computer Science",
    "Business Administration",
    "Engineering",
    "Medicine",
    "Data Science",
    "Psychology",
    "Economics",
    "Law",
    "Arts & Humanities",
    "Environmental Science"
  ];

  const budgetRanges = [
    { label: "$10,000 - $20,000", min: "10000", max: "20000" },
    { label: "$20,000 - $30,000", min: "20000", max: "30000" },
    { label: "$30,000 - $50,000", min: "30000", max: "50000" },
    { label: "$50,000+", min: "50000", max: "" },
  ];

  return (
    <div className="space-y-6">
      {/* Search Filters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <Select value={filters.country} onValueChange={(value) => setFilters({ ...filters, country: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Field of Study
          </label>
          <Select value={filters.field} onValueChange={(value) => setFilters({ ...filters, field: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select Field" />
            </SelectTrigger>
            <SelectContent>
              {fields.map((field) => (
                <SelectItem key={field} value={field}>
                  {field}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget Range
          </label>
          <Select 
            value={filters.budgetMin && filters.budgetMax ? `${filters.budgetMin}-${filters.budgetMax}` : ""}
            onValueChange={(value) => {
              const range = budgetRanges.find(r => `${r.min}-${r.max}` === value);
              if (range) {
                setFilters({ 
                  ...filters, 
                  budgetMin: range.min, 
                  budgetMax: range.max 
                });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Budget" />
            </SelectTrigger>
            <SelectContent>
              {budgetRanges.map((range) => (
                <SelectItem key={`${range.min}-${range.max}`} value={`${range.min}-${range.max}`}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <Select defaultValue="english">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="german">German</SelectItem>
              <SelectItem value="french">French</SelectItem>
              <SelectItem value="spanish">Spanish</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        onClick={handleSearch}
        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
        disabled={isLoading}
      >
        <Search className="mr-2 h-4 w-4" />
        {isLoading ? "Searching..." : "Search Universities"}
      </Button>

      {/* Search Results */}
      {universities && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Search Results ({universities.length} found)
            </h3>
          </div>

          {universities.length === 0 ? (
            <div className="text-center py-8">
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No universities found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search criteria to find more results.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {universities.map((university: any) => (
                <Card key={university.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{university.universityName}</CardTitle>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {university.city}, {university.country}
                        </div>
                      </div>
                      {university.ranking && (
                        <Badge variant="secondary">
                          Rank #{university.ranking}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {university.description || "Leading institution offering world-class education and research opportunities."}
                      </p>
                      
                      {university.programs && university.programs.length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-2">
                            Available Programs:
                          </div>
                          <div className="space-y-2">
                            {university.programs.slice(0, 2).map((program: any) => (
                              <div key={program.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div>
                                  <div className="text-sm font-medium">{program.programName}</div>
                                  <div className="text-xs text-gray-500">
                                    {program.degree} • {program.duration} months
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-medium">
                                    ${program.tuitionFee?.toLocaleString()}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {program.currency || "USD"}
                                  </div>
                                </div>
                              </div>
                            ))}
                            {university.programs.length > 2 && (
                              <div className="text-sm text-blue-600 font-medium">
                                +{university.programs.length - 2} more programs
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <GraduationCap className="h-4 w-4 mr-1" />
                            {university.programs?.length || 0} Programs
                          </div>
                          {university.website && (
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 mr-1" />
                              Website
                            </div>
                          )}
                        </div>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
