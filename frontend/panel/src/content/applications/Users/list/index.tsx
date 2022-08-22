import { Helmet } from "react-helmet-async";

import UsersTable from "./UsersTable";

const Users = () => {
  return (
    <>
      <Helmet>
        <title>Usuarios - Cuentas</title>
      </Helmet>
      <UsersTable />
    </>
  );
};

export default Users;
