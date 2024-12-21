import Layout from "../../components/layout";
import { apiRequest } from "../../lib/api";
import { useEffect, useState, useCallback } from "react";

function Page() {
  const [cars, setCars] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [mileage, setMileage] = useState("");
  const [gearbox, setGearbox] = useState("");
  const [transmissionSystem, setTransmissionSystem] = useState("");
  const [numberOfDoors, setNumberOfDoors] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [color, setColor] = useState("");

  const loadCars = useCallback(async (pageNumber = 1) => {
    if (loading) return;
    setLoading(true);

    try {
      const data = await apiRequest({
        data: {},
        method: "GET",
        url: "/cars/filter",
        parameters: {
          page: pageNumber,
          perPage: 12,
          name,
          year,
          price,
          mileage,
          gearbox,
          transmissionSystem,
          numberOfDoors,
          fuelType,
          color,
        },
      });

      if (Array.isArray(data) && data.length > 0) {
        setCars((prevCars) => (pageNumber === 1 ? data : [...prevCars, ...data]));
        setPage(pageNumber + 1);
        if (data.length < 12) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Erro ao carregar carros:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, name, year, price, mileage, gearbox, transmissionSystem, numberOfDoors, fuelType, color]);

  const handleSearch = () => {
    // Resetando a página, os carros e o estado de hasMore ao aplicar um novo filtro
    setPage(1);
    setCars([]);
    setHasMore(true);  // Reseta a verificação de mais itens
    loadCars(1);       // Carrega os carros com os filtros aplicados
  };

  useEffect(() => {
    loadCars(page);
  }, [loadCars, page]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition =
        window.innerHeight + document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.offsetHeight;

      if (scrollPosition >= scrollHeight - 100 && hasMore) {
        loadCars(page);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadCars, page, hasMore]);

  return (
    <Layout>
      <div className="content container-fluid">
        <div className="row filter-row">
          <div className="col-sm-6 col-md-3">
            <div className="form-group form-focus">
              <input
                type="text"
                className="form-control floating"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label className="focus-label">Name</label>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="form-group form-focus">
              <input
                type="text"
                className="form-control floating"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
              <label className="focus-label">Year</label>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="form-group form-focus">
              <input
                type="text"
                className="form-control floating"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <label className="focus-label">Price</label>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="form-group form-focus">
              <input
                type="text"
                className="form-control floating"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
              />
              <label className="focus-label">Mileage</label>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="form-group form-focus">
              <input
                type="text"
                className="form-control floating"
                value={gearbox}
                onChange={(e) => setGearbox(e.target.value)}
              />
              <label className="focus-label">Gearbox</label>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="form-group form-focus">
              <input
                type="text"
                className="form-control floating"
                value={transmissionSystem}
                onChange={(e) => setTransmissionSystem(e.target.value)}
              />
              <label className="focus-label">Transmission System</label>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="form-group form-focus">
              <input
                type="text"
                className="form-control floating"
                value={numberOfDoors}
                onChange={(e) => setNumberOfDoors(e.target.value)}
              />
              <label className="focus-label">Number of Doors</label>
            </div>
          </div>
          {/* Filtros Adicionais */}
          <div className="col-sm-6 col-md-3">
            <div className="form-group form-focus">
              <input
                type="text"
                className="form-control floating"
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
              />
              <label className="focus-label">Fuel Type</label>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="form-group form-focus">
              <input
                type="text"
                className="form-control floating"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <label className="focus-label">Color</label>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <a
              href="#"
              className="btn btn-success btn-block"
              onClick={handleSearch}
            >
              Search
            </a>
          </div>
        </div>
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

export default Page;
