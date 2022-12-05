<script>
  import { Datatable } from "svelte-simple-datatables";

  let rows;
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
  export let data = [];
</script>

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

<style lang="scss">
  * {
    grid-area: tables;
    overflow: scroll;

    th:first-child {
      width: 100px;
    }
    td {
      text-align: center;
      padding: 4px 0;
    }
  }
</style>
