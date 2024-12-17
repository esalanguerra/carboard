"use client";

import { Button } from "@/components/ui/button";
import CarCard from "./car-card";
import { useGetCarsPagination } from "../hooks/useGetCarsPagination";

export default function SectionCars() {
  const { cars, error, currentPage, totalPages, loading, changePage } =
    useGetCarsPagination(12);

  return (
    <section className="py-16 px-4">
      <div className="relative flex-1 group">
        {error && <p className="text-red-500">{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : cars.length === 0 ? (
          <p>No cars found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car, index) => (
              <CarCard key={index} car={car} />
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-center mt-6">
        <Button
          variant="outline"
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="mr-2"
        >
          Previous
        </Button>
        <span className="text-lg">
          {currentPage} / {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="ml-2"
        >
          Next
        </Button>
      </div>
    </section>
  );
}
