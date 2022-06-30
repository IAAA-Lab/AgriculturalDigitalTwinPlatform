import { Navigate } from "react-router-dom";
import { Role } from "../../../core/Domain";
import { LayoutDefault } from "../../../infraestructure/delivery/presentation/layouts/LayoutDefault";
import { Area } from "../../../infraestructure/delivery/presentation/pages/Area";
import { Home } from "../../../infraestructure/delivery/presentation/pages/Home";
import { SingleField } from "../../../infraestructure/delivery/presentation/pages/SingleField";

export const getRoutes = (auth) => {
  if (auth.isError) return [];
  switch (auth.data.role) {
    case Role.ADMIN:
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
    case Role.AGRARIAN:
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
    default:
      return [];
  }
};
