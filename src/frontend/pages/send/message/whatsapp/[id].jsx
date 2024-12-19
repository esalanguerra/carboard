import Layout from "../../../../components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import { apiRequest } from "../../../../lib/api";

const fetchCarData = async (id) => {
  try {
    const data = await apiRequest({
      data: {},
      method: "GET",
      url: `/cars/${id}`,
    });
    return data || null;
  } catch (error) {
    console.error("Error fetching car data:", error);
    return null;
  }
};

const fetchTemplates = async () => {
  try {
    const response = await apiRequest({
      data: {},
      method: "GET",
      url: "/template-messages",
    });
    return response || [];
  } catch (error) {
    console.error("Error fetching templates:", error);
    return [];
  }
};

export default function Page() {
  const [car, setCar] = useState({});
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");

  const router = useRouter();
  const { id } = router.query;

  const loadData = useCallback(async () => {
    if (id) {
      const carData = await fetchCarData(id);

      if (carData) {
        setCar(carData);
        setPhone(carData.phone);
      }

      const templateData = await fetchTemplates();
      setTemplates(templateData);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTemplateChange = (e) => setSelectedTemplate(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) {
      alert("Por favor, insira uma mensagem.");
      return;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${phone}&text=${encodedMessage}&type=phone_number&app_absent=0`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <Layout>
      <div className="content container-fluid">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-md-12">
            <div className="card shadow-lg">
              <div className="card-header bg-primary text-white">
                <h4 className="card-title mb-0">Enviar Mensagem Manualmente</h4>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-4">
                    <label htmlFor="template" className="form-label">
                      Selecione um Template
                    </label>
                    <select
                      id="template"
                      className="form-control"
                      value={selectedTemplate}
                      onChange={handleTemplateChange}
                    >
                      <option value="">Selecione um Template</option>
                      {templates.length > 0 ? (
                        templates.map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          Nenhum template disponível
                        </option>
                      )}
                    </select>
                  </div>
                  <div className="form-group mb-4">
                    <label htmlFor="seller" className="form-label">
                      Vendedor
                    </label>
                    <input
                      id="seller"
                      type="text"
                      className="form-control"
                      value={car.seller || ""}
                      disabled
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label htmlFor="phone" className="form-label">
                      Telefone
                    </label>
                    <input
                      id="phone"
                      type="text"
                      className="form-control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label htmlFor="message" className="form-label">
                      Mensagem
                    </label>
                    <textarea
                      id="message"
                      className="form-control"
                      rows="6"
                      placeholder="Digite sua mensagem aqui..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-success">
                      Enviar Mensagem
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
