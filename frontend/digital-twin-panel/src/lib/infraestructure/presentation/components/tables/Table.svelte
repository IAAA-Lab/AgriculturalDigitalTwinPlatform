<script>
  import SvelteTable from "svelte-table";

  export let columns = [];
  export let rows = [];
</script>

<SvelteTable {columns} {rows} />
