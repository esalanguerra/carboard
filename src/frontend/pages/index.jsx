import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { apiRequest } from "../lib/api";
import { useRouter } from "next/router";
import { auth, onAuthStateChangedListener } from "../lib/firebase";

export default function Home() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Observa o estado de autenticação do usuário
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) {
        setIsAuthenticated(true);
        setLoading(false); // Quando o usuário estiver autenticado, pare o carregamento
      } else {
        setIsAuthenticated(false);
        setLoading(false); // Quando o usuário não estiver autenticado, pare o carregamento
        router.push("/signin"); // Redireciona para a página de login
      }
    });

    // Limpa o ouvinte quando o componente for desmontado
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      apiRequest({
        data: {},
        method: "GET",
        url: "/cars",
        parameters: { page: 1, perPage: 12 },
      }).then((data) => {
        if (Array.isArray(data)) {
          setCars(data);
        } else {
          console.log("Error", data);
        }
      });
    }
  }, [isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="content container-fluid">
        <div className="row">
          {Array.isArray(cars) && cars.map((car, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-4 d-flex">
              <div className="card flex-fill">
                <img alt={car.name} src={car.images[0]} className="card-img-top" height={250} width={100} />
                <div className="card-header">
                  <h5 className="card-title mb-0">{car.name}</h5>
                </div>
                <div className="card-body">
                  <p className="card-text">
                    <strong>Preço:</strong> {car.price} €
                    <br />
                    <strong>Ano:</strong> {car.year}
                    <br />
                    <strong>Quilometragem:</strong> {car.mileage}
                    <br />
                    <strong>Vendedor:</strong> {car.seller}
                    <br />
                    <strong>Link:</strong> <a href={car.link} target="_blank" rel="noopener noreferrer">Ver no Site</a>
                  </p>
                  <a className="btn btn-primary" href={"/car/" + car.id_car} target="_blank" rel="noopener noreferrer">
                    Detalhes
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
