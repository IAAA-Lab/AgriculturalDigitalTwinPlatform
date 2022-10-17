<script>
  export let checked = false;
</script>

<label class="switch">
  <input type="checkbox" bind:checked />
  <span class="slider" />
</label>

<style lang="scss">
  /* The switch - the box around the slider */
  .switch {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 20px;
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  input:checked + .slider {
    background-color: color(error);
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196f3;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(19px);
    -ms-transform: translateX(19px);
    transform: translateX(19px);
  }

  /* Rounded sliders */
  .slider {
    border-radius: 6px;
    background-color: color(success);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    cursor: pointer;

    &:before {
      position: absolute;
      content: "";
      height: 15px;
      width: 15px;
      left: 3px;
      bottom: 2.5px;
      border-radius: 3px;
      background-color: white;
      -webkit-transition: 0.4s;
      transition: 0.4s;
    }
  }
</style>
