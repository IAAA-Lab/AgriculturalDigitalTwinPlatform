import Skeleton from "react-loading-skeleton";

export const CardAnalysisSkeleton = () => (
  <div className="card-analysis mb-16">
    <Skeleton height={20} width={150} />

    <div
      className="row space-between"
      style={{
        width: "100%",
      }}
    >
      <div
        className="center-content mr-8"
        style={{
          width: "100%",
        }}
      >
        <Skeleton style={{ maxWidth: 100, height: 100 }} />
      </div>
      <Skeleton height={20} width={100} count={3} />
    </div>
  </div>
);
