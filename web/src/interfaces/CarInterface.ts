export interface CarInterfaceResponse {
  _id?: string;
  id_car: string;
  name: string;
  owner: string;
  price: string;
  status: string;
  condition: string;
  mileage: string;
  year: number;
  engine: string;
  transmission: string;
  owners: string;
  inspected: string;
  plate: string;
  specifications: string;
  safety: string;
  interior: string;
  electronics: string;
  additional_information: string;
  others: string;
  image: string;
  link: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CarInterface extends CarInterfaceResponse {
  id: string;
}
