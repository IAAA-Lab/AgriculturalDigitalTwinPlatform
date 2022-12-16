<script>
  import WeatherCard from "src/lib/infraestructure/presentation/components/cards/WeatherCard.svelte";

  export let ta;
  export let skyState;
  export let time;
</script>

<WeatherCard>
  <div slot="body" class="body pl-16 pr-16">
    <span class="text-xs">{time} h</span>
    <slot name="icon" />
    <p class="text-m m-0">{ta} °C</p>
    <span class="text-xs">{skyState}</span>
  </div>
</WeatherCard>

<style>
  .body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
    row-gap: 0.25rem;
  }
</style>
