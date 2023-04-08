<script>
  import Error from "src/lib/infraestructure/presentation/components/misc/Error.svelte";
  import Loading from "src/lib/infraestructure/presentation/components/misc/Loading.svelte";
  import { enclosuresService } from "src/app/config/config";
  import EnclosureMap from "../components/EnclosureMap.svelte";

  export let enclosureId;
</script>

{#await enclosuresService.getEnclosures([enclosureId])}
  <Loading />
{:then enclosures}
  {@const enclosure = enclosures.at(0)}
  {#if !enclosure}
    <Error />
  {:else}
    <EnclosureMap {enclosure} />
  {/if}
{:catch}
  <Error />
{/await}
