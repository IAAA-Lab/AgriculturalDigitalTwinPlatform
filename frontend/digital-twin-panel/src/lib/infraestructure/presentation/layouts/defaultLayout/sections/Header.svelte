<script>
  import { Link } from "svelte-routing";
</script>

<header class="header">
  <h1>{document.title}</h1>
  <nav>
    <ul>
      <li class="mt-8">
        <i class="fi fi-rr-bell" />
      </li>
      <li>
        <h3 class="user-settings text-sm m-0">jlaguna98@gmail.com</h3>
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
    margin-left: $main--padding__desktop;

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
  }
</style>
