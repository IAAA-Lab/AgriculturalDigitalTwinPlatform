import { Navigate } from "react-router-dom";
import { LayoutDefault } from "../../../infraestructure/delivery/presentation/layouts/LayoutDefault";
import { Area } from "../../../infraestructure/delivery/presentation/pages/Area";
import { Home } from "../../../infraestructure/delivery/presentation/pages/Home";
import { SingleField } from "../../../infraestructure/delivery/presentation/pages/SingleField";

export const getRoutes = (logged) => {
  if (!logged) return [];
  return [
    {
      exact: true,
      path: "/",
      component: () => <Navigate to="/home" replace />,
      layout: LayoutDefault,
    },
    {
      exact: true,
      path: "/home",
      component: Home,
      layout: LayoutDefault,
    },
    {
      exact: true,
      path: "/area",
      component: Area,
      layout: LayoutDefault,
    },
    {
      exact: true,
      path: "/singleField",
      component: SingleField,
      layout: LayoutDefault,
    },
  ];
};
