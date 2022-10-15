import LayoutDefault from "../../../lib/infraestructure/presentation/layouts/defaultLayout/index.svelte";
import Overview from "../../../lib/infraestructure/presentation/pages/overview/index.svelte";

const getRoutes = () => {
  return [
    {
      path: "/",
      component: Overview,
      layout: LayoutDefault,
    },
  ];
};

export default getRoutes;
