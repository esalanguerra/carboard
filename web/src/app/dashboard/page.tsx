"use client";

import LayoutDefault from "@/src/components/layout/default";
import { useGetCars } from "../cars/hooks/useGetCars";
import CarCard from "../cars/components/car-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Footer from "@/src/components/partials/footer";

export default function Page() {
  const { cars, error, loading } = useGetCars();

  return (
    <LayoutDefault>
      <section className="py-16 px-4">
        <div className="relative flex-1 group">
          <h2 className="text-3xl font-bold text-center mb-8 animateanimated animatefadeIn">
            Adicionados Recentemente
          </h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {loading ? (
            <p className="text-center animateanimated animatefadeIn">Carregando...</p>
          ) : cars.length === 0 ? (
            <p className="text-center animateanimated animatefadeIn">Nenhum carro encontrado.</p>
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
            <Button variant="outline" className="transition duration-300 ease-in-out hover:bg-gray-200">
              Ver Mais
            </Button>
          </Link>
        </div>
      </section>
      <Footer />
    </LayoutDefault>
  );
}
