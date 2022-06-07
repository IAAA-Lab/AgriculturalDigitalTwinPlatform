import React, { useState } from "react";
import { Header } from "./components/Header";
import { NotificationsLayer } from "./components/NotificationsLayer";

type Props = {
  children: React.ReactNode;
};

export const LayoutDefault = ({ children }: Props) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <Header />
      <main className="site-content">{children}</main>
      {/* <Footer /> */}
      {/* <button onClick={() => setShow(!show)}>Toggle</button> */}
      <NotificationsLayer show={show} setShow={setShow} />
    </>
  );
};
