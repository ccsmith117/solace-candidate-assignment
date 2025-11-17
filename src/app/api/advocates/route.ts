import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const sortOrder = searchParams.get("sortOrder") || "asc";

  let data = [...advocateData];

  if (search) {
    const searchLower = search.toLowerCase();
    data = data.filter((advocate) => {
      const firstNameMatch = advocate.firstName.toLowerCase().includes(searchLower);
      const lastNameMatch = advocate.lastName.toLowerCase().includes(searchLower);
      const cityMatch = advocate.city.toLowerCase().includes(searchLower);
      const degreeMatch = advocate.degree.toLowerCase().includes(searchLower);
      const specialtiesMatch = advocate.specialties.some((specialty: string) =>
        specialty.toLowerCase().includes(searchLower)
      );
      const yearsMatch = advocate.yearsOfExperience.toString().includes(searchLower);
      const phoneMatch = advocate.phoneNumber.toString().includes(searchLower);

      return (
        firstNameMatch ||
        lastNameMatch ||
        cityMatch ||
        degreeMatch ||
        specialtiesMatch ||
        yearsMatch ||
        phoneMatch
      );
    });
  }

  if (sortBy) {
    data.sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a];
      let bValue: any = b[sortBy as keyof typeof b];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);

  return Response.json({
    data: paginatedData,
    totalItems,
    totalPages,
    currentPage: page,
    pageSize,
  });
}
