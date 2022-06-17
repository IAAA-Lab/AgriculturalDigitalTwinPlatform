import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  Legend,
  Pie,
  Label,
  Cell,
  PieChart,
} from "recharts";
import { numberWithCommas } from "../../PortsImpl";

type Props = {
  data?: AreasPerUser;
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export const PieChartCard = ({ data }: Props) => {
  const [selectedOption, setSelectedOption] = useState<string>();

  useEffect(() => {
    setSelectedOption(data?.features.distinctCharacteristics[0]);
  }, [data]);

  const areaData = data?.areas.flatMap((area) =>
    area.characteristics.flatMap((feature) => {
      return feature.name === selectedOption
        ? {
            name: area.name,
            value: feature.value,
            unit: feature.unit,
          }
        : [];
    })
  );

  const currentCommonInfo = data?.features.characteristics.find(
    (e) => e.name === selectedOption
  );

  return (
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
        <PieChart>
          <Legend
            layout="vertical"
            verticalAlign="middle"
            iconType="circle"
            iconSize={5}
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
            cornerRadius={3}
            innerRadius={"70%"}
            outerRadius={"80%"}
            animationDuration={400}
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
                stroke="0"
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
