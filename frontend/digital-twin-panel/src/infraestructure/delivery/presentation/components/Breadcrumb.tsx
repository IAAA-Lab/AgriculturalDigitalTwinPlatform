import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname
    .split("/")
    .filter((x) => x)
    .map((x) => decodeURI(x));

  return (
    <nav>
      <ol className="breadcrumb ml-8">
        {pathnames.map((route, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          return (
            <li key={index} className="pl-8 reveal-from-left">
              <Link className={`text-sm`} to={routeTo}>
                {route} {index !== pathnames.length - 1 && "·"}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
