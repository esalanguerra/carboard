export interface CarInterfaceResponse {
  nome: string;
  ID: string;
  placa: string;
  vendedor: string;
  preco: string;
  data: string;
  condicao: string;
  contato: string;
  quilometragem: string;
  ano: string;
  motor: string;
  cambio: string;
  proprietarios: string;
  Inspecionado: string;
  sistema_de_transmissao: string;
  especificacoes: string;
  seguranca: string;
  interior_comodidades: string;
  eletronica: string;
  informacoes_adicionais: string;
  outros: string;
  imagem: string;
}

export interface CarInterface {
  name: string;
  id: string;
  licensePlate: string;
  seller: string;
  price: string;
  date: string;
  condition: string;
  contact: string;
  mileage: string;
  year: number;
  engine: string;
  transmission: string;
  owners: string;
  inspected: string;
  drivetrain: string;
  specifications: string;
  safety: string;
  interiorComforts: string;
  electronics: string;
  additionalInformation: string;
  others: string;
  image: string;
}
