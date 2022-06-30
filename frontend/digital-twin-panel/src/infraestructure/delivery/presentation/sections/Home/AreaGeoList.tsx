import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { Area } from "../../../../../core/Domain";

type Props = {
  areaList?: Area[];
  showList: boolean;
};

export const GeoList = ({ areaList, showList = false }: Props) => {
  const navigation = useNavigate();

  const className = classNames("geo-list", showList && "is-closed");

  const _areaList = areaList?.map((area: Area, i: number) => {
    const mapIcon = document
      .getElementsByClassName("leaflet-marker-icon")
      .item(i);
    return (
      <div
        className="geo-list-item has-bottom-divider"
        key={area.id}
        onClick={() => navigation("/area")}
        onMouseOver={() => mapIcon?.classList.add("isHovered")}
        onMouseLeave={() => mapIcon?.classList.remove("isHovered")}
      >
        <div className="row">
          <img
            src={
              "https://images.unsplash.com/photo-1558871585-4c3574a1b7cd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmllbGRzfGVufDB8fDB8fA%3D%3D&w=1000&q=80"
            }
            className="mr-8"
            alt="marker"
            width={50}
            height={50}
          />
          <div className="col">
            <p className="text-sm m-0">{area.name}</p>
          </div>
        </div>
      </div>
    );
  });

  return <div className={className}>{_areaList}</div>;
};
