<script>
  export let component;
</script>

{#await component then { default: Component }}
  <Component />
{/await}
