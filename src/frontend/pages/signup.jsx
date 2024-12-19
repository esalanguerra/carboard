import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { apiRequest } from "../lib/api";
import { useRouter } from "next/router";

export default function Page() {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [vat, setVat] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleEmailPasswordSubmit = async (e) => {
    e.preventDefault();

    setError("");

    setLoading(true);

    if (!email || !password) {
      setError("Email e senha são obrigatórios.");

      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      setStep(2);
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

      setStep(2);
    } catch (error) {
      console.error(error);
      setError("Erro ao fazer login com o Google. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();

    setError("");

    setLoading(true);

    if (!fullName || !vat) {
      setError("Nome completo e VAT são obrigatórios.");

      setLoading(false);

      return;
    }

    try {
      await apiRequest("POST", "/users", {
        fullName,
        vat,
        sub_firebase: auth.currentUser.uid,
      });

      console.log("Usuário criado com sucesso:", { fullName, vat });

      router.push("/");
    } catch (error) {
      console.error(error);

      setError("Erro ao salvar os dados. Tente novamente.");
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
              <h3 className="account-title">
                {step === 1 ? "Register - Step 1" : "Register - Step 2"}
              </h3>
              <p className="account-subtitle">Access to our dashboard</p>

              {step === 1 && (
                <form onSubmit={handleEmailPasswordSubmit}>
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
                    <div
                      className="text-danger text-center"
                      style={{ marginBottom: "15px" }}
                    >
                      {error}
                    </div>
                  )}
                  <div className="form-group text-center">
                    <button
                      className="btn btn-primary account-btn"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Loading..." : "Next"}
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
              )}

              {step === 2 && (
                <form onSubmit={handleFinalSubmit}>
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
                  {error && (
                    <div
                      className="text-danger text-center"
                      style={{ marginBottom: "15px" }}
                    >
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
                </form>
              )}
              <div className="account-footer">
                <p>
                  Already have an account? <a href="/signin">Login</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
