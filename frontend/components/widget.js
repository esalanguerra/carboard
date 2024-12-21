export default function Widget({ count, label, icon }) {
  return (
    <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
      <div className="card dash-widget">
        <div className="card-body">
          <span className="dash-widget-icon">
            <i className={"fa fa-" + icon}></i>
          </span>
          <div className="dash-widget-info">
            <h3>{count ?? "..."}</h3>
            <span>{label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
