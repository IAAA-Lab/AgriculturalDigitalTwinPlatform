<script>
  import { AppRoutes } from "../../../../../app/config/constants";
  import { Link } from "svelte-routing";
</script>

<section>
  <h1 class="m-0 mb-16">Error 404 - Not found</h1>
  <Link to={AppRoutes.OVERVIEW}>Volver a <strong>Inicio</strong></Link>
</section>

<style lang="scss">
  section {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    :global(a) {
      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>
