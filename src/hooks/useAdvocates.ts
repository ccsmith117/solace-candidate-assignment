import { useEffect, useState } from "react";
import { SortingState } from "@tanstack/react-table";

interface Advocate {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: string;
}

interface UseAdvocatesParams {
  currentPage: number;
  pageSize: number;
  searchFilter: string;
  sorting: SortingState;
}

interface UseAdvocatesReturn {
  advocates: Advocate[];
  totalItems: number;
  isLoading: boolean;
  error: string | null;
}

export function useAdvocates({
  currentPage,
  pageSize,
  searchFilter,
  sorting,
}: UseAdvocatesParams): UseAdvocatesReturn {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract sorting values for stable dependencies
  const sortField = sorting.length > 0 ? sorting[0].id : null;
  const sortOrder = sorting.length > 0 ? sorting[0].desc : null;

  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchAdvocates = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          pageSize: pageSize.toString(),
          search: searchFilter,
        });

        if (sorting.length > 0) {
          params.append("sortBy", sorting[0].id);
          params.append("sortOrder", sorting[0].desc ? "desc" : "asc");
        }

        const response = await fetch(`/api/advocates?${params.toString()}`, {
          signal: abortController.signal,
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const jsonResponse = await response.json();
        
        setAdvocates(jsonResponse.data);
        setTotalItems(jsonResponse.totalItems);
        setIsLoading(false);
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error("Failed to fetch advocates:", error);
          setError("Something went wrong - please refresh your page and try again.");
          setIsLoading(false);
        }
      }
    };

    fetchAdvocates();

    return () => abortController.abort();
  }, [currentPage, pageSize, searchFilter, sortField, sortOrder]);

  return {
    advocates,
    totalItems,
    isLoading,
    error,
  };
}

