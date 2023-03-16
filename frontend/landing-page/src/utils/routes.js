import { DIGITAL_TWIN_PANEL_URL } from "../config/api";
import { Roles } from "../config/roles";
import LayoutAdmin from "../layouts/LayoutAdmin";
import LayoutAgrarian from "../layouts/LayoutAgrarian";
import LayoutDefault from "../layouts/LayoutDefault";
import LayoutEditor from "../layouts/LayoutEditor";
import { Blog } from "../pages/Blog";
import Home from "../pages/Home";
import { NewsEdit } from "../pages/NewsEdit";
import { NewsPanel } from "../pages/NewsPanel";
import { SingleNew } from "../pages/SingleNew";
import { UsersTable } from "../pages/UsersTable";

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
        ref: "phases",
        name: "Fases",
      },
      {
        exact: true,
        path: "/blog",
        component: Blog,
        layout: LayoutDefault,
        name: "Noticias",
      },
      // {
      //   path: "/blog/:id",
      //   component: SingleNew,
      //   layout: LayoutAdmin,
      // },
      {
        exact: true,
        ref: "contact",
        name: "Contacto",
      },
    ];
  switch (role) {
    case Roles.ADMIN:
      return [
        {
          exact: true,
          path: "/",
          component: Home,
          protected: false,
          layout: LayoutAdmin,
        },
        {
          exact: true,
          ref: "phases",
          name: "Fases",
        },
        {
          exact: true,
          ref: "contact",
          name: "Contacto",
        },
        {
          exact: true,
          path: "/users",
          protected: true,
          name: "Usuarios",
          component: UsersTable,
          layout: LayoutAdmin,
        },
        // {
        //   exact: true,
        //   path: DIGITAL_TWIN_PANEL_URL,
        //   name: "Panel agrario",
        //   protected: true,
        //   layout: LayoutAdmin,
        // },
        {
          exact: true,
          path: "/blog",
          protected: false,
          component: Blog,
          name: "Noticias",
          layout: LayoutAdmin,
        },
      ];
    case Roles.NEWS_ADMIN:
      return [
        {
          exact: true,
          path: "/",
          component: Home,
          layout: LayoutEditor,
        },
        {
          exact: true,
          path: "/blog",
          component: Blog,
          name: "Noticias",
          layout: LayoutEditor,
        },
        {
          exact: true,
          ref: "phases",
          name: "Fases",
        },
        {
          exact: true,
          ref: "contact",
          name: "Contacto",
        },
      ];

    case Roles.AGRARIAN_USER:
      return [
        {
          exact: true,
          path: "/",
          component: Home,
          layout: LayoutAgrarian,
        },
        // {
        //   exact: true,
        //   path: DIGITAL_TWIN_PANEL_URL,
        //   name: "Panel agrario",
        //   protected: true,
        //   layout: LayoutAgrarian,
        // },
        {
          exact: true,
          path: "/blog",
          component: Blog,
          name: "Noticias",
          layout: LayoutAgrarian,
        },
        {
          exact: true,
          ref: "phases",
          name: "Fases",
        },
        {
          exact: true,
          ref: "contact",
          name: "Contacto",
        },
      ];
    default:
      return [];
  }
};

export default getRoutes;
