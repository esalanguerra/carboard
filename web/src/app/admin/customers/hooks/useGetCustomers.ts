/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useEffect, useState } from "react";
import { serverRequest } from "@/lib/api";
import { CustomerInterface } from "@/src/interfaces/CustomerInterface";

export function useGetCustomers() {
  const [customers, setCustomers] = useState<CustomerInterface[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await serverRequest({ method: "GET", url: "/customers" });

        setCustomers(response);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError("Error loading customers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return { customers, error, loading };
}
