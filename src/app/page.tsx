"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filtered = filterAdvocates(advocates, searchTerm);
      setFilteredAdvocates(filtered);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, advocates]);

  const filterAdvocates = (
    advocatesList: Advocate[],
    searchTerm: string
  ): Advocate[] => {
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

  const onReset = () => {
    setSearchTerm("");
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <input
          style={{ border: "1px solid black" }}
          value={searchTerm}
          onChange={onChange}
          placeholder="Type to search..."
        />
        <button onClick={onReset}>Clear Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate) => {
            const uniqueKey = `${advocate.phoneNumber}-${advocate.lastName}`;
            return (
              <tr key={uniqueKey}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((specialty, idx) => (
                    <div key={`${uniqueKey}-specialty-${idx}`}>{specialty}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
