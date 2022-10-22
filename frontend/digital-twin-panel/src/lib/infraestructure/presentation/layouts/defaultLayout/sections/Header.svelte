<script>
  import { AppRoutes } from "@/src/app/config/constants";
  import SummaryPopup from "../../../pages/overview/components/SummaryPopup.svelte";
</script>

<header class="header ml-16">
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
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    padding-top: 16px;

    nav {
      ul {
        display: flex;
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
      justify-content: end;
      h1 {
        display: none;
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
