import { useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../lib/firebase";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Page() {
  const [fullName, setFullName] = useState("");
  const [vat, setVat] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    if (!email || !password || !fullName || !vat) {
      setError("Todos os campos são obrigatórios.");
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/"); // Use Next.js routing instead of window.location.href
    } catch (error) {
      console.error(error);
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);

    try {
      await signInWithPopup(auth, provider);
      router.push("/"); // Use Next.js routing instead of window.location.href
    } catch (error) {
      console.error(error);
      setError("Erro ao fazer login com o Google. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="container">
          <div className="account-box">
            <div className="account-wrapper">
              <h3 className="account-title">Register</h3>
              <p className="account-subtitle">Access to our dashboard</p>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    className="form-control"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>VAT</label>
                  <input
                    className="form-control"
                    type="text"
                    value={vat}
                    onChange={(e) => setVat(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    className="form-control"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    className="form-control"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="6"
                  />
                </div>
                {error && (
                  <div className="text-danger text-center" style={{ marginBottom: "15px" }}>
                    {error}
                  </div>
                )}
                <div className="form-group text-center">
                  <button
                    className="btn btn-primary account-btn"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Register"}
                  </button>
                </div>
                <div className="form-group text-center">
                  <button
                    className="btn btn-secondary account-btn"
                    type="button"
                    onClick={handleGoogleSignUp}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Sign up with Google"}
                  </button>
                </div>
              </form>
              <div className="account-footer">
                <p>
                  Already have an account? <Link href="/signin">Login</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
