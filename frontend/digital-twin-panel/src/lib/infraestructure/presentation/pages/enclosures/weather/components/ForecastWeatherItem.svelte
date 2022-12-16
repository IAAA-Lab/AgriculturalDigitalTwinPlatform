<script lang="ts">
  export let day: Date;
  export let minTa: number;
  export let maxTa: number;

  const days = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];
</script>

<div class="item">
  <p class="m-0 text-sm" style="width: 75px;">
    {days[day.getDay() - 1] || "Domingo"}
  </p>
  <slot name="icon" />
  <div class="ta__wrapper">
    <p class="m-0 text-sm">{minTa} °C</p>
    <div class="bar" />
    <p class="m-0 text-sm">{maxTa} °C</p>
  </div>
</div>

<style>
  .item {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    column-gap: 2rem;
    white-space: nowrap;
    min-width: 350px;
  }

  .bar {
    background: linear-gradient(90deg, #267df3 36%, #f34a26 100%);
    height: 10px;
    width: 120px;
    border-radius: 5px;
  }

  .ta__wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 1rem;
  }
</style>
