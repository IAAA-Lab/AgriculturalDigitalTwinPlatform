<script>
  import HumidityWeatherStat from "../components/HumidityWeatherStat.svelte";
  import PrecipitationWeatherStat from "../components/PrecipitationWeatherStat.svelte";
  import TemperatureWeatherStat from "../components/TemperatureWeatherStat.svelte";
  import UvWeatherStat from "../components/UVWeatherStat.svelte";
  import WindWeatherStat from "../components/WindWeatherStat.svelte";
</script>

<section>
  <div class="header mb-8">
    <h2 class="m-0">Tiempo actual</h2>
    <li class="fi fi-rr-arrow" />
  </div>
  <div class="main-preview mb-16">
    <p class="m-0 text-sm">Córdoba, Andalucía, España</p>
    <li class="fi fi-rr-cloud" />
    <p class="m-0 text-4xl">12º</p>
    <p class="m-0 text-sm">Nublado</p>
  </div>
  <div class="weather-stats">
    <TemperatureWeatherStat />
    <WindWeatherStat />
    <HumidityWeatherStat />
    <UvWeatherStat />
    <PrecipitationWeatherStat />
  </div>
  <div class="footer" />
</section>

<style>
  section {
    width: 350px;
    background: #ccdbf0;
    border: 2px solid #ffffff;
    border-radius: 10px;
    margin-left: 40px;
    padding: 15px;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .main-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    background: #5c8cd3;
    border: 1px solid #e3e3e3;
    box-shadow: inset 0px 0px 30px rgba(52, 95, 160, 0.4);
    border-radius: 10px;
    height: 200px;
    padding: 15px;
    color: whitesmoke;
  }

  .weather-stats {
    display: grid;
    grid-template-areas:
      "temp temp temp"
      "wind humidity uv"
      "wind humidity precipitation";
    grid-template-columns: 3fr 3fr 1fr;
    grid-gap: 0.6rem;
  }
</style>
