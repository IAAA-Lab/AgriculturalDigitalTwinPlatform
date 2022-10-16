<script>
  import { Link } from "svelte-routing";
  import SidebarOption from "../../../components/misc/SidebarOption.svelte";
  import Footer from "./Footer.svelte";
</script>

<aside class="sidebar">
  <div class="logo-text">
    <h3>GEDEFEC</h3>
  </div>
  <nav>
    <ul>
      <li>
        <Link to="/">
          <SidebarOption text="Overview">
            <i class="fi fi-rs-layout-fluid" />
          </SidebarOption>
        </Link>
      </li>
      <li>
        <Link to="/map"
          ><SidebarOption text="Mapa">
            <i class="fi fi-rs-layout-fluid" />
          </SidebarOption></Link
        >
      </li>
      <li>
        <Link to="/analytics"
          ><SidebarOption text="Análisis">
            <i class="fi fi-rs-layout-fluid" />
          </SidebarOption></Link
        >
      </li>
      <li>
        <Link to="/simulation"
          ><SidebarOption text="Gemelos digitales">
            <i class="fi fi-rs-layout-fluid" />
          </SidebarOption></Link
        >
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
    padding: 0px 20px 0px 20px;

    nav {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      white-space: nowrap;

      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        li {
          padding-bottom: 7px;
        }
      }
    }
  }
</style>
