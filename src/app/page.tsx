"use client";

import { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";

interface Advocate {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: string;
}

const columnHelper = createColumnHelper<Advocate>();

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const columns = useMemo<ColumnDef<Advocate, any>[]>(
    () => [
      columnHelper.accessor("firstName", {
        header: "First Name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("lastName", {
        header: "Last Name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("city", {
        header: "City",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("degree", {
        header: "Degree",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("specialties", {
        header: "Specialties",
        cell: (info) => {
          const specialties = info.getValue();
          const uniqueKey = `${info.row.original.phoneNumber}-${info.row.original.lastName}`;
          return (
            <div className="flex flex-wrap gap-2">
              {specialties.map((specialty: string, idx: number) => (
                <span
                  key={`${uniqueKey}-specialty-${idx}`}
                  className="px-3 py-1 rounded-full text-sm whitespace-nowrap bg-[rgb(213,228,225)] text-[#1d443a]"
                >
                  {specialty}
                </span>
              ))}
            </div>
          );
        },
        enableSorting: false,
        filterFn: (row, columnId, filterValue) => {
          const specialties = row.getValue(columnId) as string[];
          return specialties.some((specialty) =>
            specialty.toLowerCase().includes(filterValue.toLowerCase())
          );
        },
      }),
      columnHelper.accessor("yearsOfExperience", {
        header: "Years of Experience",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("phoneNumber", {
        header: "Phone Number",
        cell: (info) => info.getValue(),
        enableSorting: false,
      }),
    ],
    []
  );

  const table = useReactTable({
    data: advocates,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const search = String(filterValue).toLowerCase();
      const value = row.getValue(columnId);

      if (Array.isArray(value)) {
        return value.some((item) =>
          String(item).toLowerCase().includes(search)
        );
      }

      return String(value).toLowerCase().includes(search);
    },
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(e.target.value);
  };

  const onReset = () => {
    setGlobalFilter("");
    setSorting([]);
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
            value={globalFilter ?? ""}
            onChange={onChange}
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
      
      {table.getRowModel().rows.length === 0 ? (
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
        <div className="shadow-lg rounded-lg overflow-hidden">
          <table className="w-full border-collapse min-w-[768px] bg-[linear-gradient(rgba(233,240,238,0.35),rgb(233,240,238)_33%,rgb(233,240,238))]">
            <thead className="bg-[#1d443a]">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const widthClass = 
                      header.id === 'firstName' ? 'w-[12%]' : 
                      header.id === 'lastName' ? 'w-[12%]' : 
                      header.id === 'city' ? 'w-[10%]' : 
                      header.id === 'degree' ? 'w-[10%]' : 
                      header.id === 'specialties' ? 'w-[26%]' : 
                      header.id === 'yearsOfExperience' ? 'w-[15%]' : 
                      header.id === 'phoneNumber' ? 'w-[15%]' : 'w-auto';
                    
                    return (
                    <th
                      key={header.id}
                      className={`text-left p-4 font-bold border-b-2 border-gray-600 text-white ${widthClass}`}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? "cursor-pointer select-none flex items-center gap-2"
                              : ""
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <span className="text-xs">
                              {{
                                asc: "↑",
                                desc: "↓",
                              }[header.column.getIsSorted() as string] ?? "⇅"}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-200 hover:bg-white/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => {
                    const widthClass = 
                      cell.column.id === 'firstName' ? 'w-[12%]' : 
                      cell.column.id === 'lastName' ? 'w-[12%]' : 
                      cell.column.id === 'city' ? 'w-[10%]' : 
                      cell.column.id === 'degree' ? 'w-[10%]' : 
                      cell.column.id === 'specialties' ? 'w-[26%]' : 
                      cell.column.id === 'yearsOfExperience' ? 'w-[15%]' : 
                      cell.column.id === 'phoneNumber' ? 'w-[15%]' : 'w-auto';
                    
                    return (
                    <td
                      key={cell.id}
                      className={`text-left p-4 ${widthClass}`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
