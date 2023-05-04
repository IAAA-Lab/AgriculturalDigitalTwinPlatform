<script>
  export let errorMessage = "";
</script>

<div class="error__wrapper">
  <div class="error">
    <i class="fi fi-rr-exclamation" />
    <p class="m-0 text-m">Error</p>
    <p class="m-0 text-xs">{errorMessage}</p>
  </div>
</div>

<style>
  .error__wrapper {
    display: grid;
    place-items: center;
    height: 100%;
    color: white;
    width: 100%;
  }

  .error {
    border: 3px solid rgb(248, 225, 229);
    border-radius: 10px;
    padding: 15px;
    display: grid;
    place-items: center;
    background-color: crimson;
  }
</style>
