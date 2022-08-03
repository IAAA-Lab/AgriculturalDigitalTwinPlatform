import { Navigate } from "react-router-dom";
import { Role } from "../../../core/Domain";
import { LayoutDefault } from "../../../infraestructure/delivery/presentation/layouts/LayoutDefault";
import { Home } from "../../../infraestructure/delivery/presentation/pages/Home";
import { PageNoContent } from "../../../infraestructure/delivery/presentation/pages/PageNoContent";
import { EnclosurePage } from "../../../infraestructure/delivery/presentation/pages/Enclosure";
import { ParcelPage } from "../../../infraestructure/delivery/presentation/pages/Parcel";

export const getRoutes = (auth) => {
  if (!auth || auth.isError)
    return [
      {
        exact: true,
        path: "*",
        component: PageNoContent,
        layout: LayoutDefault,
      },
    ];

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
          path: "/home/:parcel",
          component: ParcelPage,
          layout: LayoutDefault,
        },
        {
          exact: true,
          path: "/home/:parcel/:enclosure",
          component: EnclosurePage,
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
          path: "/home/:parcel",
          component: ParcelPage,
          layout: LayoutDefault,
        },
        {
          exact: true,
          path: "/home/:parcel/:enclosure",
          component: EnclosurePage,
          layout: LayoutDefault,
        },
      ];
    default:
      return [
        {
          exact: true,
          path: "*",
          component: PageNoContent,
          layout: LayoutDefault,
        },
      ];
  }
};
