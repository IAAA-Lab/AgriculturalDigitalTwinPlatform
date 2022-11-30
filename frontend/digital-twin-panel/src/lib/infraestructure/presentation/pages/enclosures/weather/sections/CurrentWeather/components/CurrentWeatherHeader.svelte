<script>
  import { formattedDate } from "src/lib/core/functions";
  export let date = "--";
  export let address = "--";
  export let ta = "--";
  export let skyState = "--";
</script>

<div class="header mb-8">
  <h2 class="m-0">Tiempo actual</h2>
  <time class="m-0 text-xs">{formattedDate(date)}</time>
</div>
<div class="main-preview mb-16">
  <p class="m-0 text-sm">
    {address}
  </p>
  <li class="fi fi-rr-cloud" />
  <p class="m-0 fw-700 temp">{ta} °</p>
  <p class="m-0 text-sm skyState">{skyState}</p>
</div>

<style lang="scss">
  .header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
  }
  .temp {
    font-size: 3rem !important;
  }

  .skyState {
    font-size: 1rem !important;
  }

  .main-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    background: #5c8cd3;
    border: 1px solid #e3e3e3;
    box-shadow: inset 0px 0px 30px rgba(52, 95, 160, 0.4);
    border-radius: 10px;
    height: 200px;
    padding: 15px;
    color: whitesmoke;
  }
</style>
