<script>
  import { Link } from "svelte-routing";
  import Footer from "./Footer.svelte";
</script>

<aside class="sidebar">
  <nav>
    <ul>
      <li>
        <Link to="/">Overview</Link>
      </li>
      <li>
        <Link to="/map">Mapa</Link>
      </li>
      <li>
        <Link to="/analytics">Análisis</Link>
      </li>
      <li>
        <Link to="/simulation">Gemelos digitales</Link>
      </li>
    </ul>
  </nav>
  <Footer />
</aside>

<style lang="scss">
  .sidebar {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    grid-area: sidebar;
    height: 100vh;
    padding: 0px 50px 0px 50px;

    nav {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;

      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        li {
          padding-bottom: 1rem;
        }
      }
    }
  }
</style>
