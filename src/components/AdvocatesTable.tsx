import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";
import { useMemo } from "react";
import SpecialtiesCell from "./SpecialtiesCell";
import TableLoadingState from "./TableLoadingState";
import EmptyState from "./EmptyState";

interface Advocate {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: string;
}

interface AdvocatesTableProps {
  advocates: Advocate[];
  sorting: SortingState;
  onSortingChange: (updater: SortingState | ((old: SortingState) => SortingState)) => void;
  isLoading: boolean;
}

const columnHelper = createColumnHelper<Advocate>();

export default function AdvocatesTable({ 
  advocates, 
  sorting, 
  onSortingChange, 
  isLoading
}: AdvocatesTableProps) {
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
        cell: (info) => <SpecialtiesCell specialties={info.getValue()} />,
        enableSorting: false,
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
      sorting,
    },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
  });

  return (
    <div className="shadow-lg rounded-lg overflow-hidden animate-fadeIn">
      <table className="w-full border-collapse min-w-[768px] table-fixed bg-[rgb(233,240,238)]">
        <thead className="bg-[#1d443a]">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const widthClass = 
                  header.id === 'firstName' ? 'w-[12%]' : 
                  header.id === 'lastName' ? 'w-[12%]' : 
                  header.id === 'city' ? 'w-[10%]' : 
                  header.id === 'degree' ? 'w-[7%]' : 
                  header.id === 'specialties' ? 'w-[34%]' : 
                  header.id === 'yearsOfExperience' ? 'w-[10%]' : 
                  header.id === 'phoneNumber' ? 'w-[15%]' : 'w-auto';
                
                return (
                  <th
                    key={header.id}
                    className={`text-left p-4 font-bold border-b-2 border-gray-600 text-white break-words ${widthClass}`}
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
          {isLoading ? (
            <TableLoadingState />
          ) : table.getRowModel().rows.length === 0 ? (
            <EmptyState />
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-200 hover:bg-white/50 transition-colors animate-fadeIn"
              >
                {row.getVisibleCells().map((cell) => {
                  const widthClass = 
                    cell.column.id === 'firstName' ? 'w-[12%]' : 
                    cell.column.id === 'lastName' ? 'w-[12%]' : 
                    cell.column.id === 'city' ? 'w-[10%]' : 
                    cell.column.id === 'degree' ? 'w-[7%]' : 
                    cell.column.id === 'specialties' ? 'w-[34%]' : 
                    cell.column.id === 'yearsOfExperience' ? 'w-[10%]' : 
                    cell.column.id === 'phoneNumber' ? 'w-[15%]' : 'w-auto';
                  
                  return (
                    <td
                      key={cell.id}
                      className={`text-left p-4 break-words ${widthClass}`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

