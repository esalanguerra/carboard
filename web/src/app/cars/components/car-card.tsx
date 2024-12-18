'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, MouseEvent } from "react";
import { Car as CarIcon, Clock } from "lucide-react";
import type { CarInterface } from "@/src/interfaces/CarInterface";
import CarDetailsModal from "./car-details-modal";

interface CarCardProps {
  car: CarInterface;
}

export default function CarCard({ car }: CarCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLDivElement && e.target.id === "modal-backdrop") {
      closeModal();
    }
  };

  return (
    <Card className="w-full max-w-sm border border-gray-200 shadow-md hover:shadow-lg transition duration-300 ease-in-out mx-auto">
      <div className="relative group">
        <Image
          src={car.image}
          alt={car.name}
          width={400}
          height={250}
          className="w-full h-60 object-cover rounded-t-md"
        />
      </div>
      <CardContent>
        <h3 className="text-lg font-semibold">{car.name}</h3>
        <p className="text-sm text-gray-500">{car.plate}</p>
        <div className="flex justify-center mt-2">
          <Badge className="bg-blue-500 text-white">{car.year}</Badge>
        </div>
        <div className="flex justify-between mt-4">
          <div className="flex items-center space-x-2">
            <CarIcon className="w-5 h-5 text-gray-700" />
            <span className="text-sm">{car.transmission}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gray-700" />
            <span className="text-sm">{car.year}</span>
          </div>
        </div>
        <div className="mt-3">
          <span className="block text-lg font-semibold">{car.price}</span>
          <Button
            size="lg"
            className="mt-4 w-full py-3 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg shadow-md"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="font-semibold">Ver Detalhes</span>
          </Button>
        </div>
      </CardContent>

      {isModalOpen && (
        <div
          id="modal-backdrop"
          className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 transition-opacity duration-300"
          onClick={handleBackdropClick}
        >
          <div className="bg-white p-6 rounded-md w-11/12 sm:w-96 max-w-4xl max-h-[90vh] overflow-auto transition-transform transform scale-100 opacity-100 animate-modal">
            <CarDetailsModal
              car={car}  // Passar o carro para o modal
              isOpen={isModalOpen}
              onClose={closeModal}  // Passar a função de fechar o modal
            />
          </div>
        </div>
      )}
    </Card>
  );
}
