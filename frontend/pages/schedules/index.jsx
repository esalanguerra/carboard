import Layout from "../../components/layout";
import { useEffect, useState, useCallback } from "react";
import { apiRequest } from "../../lib/api";
import Loading from "../../components/loading";
import Link from "next/link";
import { format } from "date-fns";
import { fi } from "date-fns/locale";

function Page() {
  const [schedules, setSchedules] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiRequest({
        method: "GET",
        url: "/schedules",
      });

      setSchedules(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setErrorMessage("Erro ao buscar dados.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  if (loading) {
    return (
      <Layout>
        <div className="content container-fluid">
          <div className="row">
            <div className="col-md-12">
              <Loading />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="content container-fluid">
        <div className="row">
          <div className="col-md-12">
            {errorMessage && (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                <strong>Error!</strong> {errorMessage}
                <button
                  type="button"
                  className="close"
                  data-dismiss="alert"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            )}
            <div className="table-responsive">
              <table className="table table-striped custom-table mb-0">
                <thead>
                  <tr>
                    <th>Filtros</th>
                    <th>Status</th>
                    <th>Data Criado</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((schedule) => (
                    <tr key={schedule.id}>
                      <td>
                        <h2>
                          <Link href={`/schedules/${schedule.id}`}>
                            [Abrir Filtros]
                          </Link>
                        </h2>
                      </td>
                      <td>{schedule.status}</td>
                      <td>
                        {format(new Date(schedule.createdAt), "dd.MM.yyyy", {
                          locale: fi,
                        })}
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

export default Page;
