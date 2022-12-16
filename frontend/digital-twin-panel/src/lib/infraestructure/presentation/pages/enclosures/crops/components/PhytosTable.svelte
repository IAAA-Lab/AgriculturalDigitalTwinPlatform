<script>
  import Table from "src/lib/infraestructure/presentation/components/tables/Table.svelte";

  export let phytosList = [];
</script>

<Table
  rows={phytosList}
  columns={[
    { key: "product", title: "Producto", value: (v) => v.product },
    { key: "dosage", title: "Dosis", value: (v) => v.dosage },
    {
      key: "efficacy",
      title: "Eficacia",
      value: (v) => v.efficacy,
    },
    {
      key: "startDate",
      title: "Fecha",
      value: (v) => v.startDate.toLocaleDateString(),
    },
  ]}
/>
