import { Roles } from "../config/roles";
import LayoutAdmin from "../layouts/LayoutAdmin";
import LayoutAgrarian from "../layouts/LayoutAgrarian";
import LayoutDefault from "../layouts/LayoutDefault";
import LayoutEditor from "../layouts/LayoutEditor";
import { Blog } from "../pages/Blog";
import Home from "../pages/Home";
import { NewsPanel } from "../pages/NewsPanel";
import { SingleNew } from "../pages/SingleNew";
import { UsersTable } from "../pages/UsersTable";

const getRoutes = (role, logged) => {
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
          path: "/panel-news",
          protected: true,
          name: "Panel de noticias",
          component: NewsPanel,
          layout: LayoutAdmin,
        },
        {
          exact: true,
          path: "/users",
          protected: true,
          name: "Usuarios",
          component: UsersTable,
          layout: LayoutAdmin,
        },
        {
          exact: true,
          path: "/",
          name: "Panel agrario",
          protected: true,
          component: NewsPanel,
          layout: LayoutAdmin,
        },
        {
          exact: true,
          path: "/blog",
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
          path: "/blog/:id",
          component: SingleNew,
          layout: LayoutEditor,
        },
        {
          exact: true,
          path: "/panel-news",
          name: "Panel de noticias",
          protected: true,
          component: NewsPanel,
          layout: LayoutEditor,
        },
        {
          exact: true,
          path: "/blog",
          component: Blog,
          name: "Noticias",
          layout: LayoutEditor,
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
        {
          path: "/blog/:id",
          component: SingleNew,
          layout: LayoutAgrarian,
        },
        {
          exact: true,
          path: "/",
          name: "Panel agrario",
          protected: true,
          component: NewsPanel,
          layout: LayoutAgrarian,
        },
        {
          exact: true,
          path: "/blog",
          component: Blog,
          name: "Noticias",
          layout: LayoutAgrarian,
        },
      ];
    default:
      return [];
  }
};

export default getRoutes;
