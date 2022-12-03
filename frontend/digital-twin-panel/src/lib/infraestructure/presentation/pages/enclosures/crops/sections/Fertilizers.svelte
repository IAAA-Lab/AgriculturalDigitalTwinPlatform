<script>
  import Card from "src/lib/infraestructure/presentation/components/cards/Card.svelte";
</script>

<Card>
  <div slot="header" class="header mb-16">
    <h2 class="m-0">Fertilizantes</h2>
    <input type="date" />
  </div>
  <div slot="body" class="body" />
</Card>

<style>
  .header {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    column-gap: 0.5rem;
  }
</style>
