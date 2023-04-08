<script lang="ts">
  //TODO: look at this table: https://gridjs.io/docs/config/data

  import Card from "../../../components/cards/Card.svelte";
  import type { Characteristic } from "src/lib/core/Domain";
  import Table from "../../../components/tables/Table.svelte";

  export let rows;
  export let columns;
</script>

<section>
  <Card>
    <div slot="body" class="card-body">
      <Table {rows} {columns} />
    </div>
  </Card>
</section>

<style lang="scss">
  section {
    grid-area: tables;
    overflow: hidden;

    div {
      max-height: 750px;
      overflow: scroll;
    }
  }
</style>
