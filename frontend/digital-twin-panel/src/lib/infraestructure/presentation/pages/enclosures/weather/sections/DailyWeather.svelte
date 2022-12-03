<script>
  import HourlyWeather from "../components/HourlyWeather.svelte";
</script>

<section>
  <HourlyWeather />
  <HourlyWeather />
  <HourlyWeather />
  <HourlyWeather />
  <HourlyWeather />
  <HourlyWeather />
  <HourlyWeather />
  <HourlyWeather />
  <HourlyWeather />
  <HourlyWeather />
  <HourlyWeather />
  <HourlyWeather />
  <HourlyWeather />
</section>

<style>
  section {
    grid-area: daily-weather;
    display: flex;
    flex-direction: row;
    column-gap: 0.5rem;
    overflow-y: scroll;
  }
</style>
