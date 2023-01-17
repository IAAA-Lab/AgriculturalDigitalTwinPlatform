import React, { useContext, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Modal from "../components/elements/Modal";
import { Login } from "../components/sections/Login";
import getRoutes from "../utils/routes";
import { Roles } from "../config/roles";
import AuthContext from "../context/contexts";

const LayoutAdmin = ({ children }) => {
  const [videoModalActive, setVideomodalactive] = useState(false);
  const user = useContext(AuthContext).usr;
  console.log({ children });

  const openModal = (e) => {
    e.preventDefault();
    setVideomodalactive(true);
  };

  const closeModal = (e) => {
    e.preventDefault();
    setVideomodalactive(false);
  };

  return (
    <>
      <Header
        navPosition="right"
        className="reveal-from-bottom"
        handleOpen={openModal}
        buttonList={getRoutes(user)}
      />
      <main className="site-content">{children}</main>
      <Footer />
      <Modal id="login-modal" show={videoModalActive} handleClose={closeModal}>
        <Login closeModal={closeModal} />
      </Modal>
    </>
  );
};

export default LayoutAdmin;
