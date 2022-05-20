import React from "react";
import { Roles } from "../../config/roles";
import Modal from "../elements/Modal";

export const CreateUser = ({ show = false }) => {
  return (
    <Modal show={show}>
      <section>
        <div className="container-sm mb-16">
          <h4>Nuevo usuario</h4>
          <form className="tiles-col" onSubmit={(e) => e.preventDefault()}>
            <label className="text-xs" htmlFor="name">
              Nombre
            </label>
            <input className="text-xxs form-input-sm" type="text" name="name" />
            <label className="text-xs" htmlFor="password">
              Contraseña
            </label>
            <input
              className="text-xxs form-input-sm"
              type="password"
              name="password"
            />
            <label className="text-xs" htmlFor="role">
              Rol
            </label>
            <select className="text-xxs form-input-sm" name="role">
              <option value={Roles.ADMIN}>Admin</option>
              <option value={Roles.AGRARIAN_USER}>Usuario agrario</option>
              <option value={Roles.NEWS_ADMIN}>Admin noticias</option>
            </select>
            <button className="button button-primary button-wide-mobile button-sm mt-16">
              Crear
            </button>
          </form>
        </div>
      </section>
    </Modal>
  );
};
