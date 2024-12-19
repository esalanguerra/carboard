import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";
import withAuth from "../hoc/withAuth";

function LogoutPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/signin");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="container">
          <div className="account-box">
            <div className="account-wrapper">
              <h3 className="account-title">Logout</h3>
              <p className="account-subtitle">Você tem certeza que deseja sair?</p>
              <div className="form-group text-center">
                <button
                  className="btn btn-danger account-btn"
                  onClick={handleLogout}
                >
                  Sair da Conta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(LogoutPage);
