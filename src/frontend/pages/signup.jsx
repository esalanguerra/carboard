import Link from "next/link";

export default function Page() {
  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="container">
          <div className="account-box">
            <div className="account-wrapper">
              <h3 className="account-title">Register</h3>
              <p className="account-subtitle">Access to our dashboard</p>
              <form action="index.html">
                <div className="form-group">
                  <label>Full Name</label>
                  <input className="form-control" type="text" />
                </div>
                <div className="form-group">
                  <label>VAT</label>
                  <input className="form-control" type="text" />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input className="form-control" type="text" />
                </div>
                <div className="form-group">
                  <div className="row">
                    <label>Password</label>
                  </div>
                  <input className="form-control" type="password" />
                </div>
                <div className="form-group text-center">
                  <button className="btn btn-primary account-btn" type="submit">
                    Register
                  </button>
                </div>
                <div className="account-footer">
                  <p>
                    Already have an account? <Link href="/signin">Login</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
