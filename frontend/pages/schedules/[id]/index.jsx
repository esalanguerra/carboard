import Layout from "../../../components/layout";
import { apiRequest } from "../../../lib/api";
import { useEffect, useState, useCallback } from "react";
import Loading from "../../../components/loading";
import { useRouter } from "next/router";

function Page() {
  const [schedule, setSchedule] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { id } = router.query;

  const fetchSchedule = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await apiRequest({
        method: "GET",
        url: `/schedules/${id}`,
      });

      setSchedule(data);
      setLoading(false);
      console.log(data);
    } catch (error) {
      console.error("Error fetching schedule:", error);
      setErrorMessage("Erro ao buscar dados.");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  return (
    <Layout>
      <div className="content container-fluid">
        {loading ? (
          <Loading />
        ) : errorMessage ? (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        ) : (
          <div className="row">
            <div className="col-sm-12">
              <form>
                <div class="row">
                  <div class="col-md-12">
                    <div class="form-group">
                      <label>Mensagem de Exemplo</label>
                      <textarea class="form-control" rows="4" disabled={true}>
                        {schedule.templateMessage.messageTextTemplate}
                      </textarea>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {schedule.filters &&
                    Object.entries(schedule.filters).map(([key, value]) => (
                      <div className="col-sm-6 col-md-3" key={key}>
                        <div className="form-group">
                          <label htmlFor={`filter-${key}`}>{key}</label>
                          <input
                            id={`filter-${key}`}
                            className="form-control"
                            type="text"
                            disabled={true}
                            defaultValue={value}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Page;
