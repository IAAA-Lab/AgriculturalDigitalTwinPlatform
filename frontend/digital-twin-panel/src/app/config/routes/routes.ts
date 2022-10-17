import Map from "../../../lib/infraestructure/presentation/pages/map/index.svelte";
import LayoutDefault from "../../../lib/infraestructure/presentation/layouts/defaultLayout/index.svelte";
import Overview from "../../../lib/infraestructure/presentation/pages/overview/index.svelte";
import Analytics from "../../../lib/infraestructure/presentation/pages/analytics/index.svelte";
import Simulation from "../../../lib/infraestructure/presentation/pages/simulation/index.svelte";
import { AppRoutes } from "../constants";

const getRoutes = () => {
  return [
    {
      path: "/",
      component: Overview,
      layout: LayoutDefault,
    },
    {
      path: AppRoutes.OVERVIEW,
      component: Overview,
      layout: LayoutDefault,
    },
    {
      path: AppRoutes.MAP,
      component: Map,
      layout: LayoutDefault,
    },
    {
      path: AppRoutes.ANALYTICS,
      component: Analytics,
      layout: LayoutDefault,
    },
    {
      path: AppRoutes.SIMULATION,
      component: Simulation,
      layout: LayoutDefault,
    },
  ];
};

export default getRoutes;
