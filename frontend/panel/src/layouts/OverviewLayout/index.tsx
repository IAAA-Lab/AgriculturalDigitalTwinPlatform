import HeaderC from "content/applications/Overview/Header";
import { FC } from "react";
import PropTypes from "prop-types";
import { Outlet } from "react-router";

interface OverviewLayoutProps {
  children?: React.ReactNode;
}

const OverviewLayout: FC<OverviewLayoutProps> = ({ children }) => {
  return (
    <>
      <HeaderC />
      {children || <Outlet />}
    </>
  );
};

OverviewLayout.propTypes = {
  children: PropTypes.node,
};

export default OverviewLayout;
