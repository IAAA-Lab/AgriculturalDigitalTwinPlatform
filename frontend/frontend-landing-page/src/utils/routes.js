import { DIGITAL_TWIN_PANEL_URL, PANEL_URI } from "../config/constants";
import { Roles } from "../config/roles";
import LayoutAdmin from "../layouts/LayoutAdmin";
import LayoutDefault from "../layouts/LayoutDefault";
import { Blog } from "../pages/Blog";
import Home from "../pages/Home";
import { SingleNew } from "../pages/SingleNew";

const getRoutes = ({ role, logged }) => {
  if (!logged)
    return [
      {
        exact: true,
        path: "/",
        component: Home,
        layout: LayoutDefault,
      },
      {
        exact: true,
        path: "/blog",
        name: "Noticias",
        component: Blog,
        layout: LayoutDefault,
      },
      {
        path: "/blog/:id",
        component: SingleNew,
        layout: LayoutDefault,
      },
    ];
  switch (role) {
    case Roles.ADMIN:
      return [
        {
          exact: true,
          path: "/",
          component: Home,
          layout: LayoutAdmin,
        },
        {
          path: "/blog/:id",
          component: SingleNew,
          layout: LayoutAdmin,
        },
        {
          exact: true,
          name: "Panel",
          path: PANEL_URI,
        },
        {
          exact: true,
          path: "/blog",
          component: Blog,
          name: "Noticias",
          layout: LayoutAdmin,
        },
      ];
    default:
      return [
        {
          exact: true,
          path: "/",
          component: Home,
          layout: LayoutDefault,
        },
        {
          exact: true,
          path: "/blog",
          name: "Noticias",
          component: Blog,
          layout: LayoutDefault,
        },
        {
          path: "/blog/:id",
          component: SingleNew,
          layout: LayoutDefault,
        },
      ];
  }
};

export default getRoutes;
