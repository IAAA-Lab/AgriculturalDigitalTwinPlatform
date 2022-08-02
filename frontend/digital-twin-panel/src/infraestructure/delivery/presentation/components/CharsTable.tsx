import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { TableDataOptions } from "../../../../core/Domain";
import { numberWithCommas } from "../../PortsImpl";
import { FeaturesSkeleton } from "./FeaturesSkeleton";

type Props = {
  data?: TableDataOptions;
};

export const CharsTable = ({ data }: Props) => {
  if (!data) {
    return <FeaturesSkeleton />;
  }

  var columns: any = [
    {
      name: "NOMBRE",
      selector: () => "name",
      grow: 1.5,
      cell: (row: any) => (
        <Link
          to={row["name"].name}
          style={{ color: "#354051", fontWeight: "bold" }}
          className="p-16"
        >
          <span className="row">
            <div
              style={{ background: row["name"].color }}
              className="dot-name mr-8"
            />
            {row["name"].name}
          </span>
        </Link>
      ),
    },
  ];
  var values: any = [];
  data.forEach((e, i) => {
    var value: any;
    e.values.forEach((c, j) => {
      value = {
        ...value,
        [c.name]: numberWithCommas(c.value),
        [c.name + "-val"]: c.value,
        name: e.key,
      };
      if (i === 0) {
        columns = [
          ...columns,
          {
            name: c.name.toLocaleUpperCase(),
            selector: (row: any) => row[c.name + "-val"],
            cell: (row: any) => <span>{row[c.name]}</span>,
            sortable: true,
          },
        ];
      }
    });
    values = [...values, value];
  });

  return (
    <div className="reveal-from-right mb-16">
      <DataTable
        customStyles={{
          tableWrapper: {
            style: {
              opacity: 0.7,
            },
          },
          responsiveWrapper: {
            style: {
              borderRadius: 8,
            },
          },
        }}
        columns={columns}
        data={values}
      />
    </div>
  );
};
