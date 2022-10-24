<script lang="ts">
  //TODO: look at this table: https://gridjs.io/docs/config/data

  import Card from "../../../components/cards/Card.svelte";
  import { Datatable } from "svelte-simple-datatables";
  import type { Characteristic } from "src/lib/core/Domain";
  const settings = {
    columnFilter: true,
    labels: {
      search: "Buscar...",
      filter: "Filtrar",
      noRows: "Ninguna entrada",
      info: "Mostrando {rows} entradas",
      previous: "⬅",
      next: "➡",
    },
  };
  let rows;

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

<section class="tables">
  <Card>
    <div slot="body" class="card-body">
      <Datatable {settings} {data} bind:dataRows={rows}>
        <thead>
          <th class="text-sm" data-key="Nombre"> Nombre </th>
          {#if rows}
            {#each $rows as row}
              <th class="text-sm" data-key={row.name}>
                {row.name} ({row.unit})
              </th>
            {/each}
          {/if}
        </thead>
        <tbody>
          <tr>
            <td class="text-xs"><span>23-34-21-1-2</span></td>
            {#if rows}
              {#each $rows as row}
                <td class="text-xs"><span>{row.value} {row.unit}</span></td>
              {/each}
            {/if}
          </tr>
        </tbody>
      </Datatable>
    </div>
  </Card>
</section>

<style lang="scss">
  .tables {
    grid-area: tables;
    overflow-x: scroll;

    th:first-child {
      width: 100px;
    }
    td {
      text-align: center;
      padding: 4px 0;
    }

    .card-body {
      height: 300px;
      overflow: hidden;
    }
  }
</style>
