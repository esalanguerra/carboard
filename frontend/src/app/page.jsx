"use client"

import { apiRequest } from "@/utils/apiRequest"
import { useEffect, useState } from "react"
import { Car as CarIcon, Sparkles } from 'lucide-react'
import CarCard from "@/components/car-card"
import Sidebar from "@/components/layout/sidebar"

export default function Page() {
  const [carros, setCarros] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCarros = async () => {
      try {
        const response = await apiRequest("GET", "/carros")
        setCarros(response)
        console.log(response)
      } catch (err) {
        console.error("Erro ao buscar os carros:", err)
        setError("Erro ao carregar os carros. Tente novamente.")
      }
    }

    fetchCarros()
  }, [])

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-8 ml-64">
          <div className="min-h-screen bg-white">
            <section className="relative py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-3xl shadow-2xl animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                <div className="container mx-auto px-4 relative">
                  <div className="max-w-3xl mx-auto text-center">
                    <div className="flex items-center justify-center mb-6 animate-bounce-slow">
                      <CarIcon className="w-12 h-12 text-blue-400 mr-3" />
                      <Sparkles className="w-8 h-8 text-yellow-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white animate-text-gradient">
                      Encontre os melhores carros para o seu negócio
                    </h1>
                    <p className="text-xl text-blue-100 mb-8 animate-fade-in-up">
                      Localize oportunidades e negocie com eficiência em poucos cliques
                    </p>
                  </div>
                </div>
              </div>
            </section>
            <section className="py-16 px-4">
              <div className="container mx-auto"></div>
              <div className="relative flex-1 group">
                {error && <p className="text-red-500">{error}</p>}
                {carros.length === 0 ? (
                  <p>Carros não encontrados.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {carros.map((carro, index) => (
                      <CarCard key={index} car={carro} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}


