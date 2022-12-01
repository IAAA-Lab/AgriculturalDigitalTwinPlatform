<script lang="ts">
  import { Route, Router } from "svelte-routing";
  import getRoutes from "./app/config/routes/routes";
  import Page404 from "./lib/infraestructure/presentation/pages/error/Page404.svelte";

  const routes = getRoutes();
</script>

<Router>
  {#each routes as route}
    <Route path={route.path} let:params>
      <svelte:component this={route.layout}>
        <svelte:component this={route.component} {...params} />
      </svelte:component>
    </Route>
  {/each}
  <Route component={Page404} />
</Router>
