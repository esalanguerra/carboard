import Link from "next/link";

export default function Sidebar() {
  const items = [
    {
      title: "Home",
      path: "/",
    },
    {
      title: "Cars",
      path: "/cars",
    },
    {
      title: "Messages",
      path: "/messages",
    },
    {
      title: "Schedules",
      path: "/schedules",
    },
    {
      title: "Logout",
      path: "/logout",
    },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-inner slimscroll">
        <div id="sidebar-menu" className="sidebar-menu">
          <ul>
            {items.map((item, index) => (
              <li key={index}>
                <Link href={item.path} className="active">
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
