import Skeleton from "react-loading-skeleton";

export const FeaturesSkeleton = () => (
  <div className="card-tiles reveal-from-left">
    {Array(4)
      .fill(1)
      .map((index) => (
        <div className="card-tiles-item" key={index}>
          <div className="card-features">
            <div className="col">
              <Skeleton height={15} width={100} />
              <div className="row space-between">
                <div className="row pr-32">
                  <Skeleton height={30} width={60} />
                </div>
                <Skeleton height={15} width={40} />
              </div>
            </div>
          </div>
        </div>
      ))}
  </div>
);
