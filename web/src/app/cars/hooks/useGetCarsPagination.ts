/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { CarInterfaceResponse } from "@/src/interfaces/CarInterface";
import { CarInterface } from "@/src/interfaces/CarInterface";
import { useGetCarsMapper } from "../services/useGetCarsMapper";

export function useGetCarsPagination(itemsPerPage: number) {
  const [cars, setCars] = useState<CarInterface[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const response = await apiRequest({ method: "GET", url: "/carros" });

        const mappedCars = response.map((car: CarInterfaceResponse) =>
          useGetCarsMapper(car)
        );

        setCars(mappedCars);
      } catch (err) {
        console.error("Error fetching cars:", err);
        setError("Error loading cars. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const totalPages = Math.ceil(cars.length / itemsPerPage);

  const paginatedCars = cars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    cars: paginatedCars,
    error,
    currentPage,
    totalPages,
    loading,
    changePage,
  };
}
