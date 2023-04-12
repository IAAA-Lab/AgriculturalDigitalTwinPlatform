<script>
  import { getWeatherIcon } from "src/lib/core/functions";
  import HourlyWeather from "../components/HourlyWeather.svelte";
  export let ta;
  export let skyState;
</script>

<section>
  {#each skyState as state, i}
    {#if ta[i - 1]}
      <HourlyWeather
        ta={ta[i - 1]?.value}
        skyState={state.description}
        time={state?.period}
      >
        <svelte:fragment slot="icon">
          {@html getWeatherIcon(state.description)}
        </svelte:fragment>
      </HourlyWeather>
    {/if}
  {/each}
</section>

<style>
  section {
    grid-area: daily-weather;
    display: flex;
    flex-direction: row;
    column-gap: 0.5rem;
    overflow-x: scroll;
  }
</style>
