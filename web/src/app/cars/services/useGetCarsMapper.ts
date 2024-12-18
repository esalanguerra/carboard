import type { CarInterface, CarInterfaceResponse } from '@/src/interfaces/CarInterface';

export function useGetCarsMapper(car: CarInterfaceResponse): CarInterface {
  return {
    id: car._id || '',
    id_car: car.id_car,
    name: car.name,
    owner: car.owner,
    price: car.price,
    additional_information: car.additional_information,
    condition: car.condition,
    createdAt: car.createdAt,
    electronics: car.electronics,
    engine: car.engine,
    image: car.image,
    inspected: car.inspected,
    interior: car.interior,
    link: car.link,
    mileage: car.mileage,
    others: car.others,
    owners: car.owners,
    plate: car.plate,
    safety: car.safety,
    specifications: car.specifications,
    status: car.status,
    transmission: car.transmission,
    updatedAt: car.updatedAt,
    year: car.year,
  };
}
