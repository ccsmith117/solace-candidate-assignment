"use client";

import { useState, useEffect, useCallback } from "react";
import { SortingState } from "@tanstack/react-table";
import Pagination from "@/components/Pagination";
import LoadingSpinner from "@/components/LoadingSpinner";
import SearchBar from "@/components/SearchBar";
import AdvocatesTable from "@/components/AdvocatesTable";
import ErrorState from "@/components/ErrorState";
import { useAdvocates } from "@/hooks/useAdvocates";

export default function Home() {
  const [searchFilter, setSearchFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const { advocates, totalItems, isLoading, error } = useAdvocates({
    currentPage,
    pageSize,
    searchFilter,
    sorting,
  });

  useEffect(() => {
    if (!isLoading && !hasInitiallyLoaded) {
      setHasInitiallyLoaded(true);
    }
  }, [isLoading, hasInitiallyLoaded]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isLoading) {
      timer = setTimeout(() => setShowLoading(true), 300);
    } else {
      setShowLoading(false);
    }
    
    return () => clearTimeout(timer);
  }, [isLoading]);

  const handleSearch = useCallback((value: string) => {
    setSearchFilter(value);
    setCurrentPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setSearchFilter("");
    setSorting([]);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  }, []);

  const handleSortingChange = useCallback((updater: SortingState | ((old: SortingState) => SortingState)) => {
    setSorting(updater);
  }, []);

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <main className="max-w-7xl mx-auto px-6 py-6">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-5xl text-[#1d443a] mb-2">Solace Advocates</h1>
        <p className="text-gray-600">Find the right healthcare advocate for your needs</p>
      </div>
      
      <SearchBar 
        onSearch={handleSearch}
        onReset={handleReset}
      />
      
      {!hasInitiallyLoaded ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <>
          <AdvocatesTable 
            advocates={advocates}
            sorting={sorting}
            onSortingChange={handleSortingChange}
            isLoading={showLoading}
          />
          
          {totalItems > 0 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
                totalItems={totalItems}
              />
            </div>
          )}
        </>
      )}
    </main>
  );
}
