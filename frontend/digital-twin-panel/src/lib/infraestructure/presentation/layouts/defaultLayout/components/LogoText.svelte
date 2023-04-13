<script>
  import { BASEPATH } from "src/app/config/config";
  import { AppRoutes } from "../../../../../../app/config/constants";
</script>

<a href={BASEPATH + AppRoutes.OVERVIEW}>
  <div class="logo-text mb-32 mt-16">
    <img src="{BASEPATH}/images/logo.png" height={45} alt="logo" />
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
