export default function Layout({ children }) {
  return (
      <div className="main-wrapper">
        <div className="header"></div>
        <div className="sidebar"></div>
        <main className="page-wrapper">{children}</main>
      </div>
  );
}
