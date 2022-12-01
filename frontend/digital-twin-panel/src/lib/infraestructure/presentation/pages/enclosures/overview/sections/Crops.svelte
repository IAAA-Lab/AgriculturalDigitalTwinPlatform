<script>
  import Card from "src/lib/infraestructure/presentation/components/cards/Card.svelte";
  import CardInner from "src/lib/infraestructure/presentation/components/cards/CardInner.svelte";
  import CropCard from "../components/CropCard.svelte";
</script>

<section>
  <Card>
    <h3 slot="header" class="m-0 mb-16">Plantas cultivadas</h3>
    <div slot="body">
      <div class="crops__wrapper">
        <CropCard />
      </div>
    </div>
  </Card>
</section>

<style>
  section {
    grid-area: crops;
  }

  .crops__wrapper {
    display: flex;
    flex-wrap: wrap;
    column-gap: 1rem;
    row-gap: 1rem;
  }

  .crop {
  }
</style>
