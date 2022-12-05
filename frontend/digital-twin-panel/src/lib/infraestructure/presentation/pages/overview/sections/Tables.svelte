<script lang="ts">
  //TODO: look at this table: https://gridjs.io/docs/config/data

  import Card from "../../../components/cards/Card.svelte";
  import type { Characteristic } from "src/lib/core/Domain";
  import Table from "../../../components/tables/Table.svelte";

  const data: Characteristic[] = [
    {
      name: "Área",
      value: 9345,
      unit: "Ha",
    },
    {
      name: "Pendiente media",
      value: 23.5,
      unit: "%",
    },
    {
      name: "Coef. de regadío",
      value: 53,
      unit: "%",
    },
    {
      name: "Área en uso",
      value: 67,
      unit: "%",
    },
    {
      name: "Salud de las plantas",
      value: 67,
      unit: "%",
    },
  ];
</script>

<section>
  <Card>
    <div slot="body" class="card-body">
      <Table {data} />
    </div>
  </Card>
</section>

<style lang="scss">
  section {
    grid-area: tables;
    overflow: hidden;

    div {
      height: 300px;
    }
  }
</style>
