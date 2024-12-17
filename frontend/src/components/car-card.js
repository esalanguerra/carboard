"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import {
  Car as CarIcon,
  Clock
} from 'lucide-react';

export default function CarCard({ car }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);

  const handleBackdropClick = (e) => {
    if (e.target.id === 'modal-backdrop') {
      closeModal();
    }
  };

  return (
    <Card className="w-full max-w-sm border border-gray-200 shadow-md hover:shadow-lg transition duration-300 ease-in-out mx-auto">
      <div className="relative group">
        <Image
          src={car.imagem}
          alt={car.nome}
          width={400}
          height={250}
          className="w-full h-60 object-cover rounded-t-md"
        />
      </div>
      <CardContent>
        <h3 className="text-lg font-semibold">{car.nome}</h3>
        <p className="text-sm text-gray-500">{car.placa}</p>
        <div className="flex justify-center mt-2">
          <Badge className="bg-blue-500 text-white">{car.ano.slice(0, 4)}</Badge>
        </div>
        <div className="flex justify-between mt-4">
          <div className="flex items-center space-x-2">
            <CarIcon className="w-5 h-5 text-gray-700" />
            <span className="text-sm">{car.cambio}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gray-700" />
            <span className="text-sm">{car.data}</span>
          </div>
        </div>
        <div className="mt-3">
          <span className="block text-lg font-semibold">{car.preco}</span>
          <Button
            variant="solid"
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
            <div className="flex flex-col sm:flex-row">
              {/* Imagem do Carro */}
              <div className="w-full sm:w-1/3 p-4">
                <Image
                  src={car.imagem}
                  alt={car.nome}
                  width={300}
                  height={200}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
              {/* Informações do Carro */}
              <div className="w-full sm:w-2/3 p-4 space-y-4">
                <h2 className="text-2xl font-semibold mb-4 text-center sm:text-left">{car.nome}</h2>
                <div className="space-y-2">
                  <p><strong>Vendedor:</strong> {car.vendedor}</p>
                  <p><strong>Contato:</strong> {car.contato}</p>
                  <p><strong>Motor:</strong> {car.motor}</p>
                  <p><strong>Transmissão:</strong> {car.sistema_de_transmissao}</p>
                  <p><strong>Segurança:</strong> {car.seguranca}</p>
                  <p><strong>Comodidades Internas:</strong> {car.interior_comodidades}</p>
                  <p><strong>Eletrônicos:</strong> {car.eletronica}</p>
                  <p><strong>Informações Adicionais:</strong> {car.informacoes_adicionais}</p>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" onClick={closeModal}>
                    Fechar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
