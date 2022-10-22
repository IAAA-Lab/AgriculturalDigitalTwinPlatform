<script>
  import { CupertinoPane } from "cupertino-pane";
  import { onDestroy, onMount } from "svelte";
  import Search from "../sections/Search.svelte";

  const settings = {
    darkMode: true,
    backdrop: true,
    upperThanTop: true,
    buttonDestroy: false,
  };

  let summaryPopup;

  onMount(async () => {
    summaryPopup = new CupertinoPane(".search-pop-up", settings);
    summaryPopup.present({ animate: true });
    summaryPopup.disableDrag();
    document.querySelector(".draggable").addEventListener("click", () => {
      if (summaryPopup.currentBreak() === "bottom") {
        summaryPopup.backdrop({ show: true });
        summaryPopup.moveToBreak("top");
      } else {
        summaryPopup.backdrop({ show: false });
        summaryPopup.moveToBreak("bottom");
      }
    });
  });

  onDestroy(() => {
    summaryPopup.destroy();
  });
</script>

<div class="search-pop-up mt-16">
  <Search />
</div>
