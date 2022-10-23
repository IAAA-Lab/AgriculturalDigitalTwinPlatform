<script>
  import { CupertinoPane } from "cupertino-pane";
  import { onMount } from "svelte";
  import Search from "../sections/Search.svelte";

  const settings = {
    darkMode: true,
    upperThanTop: true,
    buttonDestroy: false,
  };

  let summaryPopup;

  onMount(async () => {
    summaryPopup = await new CupertinoPane(".search-pop-up", settings).present({
      animate: true,
      transition: {
        duration: 0.2,
      },
    });
    summaryPopup.disableDrag();
    summaryPopup.moveToBreak("bottom");
    // As drag doesn`t work correctly, we can move it by pressing the ---- button on top
    document.querySelector(".draggable").addEventListener("click", () => {
      if (summaryPopup.currentBreak() === "bottom") {
        summaryPopup.moveToBreak("top");
      } else {
        summaryPopup.moveToBreak("bottom");
      }
    });
    // Destroy instance when component is destroyed
    return () => summaryPopup.destroy();
  });
</script>

<div class="search-pop-up mt-16">
  <Search />
</div>

<style>
  .search-pop-up {
    position: absolute;
    width: 100%;
  }
</style>
