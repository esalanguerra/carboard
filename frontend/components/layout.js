import Header from "./header";
import Sidebar from "./sidebar";

export default function Layout({ children }) {
  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <main className="page-wrapper">{children}</main>
    </div>
  );
}
