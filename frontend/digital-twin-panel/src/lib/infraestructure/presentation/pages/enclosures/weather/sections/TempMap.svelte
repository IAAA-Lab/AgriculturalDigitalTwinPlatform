<script>
  import WeatherCard from "src/lib/infraestructure/presentation/components/cards/WeatherCard.svelte";
</script>

<section>
  <WeatherCard>
    <div slot="header" class="header mb-16">
      <h3 class="m-0">Mapa de temperaturas</h3>
    </div>
    <div slot="body">
      <img
        src="https://2.bp.blogspot.com/-5O7YIojbkmY/V1wLJF3gMzI/AAAAAAAAYFc/RzqljRkHXXgOAv4EATs0COFukBVRu_6UQCKgB/s1600/Figura01.png"
        alt="Olas de calor"
        width="100%"
      />
    </div>
  </WeatherCard>
</section>

<style>
  section {
    grid-area: temp-map;
  }

  img {
    aspect-ratio: 4/3;
  }
</style>
