<script>
  import { Link } from "svelte-routing";
</script>

<header class="header">
  <h1>{document.title}</h1>
  <nav>
    <ul>
      <li style="margin-top: 8px;">
        <i class="fi fi-rs-bell" />
      </li>
      <li>
        <Link to="/blog">jlaguna98@gmail.com</Link>
      </li>
    </ul>
  </nav>
</header>

<style lang="scss">
  .header {
    grid-area: header;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    h2 {
      margin: 0;
    }

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
  }
</style>
