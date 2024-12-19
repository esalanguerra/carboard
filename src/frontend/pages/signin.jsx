import { useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error) {
      setError("Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (error) {
      setError("Erro ao fazer login com Google. Tente novamente.");
    }
  };

  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="container">
          <div className="account-box">
            <div className="account-wrapper">
              <h3 className="account-title">Login</h3>
              <p className="account-subtitle">Access to our dashboard</p>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    className="form-control"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                  />
                </div>
                {error && (
                  <div className="text-danger text-center">{error}</div>
                )}
                <div className="form-group text-center">
                  <button className="btn btn-primary account-btn" type="submit">
                    Login
                  </button>
                </div>
                <div className="form-group text-center">
                  <button
                    className="btn btn-secondary account-btn"
                    onClick={handleGoogleSignIn}
                  >
                    Login with Google
                  </button>
                </div>
              </form>
              <div className="account-footer">
                <p>
                  Don't have an account yet?{" "}
                  <Link href="/signup">Register</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
