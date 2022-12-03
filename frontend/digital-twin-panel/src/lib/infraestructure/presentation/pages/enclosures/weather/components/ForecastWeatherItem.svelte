<div class="item">
  <p class="m-0 text-sm">Hoy</p>
  <i class="fas fa-cloud-sun-rain" />
  <p class="m-0 text-sm">18 °C</p>
  <div class="bar" />
  <p class="m-0 text-sm">24 °C</p>
</div>

<style>
  .item {
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 2rem;
    white-space: nowrap;
    min-width: 350px;
  }

  .bar {
    background: linear-gradient(
      90deg,
      rgba(31, 31, 73, 1) 0%,
      rgba(17, 17, 161, 1) 36%,
      rgba(255, 0, 0, 1) 100%
    );
    height: 10px;
    width: 120px;
    border-radius: 5px;
  }
</style>
