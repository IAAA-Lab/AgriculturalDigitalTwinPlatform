<script>
  import WeatherCard from "src/lib/infraestructure/presentation/components/cards/WeatherCard.svelte";
</script>

<WeatherCard>
  <div slot="body" class="body p-16">
    <span class="text-xs">00</span>
    <i class="fas fa-cloud-sun-rain" />
    <p class="text-m">18 °C</p>
  </div>
</WeatherCard>

<style>
  .body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    white-space: nowrap;
  }
</style>
