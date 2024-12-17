"use client"

import { apiRequest } from "@/utils/apiRequest"
import { useEffect, useState } from "react"

export default function Page() {
  const [carros, setCarros] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCarros = async () => {
      try {
        const response = await apiRequest("GET", "/carros")
        setCarros(response)
      } catch (err) {
        console.error("Erro ao buscar os carros:", err)
        setError("Erro ao carregar os carros. Tente novamente.")
      }
    }

    fetchCarros()
  }, [])

  return (
    <div>
      <h1>Carros</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {carros.map((carro, index) => (
          <li key={index}>
            <h2>{carro.nome}</h2>
            <p>Preço: {carro.preco}</p>
            <p>Quilometragem: {carro.quilometragem}</p>
            <p>Motor: {carro.motor}</p>
            <p>Contato: {carro.contato}</p>
            <img src={carro.imagem} alt={carro.nome} width="200" />
          </li>
        ))}
      </ul>
    </div>
  )
}
