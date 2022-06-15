import { relative } from "path";
import { useEffect, useState } from "react";
import {
  Cell,
  Label,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";
import { numberWithCommas } from "../../PortsImpl";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

type Props = {
  data?: AreasPerUser;
};

export const HomeAnalysisCards = ({ data }: Props) => {
  const [selectedOption, setSelectedOption] = useState<string>();

  useEffect(() => {
    setSelectedOption(data?.features.distinctCharacteristics[0]);
  }, [data]);

  const areaData = data?.areas.flatMap((area) =>
    area.characteristics.flatMap((feature) => {
      if (feature.name === selectedOption)
        return {
          name: area.name,
          value: feature.value,
          unit: feature.unit,
        };
      else return [];
    })
  );

  const currentCommonInfo = data?.features.characteristics.find(
    (e) => e.name === selectedOption
  );

  return (
    <>
      <div className="card-analysis reveal-from-bottom mb-16 col">
        <select
          onChange={(e) => setSelectedOption(e.currentTarget.value)}
          value={selectedOption}
        >
          {data?.features.distinctCharacteristics.map((e, i) => (
            <option key={i} value={e}>
              {e}
            </option>
          ))}
        </select>
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <PieChart
            margin={{
              left: 0,
              right: 80,
            }}
          >
            <Legend
              layout="vertical"
              verticalAlign="middle"
              iconType="circle"
              iconSize={7}
              align="right"
              payload={areaData?.map((item, index) => ({
                id: item.name,
                type: "circle",
                value: `${item.name} - ${numberWithCommas(item.value)} ${
                  item.unit ?? ""
                }`,
                color: COLORS[index % COLORS.length],
              }))}
            />
            <Pie
              data={areaData}
              paddingAngle={3}
              dataKey="value"
              cx={"50%"}
              cy={"50%"}
              innerRadius={"65%"}
              outerRadius={"80%"}
            >
              <Label
                fill="#232d36"
                value={`${numberWithCommas(currentCommonInfo?.value)} ${
                  currentCommonInfo?.unit ?? ""
                }`}
                position="center"
              />
              {areaData?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div
        className="card-analysis reveal-from-bottom mb-16"
        data-reveal-delay={100}
      ></div>
      <div
        className="card-analysis reveal-from-bottom mb-16"
        data-reveal-delay={200}
      ></div>
      <div className="card-analysis mb-16"></div>
      <div className="card-analysis mb-16"></div>
      <div className="card-analysis mb-16"></div>
      <div className="card-analysis mb-16"></div>
    </>
  );
};
