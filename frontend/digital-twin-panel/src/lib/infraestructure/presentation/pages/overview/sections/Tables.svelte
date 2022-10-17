<script>
  import Card from "../../../components/cards/Card.svelte";
  import { Datatable } from "svelte-simple-datatables";
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

  const data = [
    {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "jsdflkhkdsjh",
    },
    {
      id: 2,
      first_name: "Jane",
      last_name: "Doe",
      email: "jsdflkhkdsjh",
    },
    {
      id: 3,
      first_name: "John",
      last_name: "Doe",
      email: "jsdflkhkdsjh",
    },
  ];
</script>

<section class="tables">
  <Card>
    <div slot="body" class="card-body">
      <Datatable {settings} {data} bind:dataRows={rows}>
        <thead>
          <th data-key="id">ID</th>
          <th data-key="first_name">First Name</th>
          <th data-key="last_name">Last Name</th>
          <th data-key="email">Email</th>
        </thead>
        <tbody>
          {#if rows}
            {#each $rows as row}
              <tr>
                <td><span>{row.id}</span></td>
                <td><span>{row.first_name}</span></td>
                <td><span>{row.last_name}</span></td>
                <td><span>{row.email}</span></td>
              </tr>
            {/each}
          {/if}
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
      width: 72px;
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
