export const ErrorPage = () => {
  return (
    <section className="hero section">
      <div className="center-content">
        <h2>Error al cargar el contenido</h2>
        <p className="text-sm m-0">
          Es posible que necesite añadir alguna parcela a su lista disponible.
        </p>
        <p className="text-sm">
          Contacte con su administrador o pruebe en otro momento.
        </p>
        <p>
          <button onClick={() => window.location.reload()}>
            Recargar página
          </button>
        </p>
        <img
          src={require("../../../../app/assets/images/sad-tree.jpg")}
          alt="404"
          width={"100%"}
          style={{ maxWidth: "500px" }}
          className="has-shadow"
        />
      </div>
    </section>
  );
};
