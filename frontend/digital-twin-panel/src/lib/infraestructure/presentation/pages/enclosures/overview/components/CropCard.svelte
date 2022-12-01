<script>
  import CardInner from "src/lib/infraestructure/presentation/components/cards/CardInner.svelte";
</script>

<CardInner>
  <div slot="body" class="crop">
    <div class="crop__header">
      <img
        src="https://images.unsplash.com/photo-1589988020929-8e8b0b0b1b1a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FyZCUyMGJhY2slMjBjb3Jwb3JhdGlvbnxlbnwwfDB8MHx8&ixlib=rb-1.2.1&w=1000&q=80"
        alt="crop"
        class="crop__image"
      />
      <h4 class="m-0">Maíz</h4>
      <span class="text-xs">Pystacil</span>
    </div>
    <div class="crop__divider" />
    <div class="crop__body">
      <div class="crop__body__item">
        <i class="fi fi-rr-tractor" />
        <span class="text-xs m-0">23.345,24 Kg </span>
      </div>
      <div class="crop__body__item">
        <i class="fi fi-rr-map-marker" />
        <span class="text-xs m-0">78,9 Ha </span>
      </div>
      <div class="crop__body__item">
        <i class="fi fi-rr-stats" />
        <span class="text-xs m-0">1.635 Kg/Ha </span>
      </div>
      <div class="crop__body__item">
        <i class="fi fi-rr-hand-holding-seeding" />
        <span class="text-xs m-0">654 </span>
      </div>
    </div>
  </div>
</CardInner>

<style>
  .crop {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0.5rem;
    column-gap: 0.5rem;
  }
  .crop__header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 0.25rem;
    text-transform: uppercase;
  }

  .crop__body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    row-gap: 0.2rem;
  }

  .crop__body__item {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    column-gap: 0.5rem;
  }

  .crop__divider {
    width: 1.75px;
    height: 100px;
    background: #e3e3e3;
    border-radius: 10px;
  }
</style>
