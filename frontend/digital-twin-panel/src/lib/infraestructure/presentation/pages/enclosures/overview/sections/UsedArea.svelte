<script>
  import { getRangeBarColor } from "src/lib/core/functions";
  import Card from "src/lib/infraestructure/presentation/components/cards/Card.svelte";
  import CardInner from "src/lib/infraestructure/presentation/components/cards/CardInner.svelte";
  import Range from "src/lib/infraestructure/presentation/components/misc/Range.svelte";

  export let usedArea = 0;
  export let totalArea = 1;
</script>

<Card>
  <h6 slot="header" class="m-0 mb-8">Área en uso (Ha)</h6>
  <svelte:fragment slot="body">
    <CardInner>
      <div slot="body" class="value__unit">
        <Range
          value={usedArea}
          to={totalArea}
          background={getRangeBarColor(usedArea)}
        />
        <h3 class="m-0">
          <strong
            >{((usedArea / totalArea) * 100).toPrecision(4)} %<strong /></strong
          >
        </h3>
      </div>
    </CardInner>
  </svelte:fragment>
</Card>

<style>
  .value__unit {
    display: flex;
    justify-content: space-between;
    align-items: center;
    white-space: nowrap;
    column-gap: 0.5rem;
  }
</style>
