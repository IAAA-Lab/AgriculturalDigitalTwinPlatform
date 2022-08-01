import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { Parcel } from "../../../../../core/Domain";
import { getColorList } from "../../../PortsImpl";

type Props = {
  parcelList?: Parcel[];
  showList: boolean;
};

export const HomeGeoList = ({ parcelList, showList = false }: Props) => {
  const navigation = useNavigate();

  const colorList = getColorList(parcelList?.length ?? 0);

  const className = classNames("geo-list", showList && "is-closed");

  const _parcelList = parcelList?.map((area: Parcel, i: number) => {
    const mapIcon = document
      .getElementsByClassName("leaflet-marker-icon")
      .item(i);
    const popUp = document
      .getElementsByClassName("leaflet-tooltip-home-map")
      .item(i);
    return (
      <div
        className="geo-list-item has-bottom-divider"
        key={area.id}
        onClick={() => navigation(`${area.id}`)}
        onMouseOver={() => {
          mapIcon?.classList.add("isHovered");
          popUp?.classList.add("isHovered");
        }}
        onMouseLeave={() => {
          mapIcon?.classList.remove("isHovered");
          popUp?.classList.remove("isHovered");
        }}
      >
        <div className="row">
          <div
            style={{
              background: `${colorList[i]}`,
              width: 10,
              height: 30,
              border: "1px solid #CACACA",
              borderRadius: 3,
            }}
            className="mr-8"
          />
          <div className="col">
            <p className="text-sm m-0">{area.id}</p>
          </div>
        </div>
      </div>
    );
  });

  return <div className={className}>{_parcelList}</div>;
};
