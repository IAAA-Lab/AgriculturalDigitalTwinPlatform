import Map from "../../../lib/infraestructure/presentation/pages/map/index.svelte";
import LayoutDefault from "../../../lib/infraestructure/presentation/layouts/defaultLayout/index.svelte";
import Overview from "../../../lib/infraestructure/presentation/pages/overview/index.svelte";
import Analytics from "../../../lib/infraestructure/presentation/pages/analytics/index.svelte";
import Simulation from "../../../lib/infraestructure/presentation/pages/simulation/index.svelte";
import EnclosureOverview from "../../../lib/infraestructure/presentation/pages/enclosures/overview/index.svelte";
import EnclosureMap from "../../../lib/infraestructure/presentation/pages/enclosures/map/index.svelte";
import EnclosureWeather from "../../../lib/infraestructure/presentation/pages/enclosures/weather/index.svelte";
import EnclosureCrops from "../../../lib/infraestructure/presentation/pages/enclosures/crops/index.svelte";
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
    {
      path: AppRoutes.ENCLOSURE_OVERVIEW,
      component: EnclosureOverview,
      layout: LayoutDefault,
    },
    {
      path: AppRoutes.ENCLOSURE_MAP,
      component: EnclosureMap,
      layout: LayoutDefault,
    },
    {
      path: AppRoutes.ENCLOSURE_WEATHER,
      component: EnclosureWeather,
      layout: LayoutDefault,
    },
    {
      path: AppRoutes.ENCLOSURE_CROPS,
      component: EnclosureCrops,
      layout: LayoutDefault,
    },
  ];
};

export default getRoutes;
