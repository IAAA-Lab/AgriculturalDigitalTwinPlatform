import React, { useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const propTypes = {
  children: PropTypes.node,
  handleClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  closeHidden: PropTypes.bool,
};

const defaultProps = {
  children: null,
  show: false,
  closeHidden: false,
};

const Modal = ({
  className,
  children,
  handleClose,
  show,
  closeHidden,
  ...props
}) => {
  useEffect(() => {
    handleBodyClass();
  }, [props.show]);

  const handleBodyClass = () => {
    if (document.querySelectorAll(".modal.is-active").length) {
      document.body.classList.add("modal-is-active");
    } else {
      document.body.classList.remove("modal-is-active");
    }
  };

  const stopProgagation = (e) => {
    e.stopPropagation();
  };

  const classes = classNames("modal", show && "is-active", className);

  return (
    <>
      {show && (
        <div {...props} className={classes} onClick={handleClose}>
          <div className="modal-inner" onClick={stopProgagation}>
            <button
              className="modal-close"
              aria-label="close"
              onClick={handleClose}
            />
            {children}
          </div>
        </div>
      )}
    </>
  );
};

Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

export default Modal;
