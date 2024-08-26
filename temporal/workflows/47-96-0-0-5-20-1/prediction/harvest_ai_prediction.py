from datetime import timedelta
import logging
import math
import numpy as np
from dataclasses import dataclass
from temporalio import workflow, activity
from temporalio.client import Client
from temporalio.worker import Worker
from temporalio.common import RetryPolicy

logging.basicConfig(level=logging.INFO)

with workflow.unsafe.imports_passed_through():
    import pandas as pd


async def get_model():
  import mlflow
  # Get last run id
  # mlflow.set_tracking_uri(os.environ["MLFLOW_TRACKING_URI"])
  mlflow.set_tracking_uri("http://localhost:5000")
  run_id = mlflow.search_runs(experiment_names=["Yield"]).iloc[0].run_id
  # Load model
  model = mlflow.pyfunc.load_model(f"runs:/{run_id}/yield_model")
  return model

@activity.defn()
async def get_data() -> list[dict]:
  from pymongo import MongoClient
  client = MongoClient("mongodb://Hd763nd4873hd3jh:idYtR65bja_56GGVdgd_df87Yh3@localhost:27018/?authMechanism=DEFAULT&authSource=admin")
  database = client["47-96-0-0-5-20-1"]
  # Merge information from different collections
  # Weather
  weather = pd.DataFrame(list(database["Weather"].find()))
  weather = weather.drop(columns=["_id"])
  # NDVI
  ndvi = pd.DataFrame(list(database["NDVI"].find()))
  ndvi = ndvi.drop(columns=["_id"])
  # Activities
  activities = pd.DataFrame(list(database["Activities"].find()))
  activities = activities.drop(columns=["_id"])
  # Merge by date
  data = pd.merge(weather, ndvi, on="date", how="left")
  data = pd.merge(data, activities, on="date", how="left")
  # Drop enclosureId and digital_twin_id
  data = data.drop(columns=["enclosureId", "digital_twin_id"])
  # Rename value by ndvi
  data = data.rename(columns={"value": "ndvi"})
  # Prepare data for a model
  # Aggregate data by year
  data["year"] = data["date"].dt.year
  # Get dates where the yield is not null
  dates = data.dropna(subset=["yield"])[["year", "date"]]
  data = data.groupby("year").agg(
      {
          "height": "first",
          "prec": "sum",
          "tmax": "max",
          "tmin": "min",
          "tmed": "mean",
          "windSpeed": "mean",
          "windGust": "mean",
          "ndvi": "mean",
          "yield": "first"
      }
  )
  # Add dates
  data = data.reset_index()
  data = pd.merge(data, dates, on="year", how="left")
  # Set the date as index
  data = data.set_index("date")
  # Add year, month and day as features
  data["year"] = data.index.year
  data["month"] = data.index.month
  data["day"] = data.index.day
  # Astype categorical features
  data["year"] = data["year"].astype("category")
  data["month"] = data["month"].astype("category")
  data["day"] = data["day"].astype("category")
  # KNNInputation
  from sklearn.impute import KNNImputer
  imputer = KNNImputer(n_neighbors=2)
  data["ndvi"] = imputer.fit_transform(data[["ndvi"]])
  data = data.reset_index()
  # Drop date
  data = data.drop(columns=["date"])
  return data.to_dict(orient="records")

@dataclass
class Input_TrainModel:
    data: list[dict]

@activity.defn()
async def train_model(input: Input_TrainModel) -> None:
  import mlflow
  model = await get_model()
  with mlflow.start_run():
      mlflow.autolog()
      from sklearn.ensemble import RandomForestRegressor
      from sklearn.model_selection import train_test_split
      from sklearn.metrics import mean_squared_error
      data = pd.DataFrame(input.data)
      data = data.dropna(subset=["yield"])
      X = data.drop(columns=["yield", "day", "month", "year"])
      y = data[["yield", "day", "month"]]
      X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, shuffle=False, random_state=123)
      model = RandomForestRegressor(random_state=123)
      model.fit(X_train, y_train)
      y_pred = model.predict(X_test)
      print(f"Predicted vs real yield: {y_pred.ravel()[0]} vs {y_test['yield'].values[0]}")
      # mlflow.log_params({
      #     "n_estimators": model.n_estimators,
      #     "max_depth": model.max_depth
      # })
      mlflow.log_metric("mean_squared_error", mean_squared_error(y_test['yield'].ravel(), y_pred[:,0]))
      # mlflow.sklearn.save_model(model, "model")
      mlflow.sklearn.log_model(sk_model=model,
                              artifact_path="yield_model",
                              input_example=X_train.head(1),
                              registered_model_name="yield_model-random-forest")

@dataclass
class Input_Predict:
    new_data: list[dict]

@activity.defn()
async def predict_yield(input: Input_Predict) -> list:
  model = await get_model()
  # return flatened list
  return model.predict(pd.DataFrame(input.new_data).drop(columns=["yield", "day", "month", "year"])).ravel().tolist()

@dataclass
class Input_Load:
    prediction: float
    prediction_date: str

@activity.defn()
async def load_prediction(input: Input_Load) -> None:
  from pymongo import MongoClient
  client = MongoClient("mongodb://Hd763nd4873hd3jh:idYtR65bja_56GGVdgd_df87Yh3@localhost:27018/?authMechanism=DEFAULT&authSource=admin")
  database = client["47-96-0-0-5-20-1"]
  # Convert prediction date to pd.Timestamp
  prediction_date = pd.Timestamp(input.prediction_date)
  print(f"Prediction: {input.prediction} on {prediction_date}")
  database["Predictions"].update_one({"date": prediction_date}, {"$set": {"yield": input.prediction, "type": "yield"}}, upsert=True)

@workflow.defn
class HarvestAIPredictionWorkflow:
  @workflow.run
  async def run(self):
    data = await workflow.execute_activity(get_data, start_to_close_timeout=timedelta(seconds=15), retry_policy=RetryPolicy(maximum_attempts=2, backoff_coefficient=2))
    prediction = await workflow.execute_activity(predict_yield, Input_Predict(data[-1:]), start_to_close_timeout=timedelta(seconds=5), retry_policy=RetryPolicy(maximum_attempts=1, backoff_coefficient=1))
    prediction_date = f"{math.floor(prediction[1])}-{math.floor(prediction[2])}-{workflow.now().year}"
    await workflow.execute_activity(load_prediction, Input_Load(prediction[0], prediction_date), start_to_close_timeout=timedelta(seconds=5), retry_policy=RetryPolicy(maximum_attempts=1, backoff_coefficient=1))
    await workflow.execute_activity(train_model, Input_TrainModel(data), start_to_close_timeout=timedelta(seconds=15), retry_policy=RetryPolicy(maximum_attempts=2, backoff_coefficient=2))

      
async def main():
    client = await Client.connect("localhost:7233", namespace="47-96-0-0-5-20-1")
    async with Worker(client, task_queue="harvest-ai-prediction-task-queue", workflows=[HarvestAIPredictionWorkflow], activities=[get_data, train_model, predict_yield, load_prediction]):
        await client.execute_workflow(
                HarvestAIPredictionWorkflow.run,
                id=f"harvest-ai-prediction-workflow",
                task_queue="harvest-ai-prediction-task-queue",
                retry_policy=RetryPolicy(maximum_attempts=1)
            )

if __name__ == "__main__":
  import os
  os.environ['MLFLOW_S3_ENDPOINT_URL'] = 'http://localhost:9000'  # Adjust the URL to your MinIO server
  os.environ['AWS_ACCESS_KEY_ID'] = 'minio'
  os.environ['AWS_SECRET_ACCESS_KEY'] = 'minio123'
  import asyncio
  asyncio.run(main())