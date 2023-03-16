import React, { useState, useRef, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Link } from "react-router-dom";
import Logo from "./partials/Logo";
import Button from "../elements/Button";
import AuthContext from "../../context/contexts";
import { authService } from "../../api/auth";

const propTypes = {
  navPosition: PropTypes.string,
  hideNav: PropTypes.bool,
  hideSignin: PropTypes.bool,
  bottomOuterDivider: PropTypes.bool,
  bottomDivider: PropTypes.bool,
  handleOpen: PropTypes.func.isRequired,
  buttonList: PropTypes.array,
};

const defaultProps = {
  navPosition: "",
  hideNav: false,
  hideSignin: false,
  bottomOuterDivider: false,
  bottomDivider: false,
  buttonList: [],
};

const Header = ({
  className,
  navPosition,
  hideNav,
  hideSignin,
  bottomOuterDivider,
  bottomDivider,
  handleOpen,
  buttonList,
  ...props
}) => {
  const [isActive, setIsactive] = useState(false);
  const auth = useContext(AuthContext);
  const nav = useRef(null);
  const hamburger = useRef(null);

  const location = window.location.pathname;

  useEffect(() => {
    isActive && openMenu();
    document.addEventListener("keydown", keyPress);
    document.addEventListener("click", clickOutside);
    return () => {
      document.removeEventListener("keydown", keyPress);
      document.removeEventListener("click", clickOutside);
      closeMenu();
    };
  });

  const openMenu = () => {
    document.body.classList.add("off-nav-is-active");
    nav.current.style.maxHeight = nav.current.scrollHeight + "px";
    setIsactive(true);
  };

  const closeMenu = () => {
    document.body.classList.remove("off-nav-is-active");
    nav.current && (nav.current.style.maxHeight = null);
    setIsactive(false);
  };

  const keyPress = (e) => {
    isActive && e.keyCode === 27 && closeMenu();
  };

  const clickOutside = (e) => {
    if (!nav.current) return;
    if (
      !isActive ||
      nav.current.contains(e.target) ||
      e.target === hamburger.current
    )
      return;
    closeMenu();
  };

  const scrollToSection = (sectionName) => {
    const section = document.getElementById(sectionName);
    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  };

  const classes = classNames(
    "site-header",
    bottomOuterDivider && "has-bottom-divider",
    className
  );

  const loginButtonClasses = classNames(
    auth.usr.logged ? "button-secondary" : "button-primary",
    "button button-wide-mobile button-sm"
  );

  return (
    <header {...props} className={classes}>
      <div className="container">
        <div
          className={classNames(
            "site-header-inner",
            bottomDivider && "has-bottom-divider"
          )}
        >
          <Logo />
          {!hideNav && (
            <>
              <button
                ref={hamburger}
                className="header-nav-toggle"
                onClick={isActive ? closeMenu : openMenu}
              >
                <span className="screen-reader">Menu</span>
                <span className="hamburger">
                  <span className="hamburger-inner"></span>
                </span>
              </button>
              <nav
                ref={nav}
                className={classNames("header-nav", isActive && "is-active")}
              >
                <div className="header-nav-inner">
                  {buttonList.map(
                    ({ path, name, ref }, i) =>
                      name && (
                        <ul
                          className={classNames(
                            "list-reset text-xs",
                            navPosition && `header-nav-${navPosition}`
                          )}
                          key={i}
                        >
                          <li>
                            {path ? (
                              <Link to={path} onClick={closeMenu}>
                                {name}
                              </Link>
                            ) : (
                              location === "/" && (
                                <a onClick={() => scrollToSection(ref)}>
                                  {name}
                                </a>
                              )
                            )}
                          </li>
                        </ul>
                      )
                  )}
                  {!hideSignin && (
                    <ul className="list-reset header-nav-right">
                      <li>
                        <Button
                          className={loginButtonClasses}
                          onClick={async (e) => {
                            if (auth.usr.logged) {
                              await authService.logout();
                              auth.actions.logout();
                              closeMenu();
                            } else {
                              handleOpen(e);
                              closeMenu();
                            }
                          }}
                        >
                          {auth.usr.logged ? "Salir" : "Acceder"}
                        </Button>
                      </li>
                    </ul>
                  )}
                </div>
              </nav>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
