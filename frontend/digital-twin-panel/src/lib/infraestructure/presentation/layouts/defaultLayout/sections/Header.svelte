<script>
  import { AppRoutes } from "@/src/app/config/constants";
  import SummaryPopup from "../../../components/misc/SummaryPopup.svelte";

  const toggleSidebar = () => {
    const sidebar = document.querySelector(".sidebar");
    sidebar?.classList.toggle("not-active");
  };
</script>

<header class="header ml-16">
  <i class="fi fi-rr-menu-burger burguer" on:click={toggleSidebar} />
  <h1>{document.title}</h1>
  <nav>
    <ul>
      {#if window.location.pathname === AppRoutes.OVERVIEW}
        <li class="summary mt-8">
          <SummaryPopup />
        </li>
      {/if}
      <li class="mt-8 notifications">
        <i class="fi fi-rr-bell" />
      </li>
      <li>
        <h3 class="user-settings text-sm m-0">jlaguna98@gmail.com</h3>
        <i class="fi fi-rr-portrait user-menu" />
      </li>
    </ul>
  </nav>
</header>

<style lang="scss">
  .header {
    grid-area: header;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;

    nav {
      ul {
        display: flex;
        justify-content: right;
        align-items: center;
        list-style: none;
        margin: 0;
        padding: 5px;

        li {
          margin-right: 1rem;
        }
      }
    }

    .user-settings {
      color: color(secondary);
      padding: 5px 10px 5px 10px;
      border-radius: 10px;
      background-color: rgb(255, 225, 215);

      cursor: pointer;
      transition: all 0.2s ease-out;

      &:hover {
        color: grey;
      }
    }
    .burguer {
      margin-top: 8px;
      cursor: pointer;
      display: none;
    }

    .notifications {
      cursor: pointer;
    }

    .summary {
      color: color(secondary);
      cursor: pointer;
      display: none;
    }

    .user-menu {
      cursor: pointer;
      margin-top: 8px;
      display: none;
    }
  }

  @include media("<medium") {
    .header {
      .burguer {
        display: block;
      }
      .user-settings {
        display: none;
      }
      .user-menu {
        display: block;
      }
      .summary {
        display: block;
      }
    }
  }
</style>
