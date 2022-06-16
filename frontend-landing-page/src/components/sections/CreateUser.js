import React, { useState } from "react";
import { usersService } from "../../api/users";
import { Roles } from "../../config/roles";
import Modal from "../elements/Modal";

export const CreateUser = ({ show = false, closeModal }) => {
  const [postError, setPostError] = useState(false);
  const createUser = async (e) => {
    e.preventDefault();
    const { name, password, role } = e.target;
    const response = await usersService.createUser(
      name.value,
      password.value,
      role.value
    );
    if (!response) {
      setPostError(true);
      showNotificationError();
    } else {
      setPostError(false);
      closeModal(e);
    }
  };

  const showNotificationError = () => {
    setPostError(true);
    setTimeout(() => {
      setPostError(false);
    }, 5000);
  };

  return (
    <Modal show={show} handleClose={closeModal}>
      <section>
        <div className="container-sm mb-16">
          <h4>Nuevo usuario</h4>
          <form className="tiles-col" onSubmit={createUser}>
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
      {postError && (
        <div className="notification-error text-xs fw-500 m-16">
          Error al crear usuario
        </div>
      )}
    </Modal>
  );
};
