"use client";

import { JSX } from "react";
import LayoutDefault from "@/src/components/layout/default";
import Footer from "@/src/components/layout/footer";
import { useGetCustomers } from "./hooks/useGetCustomers";

export default function Page(): JSX.Element {
  const { customers, error, loading } = useGetCustomers();

  return (
    <LayoutDefault>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Tabela de Clientes</h1>
        {loading && <p>Carregando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Nome</th>
                <th className="py-3 px-6 text-left">VAT</th>
                <th className="py-3 px-6 text-left">Telefone</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {customers.length > 0 ? (
                customers.map((cliente) => (
                  <tr
                    key={cliente.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6">{cliente.name}</td>
                    <td className="py-3 px-6">{cliente.vat}</td>
                    <td className="py-3 px-6">{cliente.phone_number}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-3 px-6 text-center">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </LayoutDefault>
  );
}
