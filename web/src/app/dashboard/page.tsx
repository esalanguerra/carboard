"use client";

import LayoutDefault from "@/src/components/layout/default";
import { useGetCars } from "../cars/hooks/useGetCars";
import CarCard from "../cars/components/car-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Footer from "@/src/components/layout/footer";

export default function Page() {
  const { cars, error, loading } = useGetCars();

  return (
    <LayoutDefault>
      <section className="py-16 px-4">
        <div className="relative flex-1 group">
          <h2 className="text-3xl font-bold text-center mb-8">
            Adicionados Recentemente
          </h2>
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
          <Link href="/cars">
            <Button variant="outline">Ver Mais</Button>
          </Link>
        </div>
      </section>
      <Footer />
    </LayoutDefault>
  );
}
