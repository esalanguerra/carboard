import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

export default function Page() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest({
      data: {},
      method: "GET",
      url: "/messages",
      parameters: { page: 1, perPage: 12 },
    }).then((data) => {
      if (Array.isArray(data)) {
        setMessages(data);
        console.log(data);
      } else {
        console.log("Error", data);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="content container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <table className="table table-striped custom-table mb-0">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Whatsapp</th>
                    <th>Carro</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((message) => (
                    <tr key={message.id}>
                      {" "}
                      <td>
                        <h2 className="table-avatar">
                          <a href={`/message/${message.id}`} className="avatar">
                            <img
                              src={
                                message.car
                                  ? message.car.images[2]
                                  : "https://cdn-icons-png.flaticon.com/512/2555/2555013.png"
                              }
                              alt="Avatar"
                            />
                          </a>
                          <a href={`/message/${message.id}`}>
                            {message.car
                              ? message.car.seller
                              : "Não Encontrado"}
                          </a>
                        </h2>
                      </td>
                      <td>{message.whatsapp_number}</td>
                      <td>
                        {message.car ? message.car.name : "Não Encontrado"}
                      </td>
                      <td>
                        <span
                          className={`badge badge-${getStatusClass(message.status)}`}
                        >
                          {message.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const getStatusClass = (status) => {
  switch (status) {
    case "VIEWED":
      return "primary";
    case "PENDING":
      return "info";
    case "SENT":
      return "success";
    case "NOT_SENT":
      return "danger";
    default:
      return "secondary";
  }
};
