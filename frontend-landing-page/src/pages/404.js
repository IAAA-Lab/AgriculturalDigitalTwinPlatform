import React from "react";
import { Link } from "react-router-dom";
import Image from "../components/elements/Image";

export const Page404 = () => (
  <section className="hero section">
    <div className="container-sm center-content">
      <h1>Error 404 - No encontrado</h1>
      <p className="text-sm">La página que estás buscando no existe.</p>
      <p>
        <Link to="/">Volver</Link>
      </p>
      <Image src={require("../assets/images/404.png")} alt="404" width={400} />
    </div>
  </section>
);
