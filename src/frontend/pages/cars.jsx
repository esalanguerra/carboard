import Layout from "../components/Layout";
import { apiRequest } from "../lib/api";
import { useEffect, useState, useCallback } from "react";

export default function Home() {
  const [cars, setCars] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreCars = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const data = await apiRequest({
        data: {},
        method: "GET",
        url: "/cars",
        parameters: { page, perPage: 12 },
      });

      if (Array.isArray(data) && data.length > 0) {
        setCars((prevCars) => [...prevCars, ...data]);
        setPage((prevPage) => prevPage + 1);
        if (data.length < 12) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Erro ao carregar mais carros:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    loadMoreCars();
  }, [loadMoreCars]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition =
        window.innerHeight + document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.offsetHeight;

      if (scrollPosition >= scrollHeight - 100 && hasMore) {
        loadMoreCars();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreCars, hasMore]);

  return (
    <Layout>
      <div className="content container-fluid">
        <div className="row">
          {Array.isArray(cars) &&
            cars.map((car, index) => (
              <div key={index} className="col-12 col-md-6 col-lg-4 d-flex">
                <div className="card flex-fill">
                  <img
                    alt={car.name}
                    src={car.images[0]}
                    className="card-img-top"
                    height={250}
                    width={100}
                  />
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
                      <strong>Link:</strong>{" "}
                      <a
                        href={car.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver no Site
                      </a>
                    </p>
                    <a
                      className="btn btn-primary"
                      href={"/car/" + car.id_car}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Detalhes
                    </a>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {loading && (
          <div className="text-center">
            <p>Carregando...</p>
          </div>
        )}
        {!hasMore && !loading && (
          <div className="text-center">
            <p>Não há mais carros para exibir.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
