import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import { RouteObject } from "react-router";

import SidebarLayout from "layouts/SidebarLayout";

import SuspenseLoader from "components/SuspenseLoader";
import Login from "content/applications/Login";
import Auth, { Result, Role } from "models/auth";
import AuthProtection from "AuthProtection";
import BaseLayout from "layouts/BaseLayout";
import OverviewLayout from "layouts/OverviewLayout";

const Loader = (Component: any) => (props: any) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Overview

const Overview = Loader(lazy(() => import("content/applications/Overview")));
const NewsList = Loader(lazy(() => import("content/applications/News/list")));
const SingleNew = Loader(
  lazy(() => import("content/applications/News/single"))
);

// Applications

const ParcelsList = Loader(lazy(() => import("content/applications/Agrarian")));

// Users

const UserProfile = Loader(
  lazy(() => import("content/applications/Users/profile"))
);
const Users = Loader(lazy(() => import("content/applications/Users/list")));
const UserSettings = Loader(
  lazy(() => import("content/applications/Users/settings"))
);

// News

const News = Loader(lazy(() => import("content/applications/News")));
const NewsEdit = Loader(lazy(() => import("content/applications/News/edit")));

// Status

const Status404 = Loader(lazy(() => import("content/pages/Status/Status404")));
const Status500 = Loader(lazy(() => import("content/pages/Status/Status500")));
const StatusComingSoon = Loader(
  lazy(() => import("content/pages/Status/ComingSoon"))
);
const StatusMaintenance = Loader(
  lazy(() => import("content/pages/Status/Maintenance"))
);

const getRoutes = (auth?: Result<Auth>): RouteObject[] => {
  if (!auth || auth.isError) {
    return [
      {
        path: "",
        element: <BaseLayout />,

        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "/",
            element: <OverviewLayout />,
            children: [
              {
                path: "",
                element: <Overview />,
              },
              {
                path: "news",
                children: [
                  {
                    path: "",
                    element: <NewsList />,
                  },
                  {
                    path: ":id",
                    element: <SingleNew />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "*",
        element: <Status404 />,
      },
    ];
  }

  switch (auth.data.role) {
    case Role.NEWS_EDITOR:
      return [
        {
          path: "",
          element: <BaseLayout />,
          children: [
            {
              path: "/",
              element: <OverviewLayout />,
              children: [
                {
                  path: "",
                  element: <Overview />,
                },
                {
                  path: "login",
                  element: <Navigate to="/management" />,
                },
                {
                  path: "news",
                  children: [
                    {
                      path: "",
                      element: <NewsList />,
                    },
                    {
                      path: ":id",
                      element: <SingleNew />,
                    },
                  ],
                },
              ],
            },
            {
              path: "status",
              children: [
                {
                  path: "",
                  element: <Navigate to="404" replace />,
                },
                {
                  path: "404",
                  element: <Status404 />,
                },
                {
                  path: "500",
                  element: <Status500 />,
                },
                {
                  path: "maintenance",
                  element: <StatusMaintenance />,
                },
                {
                  path: "coming-soon",
                  element: <StatusComingSoon />,
                },
              ],
            },
            {
              path: "*",
              element: <Status404 />,
            },
          ],
        },
        {
          path: "management",
          element: (
            <AuthProtection>
              <SidebarLayout />
            </AuthProtection>
          ),
          children: [
            {
              path: "news",
              children: [
                {
                  path: "",
                  element: <News />,
                },
                {
                  path: "manage",
                  element: <NewsEdit />,
                },
              ],
            },
            {
              path: "profile",
              children: [
                {
                  path: "",
                  element: <Navigate to="details" replace />,
                },
                {
                  path: "details",
                  element: <UserProfile />,
                },
                {
                  path: "settings",
                  element: <UserSettings />,
                },
              ],
            },
          ],
        },
      ];
    case Role.AGRARIAN:
      return [
        {
          path: "",
          element: <BaseLayout />,
          children: [
            {
              path: "/",
              element: <OverviewLayout />,
              children: [
                {
                  path: "",
                  element: <Overview />,
                },
                {
                  path: "login",
                  element: <Navigate to="/management" />,
                },
                {
                  path: "news",
                  children: [
                    {
                      path: "",
                      element: <NewsList />,
                    },
                    {
                      path: ":id",
                      element: <SingleNew />,
                    },
                  ],
                },
              ],
            },
            {
              path: "status",
              children: [
                {
                  path: "",
                  element: <Navigate to="404" replace />,
                },
                {
                  path: "404",
                  element: <Status404 />,
                },
                {
                  path: "500",
                  element: <Status500 />,
                },
                {
                  path: "maintenance",
                  element: <StatusMaintenance />,
                },
                {
                  path: "coming-soon",
                  element: <StatusComingSoon />,
                },
              ],
            },
            {
              path: "*",
              element: <Status404 />,
            },
          ],
        },
        {
          path: "management",
          element: (
            <AuthProtection>
              <SidebarLayout />
            </AuthProtection>
          ),
          children: [
            {
              path: "profile",
              children: [
                {
                  path: "",
                  element: <Navigate to="details" replace />,
                },
                {
                  path: "details",
                  element: <UserProfile />,
                },
                {
                  path: "settings",
                  element: <UserSettings />,
                },
              ],
            },
            {
              path: "agrarian",
              children: [
                {
                  path: "",
                  element: <ParcelsList />,
                },
              ],
            },
          ],
        },
      ];
    case Role.ADMIN:
      return [
        {
          path: "",
          element: <BaseLayout />,
          children: [
            {
              path: "/",
              element: <OverviewLayout />,
              children: [
                {
                  path: "",
                  element: <Overview />,
                },
                {
                  path: "login",
                  element: <Navigate to="/management" />,
                },
                {
                  path: "news",
                  children: [
                    {
                      path: "",
                      element: <NewsList />,
                    },
                    {
                      path: ":id",
                      element: <SingleNew />,
                    },
                  ],
                },
              ],
            },
            {
              path: "status",
              children: [
                {
                  path: "",
                  element: <Navigate to="404" replace />,
                },
                {
                  path: "404",
                  element: <Status404 />,
                },
                {
                  path: "500",
                  element: <Status500 />,
                },
                {
                  path: "maintenance",
                  element: <StatusMaintenance />,
                },
                {
                  path: "coming-soon",
                  element: <StatusComingSoon />,
                },
              ],
            },
            {
              path: "*",
              element: <Status404 />,
            },
          ],
        },
        {
          path: "management",
          element: (
            <AuthProtection>
              <SidebarLayout />
            </AuthProtection>
          ),
          children: [
            {
              path: "",
              element: <Navigate to="profile" replace />,
            },
            {
              path: "profile",
              children: [
                {
                  path: "",
                  element: <Navigate to="details" replace />,
                },
                {
                  path: "details",
                  element: <UserProfile />,
                },
                {
                  path: "list",
                  element: <Users />,
                },
                {
                  path: "settings",
                  element: <UserSettings />,
                },
              ],
            },
            {
              path: "news",
              children: [
                {
                  path: "",
                  element: <News />,
                },
                {
                  path: "manage",
                  element: <NewsEdit />,
                },
              ],
            },
            {
              path: "agrarian",
              children: [
                {
                  path: "",
                  element: <ParcelsList />,
                },
              ],
            },
          ],
        },
      ];
  }

  return [
    {
      path: "",
      element: <BaseLayout />,
      children: [
        {
          path: "/",
          element: <Overview />,
        },
        {
          path: "login",
          element: <Login />,
        },
      ],
    },
    {
      path: "*",
      element: <Status404 />,
    },
  ];
};

export default getRoutes;
