<script>
  import { parcelsService } from "src/app/config/config";
  import { onMount } from "svelte";
  import CurrentWeather from "../enclosures/weather/sections/CurrentWeather.svelte";

  onMount(async () => {
    // TODO: Get the current weather
    const currentWeather = await parcelsService.getDailyWeather("0002l");
    console.log(currentWeather);
  });
</script>

<h1>Analytics</h1>
<CurrentWeather />
