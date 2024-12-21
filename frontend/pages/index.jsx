import Layout from "../components/layout";
import { useEffect, useState, useCallback } from "react";
import { apiRequest } from "../lib/api";
import Loading from "../components/loading";
import Widget from "../components/widget";

function Page() {
  const [cars, setCars] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingCount, setLoadingCount] = useState(5);
  const [countMessages, setCountMessages] = useState({
    total: null,
    pending: null,
    sent: null,
    notSent: null,
    canceled: null,
  });
  const [errorMessages, setErrorMessages] = useState([]);

  const addErrorMessage = (message) => {
    setErrorMessages((prev) => [...prev, message]);
  };

  const fetchCars = useCallback(async () => {
    try {
      const data = await apiRequest({
        method: "GET",
        url: "/cars/pagination",
        parameters: { page: 1, perPage: 5 },
      });

      setCars(data);
    } catch (error) {
      console.error("Error fetching recent cars:", error);
      addErrorMessage("Failed to fetch recent cars. Please try again later.");
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      const data = await apiRequest({
        method: "GET",
        url: "/messages",
      });

      setMessages(data);
    } catch (error) {
      console.error("Error fetching recent messages:", error);
      addErrorMessage(
        "Failed to fetch recent messages. Please try again later."
      );
    }
  }, []);

  const fetchMessageCount = useCallback(async () => {
    try {
      const data = await apiRequest({
        method: "GET",
        url: "/messages/count/filter",
      });
      setCountMessages((prev) => ({ ...prev, total: data ?? null }));
    } catch (error) {
      console.error("Error fetching total message count:", error);
      addErrorMessage(
        "Failed to fetch total message count. Please try again later."
      );
    } finally {
      setLoadingCount((prev) => prev - 1);
    }
  }, []);

  const fetchMessageCountByStatus = useCallback(async (status = "") => {
    try {
      const data = await apiRequest({
        method: "GET",
        url: "/messages/count/filter",
        parameters: { status },
      });
      setCountMessages((prev) => ({
        ...prev,
        [status.toLowerCase()]: data ?? null,
      }));
    } catch (error) {
      console.error(
        `Error fetching ${status || "total"} message count:`,
        error
      );
      addErrorMessage(
        `Failed to fetch ${status.toLowerCase()} message count. Please try again later.`
      );
    } finally {
      setLoadingCount((prev) => prev - 1);
    }
  }, []);

  useEffect(() => {
    fetchMessageCount();
    fetchMessageCountByStatus("PENDING");
    fetchMessageCountByStatus("SENT");
    fetchMessageCountByStatus("NOT_SENT");
    fetchMessageCountByStatus("CANCELED");
    fetchCars();
    fetchMessages();
  }, [fetchMessageCount, fetchMessageCountByStatus]);

  if (loadingCount > 0) {
    return <Loading />;
  }

  return (
    <Layout>
      <div className="content container-fluid">
        {errorMessages.length > 0 && (
          <div className="alert alert-danger">
            <ul>
              {errorMessages.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="row">
          <Widget
            count={countMessages.pending || 0}
            label="Pending"
            icon="envelope"
          />
          <Widget count={countMessages.sent || 0} label="Sent" icon="check" />
          <Widget
            count={countMessages.notSent || 0}
            label="Not Sent"
            icon="exclamation-circle"
          />
          <Widget
            count={countMessages.canceled || 0}
            label="Canceled"
            icon="times-circle"
          />
        </div>
        <div className="row">
          <div className="col-md-6 d-flex">
            <div className="card card-table flex-fill">
              <div className="card-header">
                <h3 className="card-title mb-0">Recent Cars</h3>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-nowrap custom-table mb-0">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Seller</th>
                        <th>Plate</th>
                        <th>Price</th>
                        <th>Year</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cars.map((car) => (
                        <tr>
                          <td>{car.idCar}</td>
                          <td>{car.seller}</td>
                          <td>{car.plate}</td>
                          <td>{car.price}</td>
                          <td>{car.year}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 d-flex">
            <div className="card card-table flex-fill">
              <div className="card-header">
                <h3 className="card-title mb-0">Recent Messages</h3>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-nowrap custom-table mb-0">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Whatsapp</th>
                        <th>Car Plate</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {messages.map((message) => (
                        <tr>
                          <td>{message.car.idCar}</td>
                          <td>{message.whatsappNumber}</td>
                          <td>{message.car.plate}</td>
                          <td>{message.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Page;
