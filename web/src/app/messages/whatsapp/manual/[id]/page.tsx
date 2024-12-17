/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import LayoutDefault from "@/src/components/layout/default";
import Footer from "@/src/components/layout/footer";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Page() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [nomeVendedor, setNomeVendedor] = useState("");
  const [nomeProduto, setNomeProduto] = useState("");

  const templates = [
    {
      message_text_template:
        "Olá {nomeVendedor}, gostaria de saber mais informações sobre o produto.",
      id: "template1",
    },
    {
      message_text_template:
        "Olá {nomeVendedor}, gostaria de saber mais informações sobre o produto {nomeProduto}.",
      id: "template2",
    },
    {
      message_text_template:
        "Olá {nomeVendedor}, gostaria de saber mais informações sobre o produto {nomeProduto} e formas de pagamento.",
      id: "template3",
    },
  ];

  useEffect(() => {
    const path = window.location.pathname;
    const number = path.split("/")[4];
    setPhone(number);
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      const template = templates.find((t) => t.id === selectedTemplate);
      if (template) {
        let updatedMessage = template.message_text_template;
        updatedMessage = updatedMessage.replace("{nomeVendedor}", nomeVendedor);
        updatedMessage = updatedMessage.replace("{nomeProduto}", nomeProduto);
        setMessage(updatedMessage);
      }
    }
  }, [selectedTemplate, nomeVendedor, nomeProduto]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${phone}&text=${encodedMessage}&type=phone_number&app_absent=0`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <LayoutDefault>
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-semibold text-center text-gray-800">
          Envie uma mensagem no WhatsApp
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-600"
            >
              Telefone (com código do país):
            </label>
            <Input
              id="phone"
              type="text"
              value={phone}
              readOnly
              disabled
              className="mt-2 w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="template"
              className="block text-sm font-medium text-gray-600"
            >
              Selecione um Template de Mensagem:
            </label>
            <select
              id="template"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="mt-2 w-full p-3 border border-gray-300 rounded-md"
            >
              <option value="">Escolha um template</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.message_text_template}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="nomeVendedor"
              className="block text-sm font-medium text-gray-600"
            >
              Nome do Vendedor:
            </label>
            <Input
              id="nomeVendedor"
              type="text"
              value={nomeVendedor}
              onChange={(e) => setNomeVendedor(e.target.value)}
              placeholder="Digite o nome do vendedor"
              className="mt-2 w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="nomeProduto"
              className="block text-sm font-medium text-gray-600"
            >
              Nome do Produto:
            </label>
            <Input
              id="nomeProduto"
              type="text"
              value={nomeProduto}
              onChange={(e) => setNomeProduto(e.target.value)}
              placeholder="Digite o nome do produto"
              className="mt-2 w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-600"
            >
              Mensagem:
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem"
              required
              className="mt-2 w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-center">
            <Button
              type="submit"
              className="w-full sm:w-auto py-3 px-8 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Enviar
            </Button>
          </div>
        </form>
      </div>
      <Footer />
    </LayoutDefault>
  );
}
