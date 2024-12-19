import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { apiRequest } from "../../lib/api";

export default function Page() {
  const [car, setCar] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  const { id } = router.query;

  useEffect(() => {
    if (id) {
      apiRequest({ data: {}, method: "GET", url: "/cars/" + id }).then(
        (data) => {
          if (data) {
            setCar(data);
          } else {
            console.log("Error", data);
          }
        }
      );
    }
  }, [id]);

  const handleNextImage = () => {
    if (car.images && car.images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % car.images.length);
    }
  };

  const handlePreviousImage = () => {
    if (car.images && car.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? car.images.length - 1 : prevIndex - 1
      );
    }
  };

  return (
    <Layout>
      <div className="content container-fluid">
        <div className="card mb-0">
          <div className="card-body p-0">
            {car.images && car.images.length > 0 ? (
              <div
                className="carousel-container"
                style={{ position: "relative" }}
              >
                <div
                  className="carousel-image"
                  style={{
                    width: "100%",
                    height: "300px",
                    backgroundImage: `url(${car.images[currentImageIndex]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <button
                  className="carousel-button prev"
                  onClick={handlePreviousImage}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "10px",
                    transform: "translateY(-50%)",
                    background: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    cursor: "pointer",
                  }}
                >
                  &#8249;
                </button>
                <button
                  className="carousel-button next"
                  onClick={handleNextImage}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "10px",
                    transform: "translateY(-50%)",
                    background: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    cursor: "pointer",
                  }}
                >
                  &#8250;
                </button>
              </div>
            ) : (
              <div
                className="carousel-placeholder"
                style={{
                  width: "100%",
                  height: "300px",
                  backgroundColor: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p>No images available</p>
              </div>
            )}
          </div>
        </div>
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            borderTop: "1px solid #ddd",
          }}
        >
          <div className="profile-basic">
            <div className="row">
              <div className="col-md-5">
                <div className="profile-info-left">
                  <h3 className="user-name m-t-0">Carro: {car.name}</h3>
                  <h4 className="company-role m-t-0 mb-0">
                    Placa: {car.plate}
                  </h4>
                  <h5 className="company-role m-t-0 mb-0">
                    Preço: {car.price} €
                  </h5>
                  <small className="text-muted">Vendedor: {car.seller}</small>
                  <div className="staff-id">Telefone {car.phone}</div>
                  <div className="staff-msg">
                    <a href={`/send/message/whatsapp/${car.id_car}`} className="btn btn-custom">
                      Send Message
                    </a>
                  </div>
                </div>
              </div>
              <div class="col-md-7">
                <ul class="personal-info">
                  <li>
                    <span class="title">Potência: </span>
                    <span class="text">{car.power}</span>
                  </li>
                  <li>
                    <span class="title">Quilometragem:</span>
                    <span class="text">{car.mileage}</span>
                  </li>
                  <li>
                    <span class="title">Ano:</span>
                    <span class="text">{car.year}</span>
                  </li>
                  <li>
                    <span class="title">Aceleração:</span>
                    <span class="text">
                      {car.topSpeed ? car.topSpeed : "Não Informado"}
                    </span>
                  </li>
                  <li>
                    <span class="title">Portas:</span>
                    <span class="text">
                      {car.numberOfDoors ? car.numberOfDoors : "Não Informado"}
                    </span>
                  </li>
                  <li>
                    <span class="title">Assentos:</span>
                    <span class="text">
                      {car.numberOfPeople
                        ? car.numberOfPeople
                        : "Não Informado"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
