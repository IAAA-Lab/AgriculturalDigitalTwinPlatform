from prefect import flow, task
import mlflow
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import ElasticNet
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

def eval_metrics(actual, pred):
    rmse = np.sqrt(mean_squared_error(actual, pred))
    mae = mean_absolute_error(actual, pred)
    r2 = r2_score(actual, pred)
    return rmse, mae, r2

@task
def extract():
    csv_url = "http://archive.ics.uci.edu/ml/machine-learning-databases/wine-quality/winequality-red.csv"
    data = pd.read_csv(csv_url, sep=";")
    return data


@task
def transform(data):
    train, test = train_test_split(data)
    train_x = train.drop(["quality"], axis=1)
    test_x = test.drop(["quality"], axis=1)
    train_y = train[["quality"]]
    test_y = test[["quality"]]
    return train_x, test_x, train_y, test_y


@task
def train(train_x, test_x, train_y, test_y, alpha=0.5, l1_ratio=0.5):
    np.random.seed(40)
    try:
        mlflow.create_experiment("test", artifact_location="s3://mlflow")
    except:
        pass
    mlflow.set_experiment("test")
    # Useful for multiple runs
    with mlflow.start_run():
        # Execute ElasticNet
        lr = ElasticNet(alpha=alpha, l1_ratio=l1_ratio, random_state=42)
        lr.fit(train_x, train_y)
        # Evaluate Metrics
        predicted_qualities = lr.predict(test_x)
        (rmse, mae, r2) = eval_metrics(test_y, predicted_qualities)
        # Print out metrics
        print("Elasticnet model (alpha=%f, l1_ratio=%f):" % (alpha, l1_ratio))
        print("  RMSE: %s" % rmse)
        print("  MAE: %s" % mae)
        print("  R2: %s" % r2)
        # Log parameter, metrics, and model to MLflow
        mlflow.log_param("alpha", alpha)
        mlflow.log_param("l1_ratio", l1_ratio)
        mlflow.log_metric("rmse", rmse)
        mlflow.log_metric("r2", r2)
        mlflow.log_metric("mae", mae)
        mlflow.sklearn.log_model(lr, "model")
        mlflow.sklearn.log_model(
            sk_model=lr, artifact_path="model", registered_model_name="wine-quality")


# Event driven flow to train the model periodically, managed by Prefect
@flow
def train_with_model_registry(alpha, l1_ratio):
    data = extract()
    train_x, test_x, train_y, test_y = transform(data)
    train(train_x, test_x, train_y, test_y, alpha, l1_ratio)


if __name__ == '__main__':
    train_with_model_registry(0.75, 0.75)

    # mlflow models serve -m s3://mlflow/9e4b4de742524aae80ff951fe85d6bf0/artifacts/model --env-manager local -p 5001 --host 0.0.0.0


# curl http://127.0.0.1:5001/invocations -H 'Content-Type: application/json' -d '{"dataframe_split": {"columns":["fixed acidity","volatile acidity","citric acid","residual sugar","chlorides","free sulfur dioxide","total sulfur dioxide","density","pH","sulphates","alcohol"],"data":[[12.8, 0.029, 0.48, 0.98, 6.2, 29, 3.33, 1.2, 0.39, 75, 0.66]]}}'
