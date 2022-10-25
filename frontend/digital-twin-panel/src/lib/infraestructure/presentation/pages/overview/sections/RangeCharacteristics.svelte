<script>
  import { getRangeBarColor } from "src/lib/core/functions";
  import Card from "../../../components/cards/Card.svelte";
  import Range from "../../../components/misc/Range.svelte";

  let value = 25;
</script>

<section class="rangeCharacteristics">
  <Card>
    <h4 slot="header" class="m-0 mb-8 text-sm">Área en uso</h4>
    <div slot="body" class="range">
      <Range {value} background={getRangeBarColor(value)} />
      <span class="text-sm fw-700 ml-8">{value} %</span>
    </div>
  </Card>
</section>

<style lang="scss">
  .rangeCharacteristics {
    grid-area: rangeCharacteristics;

    .range {
      display: flex;
      align-items: center;
      justify-content: space-between;
      white-space: nowrap;
    }
  }
</style>
