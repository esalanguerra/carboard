import { useEffect, useState, useCallback } from "react";
import Layout from "../components/Layout";
import { apiRequest } from "../lib/api";
import withAuth from "../hoc/withAuth";

const Page = () => {
  const [cars, setCars] = useState([]);
  const [loadingCount, setLoadingCount] = useState(5);
  const [countCars, setCountCars] = useState(null);
  const [countMessages, setCountMessages] = useState({
    total: null,
    pending: null,
    sent: null,
  });

  const fetchCars = useCallback(async () => {
    try {
      const data = await apiRequest({
        method: "GET",
        url: "/cars",
        parameters: { page: 1, perPage: 12 },
      });
      setCars(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoadingCount((prev) => prev - 1);
    }
  }, []);

  const fetchCarCount = useCallback(async () => {
    try {
      const data = await apiRequest({ method: "GET", url: "/cars/count" });
      setCountCars(data ?? null);
    } catch (error) {
      console.error("Error fetching car count:", error);
    } finally {
      setLoadingCount((prev) => prev - 1);
    }
  }, []);

  const fetchMessageCount = useCallback(async () => {
    try {
      const data = await apiRequest({
        method: "GET",
        url: "/messages/count/filter/status",
      });
  
      setCountMessages((prev) => ({ ...prev, total: data ?? null }));
    } catch (error) {
      console.error("Error fetching total message count:", error);
      if (error && error.message) {
        setCountMessages((prev) => ({ ...prev, total: `Error: ${error.message}` }));
      }
    } finally {
      setLoadingCount((prev) => prev - 1);
    }
  }, []);
  

  const fetchMessageCountByStatus = useCallback(async (status = "") => {
    try {
      const data = await apiRequest({
        method: "GET",
        url: "/messages/count/filter/status",
        parameters: { status },
      });
      setCountMessages((prev) => ({
        ...prev,
        [status ? status.toLowerCase() : "total"]: data ?? null,
      }));
    } catch (error) {
      console.error(`Error fetching ${status || "total"} message count:`, error);
    } finally {
      setLoadingCount((prev) => prev - 1);
    }
  }, []);

  useEffect(() => {
    fetchCars();
    fetchCarCount();
    fetchMessageCount();
    fetchMessageCountByStatus("PENDING");
    fetchMessageCountByStatus("SENT");
  }, [fetchCars, fetchCarCount, fetchMessageCount, fetchMessageCountByStatus]);

  if (loadingCount > 0) {
    return <div>Loading...</div>;
  }

  const messageCounts = [
    { label: "Total", count: countMessages.total },
    { label: "Pendentes", count: countMessages.pending },
    { label: "Enviados", count: countMessages.sent },
  ];

  return (
    <Layout>
      <div className="content container-fluid">
        <div className="row">
          <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
            <div className="card dash-widget">
              <div className="card-body">
                <span className="dash-widget-icon">
                  <i className="fa fa-cubes"></i>
                </span>
                <div className="dash-widget-info">
                  <h3>{countCars ?? "..."}</h3>
                  <span>Carros</span>
                </div>
              </div>
            </div>
          </div>

          {messageCounts.map(({ label, count }) => (
            <div key={label} className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
              <div className="card dash-widget">
                <div className="card-body">
                  <span className="dash-widget-icon">
                    <i className="fa fa-cubes"></i>
                  </span>
                  <div className="dash-widget-info">
                    <h3>{count ?? "..."}</h3>
                    <span>{label}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row">
          {cars.map((car) => (
            <div key={car.id_car} className="col-12 col-md-6 col-lg-4 d-flex">
              <div className="card flex-fill">
                <img
                  alt={car.name}
                  src={car.images?.[0] || "/placeholder.jpg"}
                  className="card-img-top"
                  height={250}
                  width={100}
                />
                <div className="card-header">
                  <h5 className="card-title mb-0">{car.name}</h5>
                </div>
                <div className="card-body">
                  <p className="card-text">
                    <strong>Preço:</strong> {car.price} €<br />
                    <strong>Ano:</strong> {car.year}<br />
                    <strong>Quilometragem:</strong> {car.mileage}<br />
                    <strong>Vendedor:</strong> {car.seller}<br />
                    <strong>Link:</strong>
                    <a href={car.link} target="_blank" rel="noopener noreferrer">
                      Ver no Site
                    </a>
                  </p>
                  <a
                    className="btn btn-primary"
                    href={`/car/${car.id_car}`}
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
      </div>
    </Layout>
  );
};

export default withAuth(Page);
