import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Calendar,
  MapPin,
  Gauge,
  Car as CarIcon,
  Zap,
  Settings,
  Shield,
  FileText,
  ListChecks,
} from "lucide-react";
import Image from "next/image";
import { CarInterface } from "@/src/interfaces/CarInterface";

interface CarDetailsModalProps {
  car: CarInterface;
  isOpen: boolean;
  onClose: () => void;
}

export default function CarDetailsModal({
  car,
  isOpen,
  onClose,
}: CarDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6 bg-white shadow-lg rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center">{car.name}</DialogTitle>
        </DialogHeader>
        <div className="mb-6">
          <Image
            src={car.image}
            alt={car.name}
            width={800}
            height={400}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-primary mb-4">{car.price} €</h3>
            <div className="space-y-4">
              <div className="flex justify-center items-center gap-2">
                <Calendar className="h-6 w-6 text-gray-600" />
                <span>{car.date}</span>
              </div>
              <div className="flex justify-center items-center gap-2">
                <Gauge className="h-6 w-6 text-gray-600" />
                <span>{car.mileage} km</span>
              </div>
              <div className="flex justify-center items-center gap-2">
                <MapPin className="h-6 w-6 text-gray-600" />
                <span>{car.licensePlate}</span>
              </div>
              <div className="flex justify-center items-center gap-2">
                <MessageCircle className="h-6 w-6 text-gray-600" />
                <span>{car.contact}</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <h4 className="font-semibold text-xl mb-4">Especificações Técnicas</h4>
            <div className="space-y-4">
              <div className="flex justify-center items-center gap-2">
                <CarIcon className="h-6 w-6 text-gray-600" />
                <span>Motor: {car.engine}</span>
              </div>
              <div className="flex justify-center items-center gap-2">
                <Settings className="h-6 w-6 text-gray-600" />
                <span>Câmbio: {car.condition}</span>
              </div>
              <div className="flex justify-center items-center gap-2">
                <Zap className="h-6 w-6 text-gray-600" />
                <span>Transmissão: {car.transmission}</span>
              </div>
              <div className="flex justify-center items-center gap-2">
                <FileText className="h-6 w-6 text-gray-600" />
                <span>Proprietários: {car.owners}</span>
              </div>
              <div className="flex justify-center items-center gap-2">
                <Shield className="h-6 w-6 text-gray-600" />
                <span>Inspecionado: {car.inspected}</span>
              </div>
              <div className="flex justify-center items-center gap-2">
                <ListChecks className="h-6 w-6 text-gray-600" />
                <span>Drivetrain: {car.drivetrain}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          {car.interiorComforts && (
            <div className="mb-4">
              <h4 className="font-semibold text-xl mb-2">Interior e Comodidades</h4>
              <p>{car.interiorComforts}</p>
            </div>
          )}
          {car.safety && (
            <div className="mb-4">
              <h4 className="font-semibold text-xl mb-2">Segurança</h4>
              <p>{car.safety}</p>
            </div>
          )}
          {car.electronics && (
            <div className="mb-4">
              <h4 className="font-semibold text-xl mb-2">Eletrônica</h4>
              <p>{car.electronics}</p>
            </div>
          )}
          {car.additionalInformation && (
            <div className="mb-4">
              <h4 className="font-semibold text-xl mb-2">Informações Adicionais</h4>
              <p>{car.additionalInformation}</p>
            </div>
          )}
          {car.others && (
            <div className="mb-4">
              <h4 className="font-semibold text-xl mb-2">Outros</h4>
              <p>{car.others}</p>
            </div>
          )}
        </div>
        <div className="mt-6 border-t pt-4 text-center">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-lg">Vendedor</h4>
              <p>{car.seller}</p>
            </div>
            <Button
              onClick={() => {
                window.location.href = `/messages/whatsapp/manual/${car.contact}`;
              }}
              className="bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
            >
              Whatsapp do vendedor
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
