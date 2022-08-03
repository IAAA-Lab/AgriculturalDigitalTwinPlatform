import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LANDING_URL } from "../../../../../app/config/constants";
import {
  doToggleNotifications,
  doToggleWeather,
} from "../../../../../app/config/context/redux/app-actions";
import { useTypedDispatch } from "../../../../../app/config/context/redux/app-store";
import Breadcrumb from "../../components/Breadcrumb";
import UserOptions from "./UserOptions";

export const Header = () => {
  const dispatch = useTypedDispatch();

  return (
    <header className="site-header">
      <div className="container">
        <div className="site-header-inner">
          <a href={LANDING_URL!}>
            <img
              className="mt-8"
              src={require("../../../../../app/assets/images/logo.png")}
              alt="Home"
              width={50}
              height={50}
            />
          </a>
          <Breadcrumb />
          <nav className="header-nav">
            <div className="header-nav-inner">
              <ul className="header-nav-right text-sm">
                <li>
                  <div onClick={() => dispatch(doToggleWeather())}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="25"
                      height="25"
                    >
                      <path d="M13.892,24c-1.96,0-3.837-.008-4.491-.026a3.749,3.749,0,0,1-.834-.121,3.5,3.5,0,0,1-.449-6.588,6.366,6.366,0,0,1,.057-2.732,6,6,0,0,1,11.368-.855c.136.326.286.36.587.427l.176.042h0a5.014,5.014,0,0,1,3.559,6,4.951,4.951,0,0,1-3.7,3.7,5.283,5.283,0,0,1-1.064.131C18.229,23.99,16.013,24,13.892,24Zm.09-12.023a4.045,4.045,0,0,0-.589.043A3.994,3.994,0,0,0,10.087,16.8,2.017,2.017,0,0,1,8.907,19.1a1.494,1.494,0,0,0-.851,1.8,1.473,1.473,0,0,0,1.02,1.019,1.673,1.673,0,0,0,.382.057c1.342.036,7.945.03,9.6,0a3.234,3.234,0,0,0,.657-.081,2.977,2.977,0,0,0,2.2-2.193,3.023,3.023,0,0,0-2.132-3.622l-.092-.021a2.582,2.582,0,0,1-2-1.611A4.013,4.013,0,0,0,13.982,11.977ZM2.28,16.894a1,1,0,0,1-.512-1.86l2.709-1.612a.5.5,0,0,0,.3-.54,6.425,6.425,0,0,1-.2-.882H1a1,1,0,0,1,0-2H4.575a6.206,6.206,0,0,1,.387-1.4l-3.078-1.8a1,1,0,1,1,1.01-1.725l3.1,1.814a6.718,6.718,0,0,1,.951-.934L5.11,2.854a1,1,0,0,1,1.721-1.02L8.674,4.943A6.5,6.5,0,0,1,10,4.58V1a1,1,0,0,1,2,0V4.577a6.137,6.137,0,0,1,1.384.386l1.823-3.115a1,1,0,0,1,1.727,1.011L15.091,6.005c.427.274.717,1,1.27.717L19,4.972a1,1,0,1,1,1.1,1.668L17.416,8.42a2.511,2.511,0,0,1-3.147-.442A4.7,4.7,0,0,0,10.986,6.5,4.692,4.692,0,0,0,6.5,11.023,4.115,4.115,0,0,0,6.691,12.3,2.462,2.462,0,0,1,5.46,15.163l-2.669,1.59A1,1,0,0,1,2.28,16.894Z" />
                    </svg>
                  </div>
                </li>
                <li>
                  <div onClick={() => dispatch(doToggleNotifications())}>
                    <div className="badge-wrapper">
                      <span className="badge-notification">
                        <p className="text-xxs m-0">1</p>
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="25"
                        height="25"
                      >
                        <g id="_01_align_center" data-name="01 align center">
                          <path d="M23.259,16.2l-2.6-9.371A9.321,9.321,0,0,0,2.576,7.3L.565,16.35A3,3,0,0,0,3.493,20H7.1a5,5,0,0,0,9.8,0h3.47a3,3,0,0,0,2.89-3.8ZM12,22a3,3,0,0,1-2.816-2h5.632A3,3,0,0,1,12,22Zm9.165-4.395a.993.993,0,0,1-.8.395H3.493a1,1,0,0,1-.976-1.217l2.011-9.05a7.321,7.321,0,0,1,14.2-.372l2.6,9.371A.993.993,0,0,1,21.165,17.605Z" />
                        </g>
                      </svg>
                    </div>
                  </div>
                </li>
                <li>
                  <UserOptions />
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
