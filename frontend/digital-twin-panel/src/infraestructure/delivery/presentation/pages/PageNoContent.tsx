import { SpinnerDotted } from "spinners-react";

export const PageNoContent = () => (
  <section>
    <div className="center-content">
      <h3>Cargando...</h3>
      <p className="text-sm">Si la cosa se pone lenta recarga la página</p>
      <br />
      <br />
      <SpinnerDotted size={70} />
    </div>
  </section>
);
