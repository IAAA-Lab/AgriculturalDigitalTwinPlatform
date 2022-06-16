import { PieChartCard } from "../components/PieChartCard";

type Props = {
  data?: AreasPerUser;
};

export const HomeAnalysisCards = ({ data }: Props) => {
  return (
    <>
      <h3 className="m-0">Resumen actual</h3>
      <p className="text-sm mb-8">
        Actualizaciones al momento del estado de los campos
      </p>
      <PieChartCard data={data} />
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
