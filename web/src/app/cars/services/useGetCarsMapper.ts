import type { CarInterface, CarInterfaceResponse } from "@/src/interfaces/CarInterface";

export function useGetCarsMapper(car: CarInterfaceResponse): CarInterface {
  return {
    name: car.nome,
    id: car.ID,
    licensePlate: car.placa,
    seller: car.vendedor,
    price: car.preco,
    date: car.data,
    condition: car.condicao,
    contact: car.contato,
    mileage: car.quilometragem,
    year: parseInt(car.ano, 10),
    engine: car.motor,
    transmission: car.cambio,
    owners: car.proprietarios,
    inspected: car.Inspecionado,
    drivetrain: car.sistema_de_transmissao,
    specifications: car.especificacoes,
    safety: car.seguranca,
    interiorComforts: car.interior_comodidades,
    electronics: car.eletronica,
    additionalInformation: car.informacoes_adicionais,
    others: car.outros,
    image: car.imagem,
  };
}
