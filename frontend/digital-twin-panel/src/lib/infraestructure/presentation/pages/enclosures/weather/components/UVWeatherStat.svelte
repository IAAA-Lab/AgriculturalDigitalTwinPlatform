<script>
  import Range from "src/lib/infraestructure/presentation/components/misc/Range.svelte";
  import WeatherStat from "./WeatherStat.svelte";

  const UV_MAX = 11;
</script>

<div class="uv">
  <WeatherStat title="UV">
    <i slot="header-icon" class="fi fi-rr-sun pt-4" />
    <div slot="body" class="body">
      <Range
        value={5}
        height={10}
        to={UV_MAX}
        background="linear-gradient(
        90deg,
        rgba(255, 0, 0, 1) 0%,
        rgba(255, 154, 0, 1) 10%,
        rgba(208, 222, 33, 1) 20%,
        rgba(79, 220, 74, 1) 30%,
        rgba(63, 218, 216, 1) 40%,
        rgba(47, 201, 226, 1) 50%,
        rgba(28, 127, 238, 1) 60%,
        rgba(95, 21, 242, 1) 70%,
        rgba(186, 12, 248, 1) 80%,
        rgba(251, 7, 217, 1) 90%,
        rgba(255, 0, 0, 1) 100%
    )"
      />
      <p class="text-sm m-0"><strong>5</strong></p>
    </div>
  </WeatherStat>
</div>

<style>
  .body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
  }

  .uv {
    grid-area: uv;
  }
</style>
