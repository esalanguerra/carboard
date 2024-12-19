import { AuthProvider } from "../contexts/AuthContext";

export default function Layout({ children }) {
  return (
    <AuthProvider>
      <div className="main-wrapper">
        <div className="header"></div>
        <div className="sidebar"></div>
        <main className="page-wrapper">{children}</main>
      </div>
    </AuthProvider>
  );
}
