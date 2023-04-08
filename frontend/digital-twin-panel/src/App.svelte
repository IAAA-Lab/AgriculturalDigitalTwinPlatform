<script lang="ts">
  import { Route, Router } from "svelte-routing";
  import getRoutes from "./app/config/routes/routes";
  import Page404 from "./lib/infraestructure/presentation/pages/error/Page404.svelte";
  import { listOfEnclosures } from "./app/config/stores/selectedEnclosure";

  const routes = getRoutes();
  // TODO: provisional
  listOfEnclosures.set([
    "50-68-0-0-6-54-2",
    "50-99-0-0-1-43-2",
    "50-99-0-0-2-190-1",
    "50-230-0-0-10-447-2",
    "50-99-0-0-20-1182-1",
  ]);
</script>

<Router>
  {#each routes as route}
    <Route path={`${route.path}`} let:params>
      <svelte:component this={route.layout}>
        <svelte:component this={route.component} {...params} />
      </svelte:component>
    </Route>
  {/each}
  <Route component={Page404} />
</Router>
