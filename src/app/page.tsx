"use client";

import { useEffect, useState, useRef } from "react";

interface Advocate {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: string;
}

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    debounceTimeout.current = setTimeout(() => {
      const filtered = filterAdvocates(advocates, searchTerm);
      setFilteredAdvocates(filtered);
    }, 500);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchTerm, advocates]);

  const filterAdvocates = (
    advocatesList: Advocate[],
    searchTerm: string
  ): Advocate[] => {
    console.log('filtering')
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return advocatesList;
    }

    const containsSearch = (value: string | number) => {
      if (value == null) return false;
      return String(value).toLowerCase().includes(search);
    };

    return advocatesList.filter((advocate) => {
      const matchesSpecialties =
        advocate.specialties?.some((specialty) =>
          specialty.toLowerCase().includes(search)
        ) ?? false;

      return (
        containsSearch(advocate.firstName) ||
        containsSearch(advocate.lastName) ||
        containsSearch(advocate.city) ||
        containsSearch(advocate.degree) ||
        containsSearch(advocate.yearsOfExperience) ||
        containsSearch(advocate.phoneNumber) ||
        matchesSpecialties
      );
    });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.length > 0) {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
        debounceTimeout.current = null;
      }
      const filtered = filterAdvocates(advocates, searchTerm);
      setFilteredAdvocates(filtered);
    }
  };

  const onReset = () => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-6">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-5xl text-[#1d443a] mb-2">Solace Advocates</h1>
        <p className="text-gray-600">Find the right healthcare advocate for your needs</p>
      </div>
      
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <label className="block text-lg font-bold text-[#1d443a] mb-3">Search Advocates</label>
        <div className="flex gap-3">
          <input
            className="flex-1 border-2 border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-[#1d443a] transition-colors duration-200 ease-in-out"
            value={searchTerm}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder="Search by name, city, degree, specialties..."
          />
          <button 
            onClick={onReset} 
            className="rounded-md px-6 py-2 border-2 border-[#1d443a] text-[#1d443a] font-semibold hover:bg-[#1d443a] hover:text-white transition-colors whitespace-nowrap"
          >
            Clear Search
          </button>
        </div>
      </div>
      
      {filteredAdvocates.length === 0 ? (
        <div className="bg-white shadow-lg rounded-lg p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No advocates found</h3>
          <p className="text-gray-500 mb-4">We couldn't find any advocates matching your search criteria.</p>
          <button 
            onClick={onReset}
            className="rounded-md px-6 py-2 bg-[#1d443a] text-white font-semibold hover:bg-[#152f28] transition-colors"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <table className="w-full shadow-lg rounded-lg overflow-hidden border-collapse min-w-[768px] bg-[linear-gradient(rgba(233,240,238,0.35),rgb(233,240,238)_33%,rgb(233,240,238))]">
          <thead className="bg-[#1d443a]">
            <tr>
              <th className="text-left p-4 font-bold border-b-2 border-gray-600 text-white w-[12%]">First Name</th>
              <th className="text-left p-4 font-bold border-b-2 border-gray-600 text-white w-[12%]">Last Name</th>
              <th className="text-left p-4 font-bold border-b-2 border-gray-600 text-white w-[10%]">City</th>
              <th className="text-left p-4 font-bold border-b-2 border-gray-600 text-white w-[10%]">Degree</th>
              <th className="text-left p-4 font-bold border-b-2 border-gray-600 text-white w-[26%]">Specialties</th>
              <th className="text-left p-4 font-bold border-b-2 border-gray-600 text-white w-[15%]">Years of Experience</th>
              <th className="text-left p-4 font-bold border-b-2 border-gray-600 text-white w-[15%]">Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdvocates.map((advocate) => {
              const uniqueKey = `${advocate.phoneNumber}-${advocate.lastName}`;
              return (
                <tr key={uniqueKey} className="border-b border-gray-200 hover:bg-white/50 transition-colors">
                  <td className="text-left p-4 w-[12%]">{advocate.firstName}</td>
                  <td className="text-left p-4 w-[12%]">{advocate.lastName}</td>
                  <td className="text-left p-4 w-[10%]">{advocate.city}</td>
                  <td className="text-left p-4 w-[10%]">{advocate.degree}</td>
                  <td className="text-left p-4 w-[26%]">
                    <div className="flex flex-wrap gap-2">
                      {advocate.specialties.map((specialty, idx) => (
                        <span key={`${uniqueKey}-specialty-${idx}`} className="px-3 py-1 rounded-full text-sm whitespace-nowrap bg-[rgb(213,228,225)] text-[#1d443a]">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="text-left p-4 w-[15%]">{advocate.yearsOfExperience}</td>
                  <td className="text-left p-4 w-[15%]">{advocate.phoneNumber}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
}
