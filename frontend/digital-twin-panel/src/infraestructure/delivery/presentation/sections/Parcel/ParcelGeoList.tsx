import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { Enclosure } from "../../../../../core/Domain";
import { getColorList } from "../../../PortsImpl";

type Props = {
  enclosures?: Enclosure[];
  showList: boolean;
};

export const ParcelGeoList = ({ enclosures, showList = false }: Props) => {
  const navigation = useNavigate();

  const colorList = getColorList(enclosures?.length ?? 0);

  const className = classNames("geo-list", showList && "is-closed");

  const _enclosures = enclosures?.map((enclosure, i) => {
    const mapIcon = document
      .getElementsByClassName("leaflet-tooltip-parcel-map")
      .item(i);
    return (
      <div
        className="geo-list-item has-bottom-divider"
        key={enclosure.id}
        onClick={() => navigation(`${enclosure.id}`)}
        onMouseOver={() => {
          mapIcon?.classList.add("isHovered");
        }}
        onMouseLeave={() => {
          mapIcon?.classList.remove("isHovered");
        }}
      >
        <div className="row">
          <div
            style={{
              background: `${colorList[i]}`,
              width: 10,
              height: 30,
              border: "1px solid #CACACA",
              borderRadius: 4,
            }}
          />
          <img
            src={
              "https://images.unsplash.com/photo-1558871585-4c3574a1b7cd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmllbGRzfGVufDB8fDB8fA%3D%3D&w=1000&q=80"
            }
            className="ml-8 mr-8"
            alt="marker"
            width={50}
            height={50}
          />
          <div className="col">
            <p className="text-sm m-0">{enclosure.id}</p>
          </div>
        </div>
      </div>
    );
  });

  return <div className={className}>{_enclosures}</div>;
};
