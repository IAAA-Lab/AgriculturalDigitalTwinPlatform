<script>
  import { AppRoutes } from "../../../../../../app/config/constants";
</script>

<a href={AppRoutes.OVERVIEW}>
  <div class="logo-text mb-32 mt-16">
    <img src="images/logo.png" height={45} alt="logo" />
    <h3 class="m-0 pl-8">GEDEFEC</h3>
  </div>
</a>

<style>
  .logo-text {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 0.15rem;
  }
</style>
