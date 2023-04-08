<script type="ts">
  import type { Treatment } from "src/lib/core/Domain";
  import Table from "src/lib/infraestructure/presentation/components/tables/Table.svelte";

  export let treatments: Treatment[] = [];
</script>

<Table
  rows={treatments}
  columns={[
    { key: "product", title: "Producto", value: (v) => v.phytosanitary.name },
    {
      key: "date",
      title: "Fecha",
      value: (v) => v.date.split("T")[0],
    },
    {
      key: "phytoName",
      title: "Nombre fitosanitario",
      value: (v) => v.phytosanitary.name,
    },
    {
      key: "phytoFormula",
      title: "Formula fitosanitario",
      value: (v) => v.phytosanitary.formula,
    },
    {
      key: "dosage",
      title: "Dosis",
      value: (v) => v.quantity.toPrecision(5) + " " + v.doseUnit,
    },
    {
      key: "plague",
      title: "Plaga",
      value: (v) => v.plague.name,
    },
    // {
    //   key: "broth",
    //   title: "Caldo",
    //   value: (v) => v.broth,
    // },
    // {
    //   key: "dosisMovement",
    //   title: "Movimiento de parcela",
    //   value: (v) => v.doseMovement,
    // },
  ]}
/>
