"use client";

import { useState, useEffect, JSX } from "react";
import LayoutDefault from "@/src/components/layout/default";
import Footer from "@/src/components/partials/footer";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Accordion } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Car, MessageCircle, Bot, Smile, Paperclip, Send } from "lucide-react";

export default function Page(): JSX.Element {
  return (
    <LayoutDefault>
      <h1 className="text-2xl font-bold mb-4 text-gray-800 tracking-tight">
        Painel de Controle
      </h1>
      <Tabs defaultValue="mensagens" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger
            value="mensagens"
            className="text-sm font-medium transition-all duration-200 hover:bg-blue-50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
          >
            Configuração de Mensagens
          </TabsTrigger>
          <TabsTrigger
            value="chat"
            className="text-sm font-medium transition-all duration-200 hover:bg-blue-50 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
          >
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Monitoramento de Envios
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="mensagens">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200">
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Filtros
                  </h3>
                  <Badge
                    variant="secondary"
                    className="text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    100 veículos encontrados
                  </Badge>
                </div>
                <ScrollArea className="h-[700px] pr-4">
                  <Accordion type="single" collapsible className="w-full">
                    {/* <BasicFilters />
                    <TechnicalFilters />
                    <ElectricFilters />
                    <EquipmentFilters />
                    <ColorFilters /> */}
                  </Accordion>
                </ScrollArea>
              </div>
            </Card>
            <div className="lg:col-span-8 space-y-6">
              <Card className="shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200">
                <div className="p-4 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Template da Mensagem
                  </h3>
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Título do Template
                      </label>
                      <Input
                        placeholder="Ex: Promoção BMW Série 3"
                        value="ooo"
                        className="mt-1 focus:ring-2 focus:ring-blue-500 border-gray-300 hover:border-gray-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Mensagem
                      </label>
                      <Textarea
                        placeholder="Digite sua mensagem aqui... Use {nome} para personalizar com o nome do cliente"
                        className="h-32 mt-1 focus:ring-2 focus:ring-blue-500 border-gray-300 hover:border-gray-400 transition-colors resize-none"
                        value="ooo"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Agendamento do Envio
                      </label>
                      <Input
                        type="datetime-local"
                        value="ooo"
                        className="mt-1 focus:ring-2 focus:ring-blue-500 border-gray-300 hover:border-gray-400 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <Footer />
    </LayoutDefault>
  );
}
