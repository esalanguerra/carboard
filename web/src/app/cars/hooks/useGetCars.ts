/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { CarInterfaceResponse } from "@/src/interfaces/CarInterface";
import { CarInterface } from "@/src/interfaces/CarInterface";
import { useGetCarsMapper } from "../services/useGetCarsMapper";

export function useGetCars() {
  const [cars, setCars] = useState<CarInterface[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const response = await apiRequest({ method: "GET", url: "/carros" });

        const mappedCars = response.map((car: CarInterfaceResponse) =>
          useGetCarsMapper(car),
        );

        setCars(mappedCars.slice(0, 3));
      } catch (err) {
        console.error("Error fetching cars:", err);
        setError("Error loading cars. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  return { cars, error, loading };
}
