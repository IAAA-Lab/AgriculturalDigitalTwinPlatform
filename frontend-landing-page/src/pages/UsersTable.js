import React, { useEffect, useState } from "react";
import { SpinnerDotted } from "spinners-react";
import { usersService } from "../api/users";
import { CreateUser } from "../components/sections/CreateUser";

export const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isCreateUserModalActive, setIsCreateUserModalActive] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const closeModal = (e) => {
    e.preventDefault();
    setIsCreateUserModalActive(false);
    fetchData();
  };

  const fetchData = async () => {
    setIsLoading(true);
    setIsError(false);
    const result = await usersService.fetchAllUsers();
    if (result === null) {
      setIsError(true);
    } else {
      setUsers(result);
    }
    setIsLoading(false);
  };

  if (isError) {
    return <p>Algo fue mal...</p>;
  }

  if (isLoading) {
    return (
      <div className="spinner-container">
        <SpinnerDotted size={65} />
      </div>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <>
          <h3 className="text-2xl font-bold">Panel de usuarios</h3>
          <button
            className="button button-primary button-wide-mobile"
            onClick={() => {
              setIsCreateUserModalActive(true);
            }}
          >
            Añadir usuario
          </button>
        </>
        <div className="table-wrap mt-16">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(({ ID, Role, Username }) => (
                <tr key={ID}>
                  <td>{Username}</td>
                  <td>{Role}</td>
                  <td>
                    <div className="button-group">
                      <button
                        style={{ cursor: "pointer" }}
                        className="button-secondary"
                        onClick={() => {
                          //window.location.href = `/users/${user.id}`;
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="button-delete"
                        style={{ cursor: "pointer" }}
                        onClick={async () => {
                          await usersService.deleteUser(ID);
                          setUsers(users.filter((u) => u.ID !== ID));
                        }}
                      >
                        Borrar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CreateUser show={isCreateUserModalActive} closeModal={closeModal} />
    </section>
  );
};
