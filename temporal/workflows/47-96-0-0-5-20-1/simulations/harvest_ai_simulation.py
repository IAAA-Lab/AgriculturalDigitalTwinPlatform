import asyncio
import math
import random
from temporalio import workflow, activity
from temporalio.worker import Worker
from temporalio.client import Client
from temporalio.common import RetryPolicy
from datetime import datetime, timedelta
from dataclasses import dataclass
# import simpy

@dataclass
class Time:
    day: int
    month: int
    year: int
    hour: int
    hour_duration: int
    
async def advance_time(time: dict):
    time_dt = datetime(time["year"], time["month"], time["day"], time["hour"])
    new_time = time_dt + timedelta(hours=1)
    time["hour"] = new_time.hour
    time["day"] = new_time.day
    time["month"] = new_time.month
    time["year"] = new_time.year
    # await 1 second
    await asyncio.sleep(time["hour_duration"])

@dataclass
class Weather:
    temperature: float
    humidity: float
    wind_speed: float
    wind_direction: str
    precipitation: float

def set_rain(weather: dict):
    rain_probability = 0.1
    if weather["sky_state"] == "C":
        rain_probability += random.uniform(0.1, 0.3)
    rain_quantity = 0
    if weather["humidity"] > 80:
        rain_probability += random.uniform(0, 0.2)
    if weather["wind_speed"] > 30:
        rain_probability -= random.uniform(0, 0.2)
    # let the odds decide
    if random.random() < rain_probability:
        rain_quantity = random.uniform(0, 30)
        weather["precipitation"] = rain_quantity
        
def set_sky_state(weather: dict):
    states = ["S", "C", "N", "P"]
    weather["sky_state"] = random.choice(states)

def set_wind(weather: dict):
    weather["wind_speed"] = random.uniform(0, 50)
    weather["wind_direction"] = random.choice(["N", "S", "E", "W"])

def set_temperature(weather: dict, time: dict):
    # Depending on hour or month, temperature will vary
    if time["month"] >= 1 and time["month"] <= 3:
        if time["hour"] >= 0 and time["hour"] <= 6:
            weather["temperature"] = random.uniform(0, 10)
        elif time["hour"] >= 7 and time["hour"] <= 12:
            weather["temperature"] = random.uniform(10, 20)
        elif time["hour"] >= 13 and time["hour"] <= 18:
            weather["temperature"] = random.uniform(20, 30)
        elif time["hour"] >= 19 and time["hour"] <= 23:
            weather["temperature"] = random.uniform(10, 20)
    elif time["month"] >= 4 and time["month"] <= 8:
        if time["hour"] >= 0 and time["hour"] <= 6:
            weather["temperature"] = random.uniform(0, 10)
        elif time["hour"] >= 7 and time["hour"] <= 12:
            weather["temperature"] = random.uniform(10, 30)
        elif time["hour"] >= 13 and time["hour"] <= 18:
            weather["temperature"] = random.uniform(30, 40)
        elif time["hour"] >= 19 and time["hour"] <= 23:
            weather["temperature"] = random.uniform(20, 30)
    elif time["month"] >= 9 and time["month"] <= 12:
        if time["hour"] >= 0 and time["hour"] <= 6:
            weather["temperature"] = random.uniform(0, 10)
        elif time["hour"] >= 7 and time["hour"] <= 12:
            weather["temperature"] = random.uniform(10, 20)
        elif time["hour"] >= 13 and time["hour"] <= 18:
            weather["temperature"] = random.uniform(20, 30)
        elif time["hour"] >= 19 and time["hour"] <= 23:
            weather["temperature"] = random.uniform(10, 20)

def set_humidity(weather, time: Time):
    # Depending on hour or month, humidity will vary
    if time["month"] >= 1 and time["month"] <= 3:
        if time["hour"] >= 0 and time["hour"] <= 6:
            weather["humidity"] = random.uniform(0, 20)
        elif time["hour"] >= 7 and time["hour"] <= 12:
            weather["humidity"] = random.uniform(20, 40)
        elif time["hour"] >= 13 and time["hour"] <= 18:
            weather["humidity"] = random.uniform(40, 60)
        elif time["hour"] >= 19 and time["hour"] <= 23:
            weather["humidity"] = random.uniform(20, 40)
    elif time["month"] >= 4 and time["month"] <= 8:
        if time["hour"] >= 0 and time["hour"] <= 6:
            weather["humidity"] = random.uniform(0, 20)
        elif time["hour"] >= 7 and time["hour"] <= 12:
            weather["humidity"] = random.uniform(20, 60)
        elif time["hour"] >= 13 and time["hour"] <= 18:
            weather["humidity"] = random.uniform(60, 80)
        elif time["hour"] >= 19 and time["hour"] <= 23:
            weather["humidity"] = random.uniform(40, 60)
    elif time["month"] >= 9 and time["month"] <= 12:
        if time["hour"] >= 0 and time["hour"] <= 6:
            weather["humidity"] = random.uniform(0, 20)
        elif time["hour"] >= 7 and time["hour"] <= 12:
            weather["humidity"] = random.uniform(20, 40)
        elif time["hour"] >= 13 and time["hour"] <= 18:
            weather["humidity"] = random.uniform(40, 60)
        elif time["hour"] >= 19 and time["hour"] <= 23:
            weather["humidity"] = random.uniform(20, 40)


@dataclass
class DigitalTwin:
    id: str
    name: str
    num_trees: int
    affected_trees: int
    dead_trees: int
    start_date: str
    end_date: str
    time_elapsed: int
    sun_hours: int
    cold_hours: int
    prec_accumulated: int
    crop_stage: str
    # soil: Soil
    harvest: dict
    
def update(digital_twin: dict, time: dict, weather: dict):
    digital_twin["time_elapsed"] += 1
    if weather["temperature"] > 25:
        digital_twin["sun_hours"] += 1
    if weather["temperature"] < 10:
        digital_twin["cold_hours"] += 1
    if weather["precipitation"] > 0:
        digital_twin["prec_accumulated"] += weather["precipitation"]
    if digital_twin["sun_hours"] > 100 and digital_twin["cold_hours"] > 100 and digital_twin["prec_accumulated"] > 100:
        digital_twin["crop_stage"] = "Mature"
    if digital_twin["crop_stage"] == "Mature":
        digital_twin["harvest"] = {
            "date": f"{time['year']}-{time['month']}-{time['day']} {time['hour']}:00:00",
            "numTrees": digital_twin["num_trees"],
            "affectedTrees": digital_twin["affected_trees"],
            "deadTrees": digital_twin["dead_trees"],
            "yield": digital_twin["num_trees"] - digital_twin["dead_trees"],
            "harvestKg": (digital_twin["num_trees"] - digital_twin["dead_trees"]) * random.uniform(5, 30)
        }
        digital_twin["affected_trees"] = 0
        digital_twin["dead_trees"] = 0
        digital_twin["sun_hours"] = 0
        digital_twin["cold_hours"] = 0
        digital_twin["prec_accumulated"] = 0
        digital_twin["crop_stage"] = "Growing"

@dataclass
class Plague:
    name: str
    type: str
    treatment: str
    treatment_cost: float
    duration: int

def treat(plague: dict, digital_twin: dict):
    treatment_probability = 0.1
    if plague["duration"] > 7:
        digital_twin["dead_trees"] += 1
        plague["duration"] = 0
    if digital_twin["affected_trees"] > 0:
        plague["duration"] += 1
        # More hours pass, more probability of treatment
        treatment_probability += 0.075 * plague["duration"]
        # Let the odds decide
        if random.random() < treatment_probability:
            digital_twin["affected_trees"] -= 1
            plague["duration"] = 0

def affect(weather: dict, digital_twin: dict):
    affect_probability = 0.1
    if weather["temperature"] > 30:
        affect_probability += random.uniform(0.2, 0.4)
    if weather["humidity"] > 80:
        affect_probability += random.uniform(0.4, 0.6)
    if weather["temperature"] < 10:
        affect_probability -= random.uniform(0.2, 0.4)
    # let the odds decide
    if random.random() < affect_probability:
        digital_twin["affected_trees"] += 1

def spread(weather: dict, digital_twin: dict):
    spread_probability = 0
    if weather["temperature"] > 30:
        spread_probability += random.uniform(0.2, 0.4)
    if weather["humidity"] > 70:
        spread_probability += random.uniform(0.5, 0.8)
    if weather["wind_speed"] > 30:
        spread_probability += random.uniform(0.6, 0.8)
    # let the odds decide
    if random.random() < spread_probability:
        digital_twin["affected_trees"] += 1

@dataclass
class InputNextStage:
    time: dict
    digital_twin: dict
    plagues: list[dict]
    weather: dict
    simulation_id: str
    digital_twin_id: str

@activity.defn()
async def run_simulation(input: InputNextStage):
    import pandas as pd
    time = input.time
    weather = input.weather
    digital_twin = input.digital_twin
    plagues = input.plagues
    if time["hour_duration"] == math.inf:
        return digital_twin, weather, time, plagues, False
    await advance_time(time)
    set_temperature(weather, time)
    set_humidity(weather, time)
    set_wind(weather)
    set_sky_state(weather)
    set_rain(weather)
    # Create plague randomly
    random_plague = random.random()
    if random_plague < 0.2:
        plague = Plague("Plague", "Plague Type 1", "Treatment 1", 0, 0).__dict__
        affect(weather, digital_twin)
        spread(weather, digital_twin)
        plagues.append(plague)
    # Treat input.plagues
    for plague in plagues:
        treat(plague, digital_twin)
        if plague["duration"] == 0:
            plagues.remove(plague)
    # Update digital twin
    update(digital_twin, time, weather)
    # Check if there has been a new harvest
    if digital_twin["harvest"] is not None:
        await load_result(InputLoadResult(digital_twin["harvest"], input.simulation_id, input.digital_twin_id))
        digital_twin["harvest"] = None
    # Check if simulation has ended
    if pd.to_datetime(str(time["day"]) + "/" + str(time["month"]) + "/" + str(time["year"])) > pd.to_datetime(digital_twin["end_date"]):
        return digital_twin, weather, time, plagues, True
    await load_status(InputLoadStatus(digital_twin, time, weather, [plague for plague in plagues], input.simulation_id, input.digital_twin_id))
    return digital_twin, weather, time, plagues, False

@dataclass
class InputLoadStatus:
    digital_twin: dict
    time: dict
    weather: dict
    plagues: list[dict]
    simulation_id: str
    digital_twin_id: str

async def load_status(input: InputLoadStatus):
    from pymongo import MongoClient
    import os
    client = MongoClient(os.getenv("MONGO_URI"))
    database = client[input.digital_twin_id]
    database["Simulations"].insert_one(
        {
            "simulationId": input.simulation_id,
            "time": input.time,
            "weather": input.weather,
            "digitalTwin": input.digital_twin,
            "plagues": input.plagues
        },
    )

@dataclass
class InputLoadResult:
    harvest: dict
    simulation_id: str
    digital_twin_id: str

async def load_result(input: InputLoadResult):
    from pymongo import MongoClient
    import os
    client = MongoClient(os.getenv("MONGO_URI"))
    database = client[input.digital_twin_id]
    database["SimulationResults"].update_one(
        {
            "simulationId": input.simulation_id,
        },
        {
            "$push": {
                "results": input.harvest
            }
        },
        upsert=True
    )

@dataclass
class InputCreateSimulation:
    digital_twin_id: str
    simulation_id: str
    start_date: str
    end_date: str
    num_trees: int

@activity.defn()
async def create_simulation(input: InputCreateSimulation):
    from pymongo import MongoClient
    import os
    import pandas as pd
    client = MongoClient(os.getenv("MONGO_URI"))
    database = client[input.digital_twin_id]
    database["SimulationResults"].insert_one(
        {
            "simulationId": input.simulation_id,
            "timestamp": pd.Timestamp.now(),
            "startDate": pd.to_datetime(input.start_date),
            "endDate": pd.to_datetime(input.end_date),
            "numTrees": input.num_trees,
            "terminated": False,
            "results": []
        },
    )

@dataclass
class InputEndSimulation:
    digital_twin_id: str
    simulation_id: str

@activity.defn()
async def end_simulation():
    from pymongo import MongoClient
    import os
    import pandas as pd
    client = MongoClient(os.getenv("MONGO_URI"))
    database = client[input.digital_twin_id]
    database["SimulationResults"].update_one(
        {
            "simulationId": input.simulation_id,
        },
        {
            "$set": {
                "terminated": True
            }
        }
    )

    


@dataclass
class Input_Run:
    digital_twin_id: str
    num_trees: int
    start_date: str
    end_date: str

@workflow.defn
class HarvestAiSimulationWorkflow:

    time: Time = None
    digital_twin: DigitalTwin = None
    weather: Weather = None
    plagues: list[Plague] = []

    hour_duration = 1

    @workflow.signal
    async def resume(self) -> None:
        self.hour_duration = 1

    # @workflow.signal
    # async def pause():
        # time.hour_duration = math.inf

    @workflow.signal
    async def speed(self, speed: float) -> None:
        if (speed == 0):
            self.hour_duration = math.inf
            return
        self.hour_duration = 1/speed

    @workflow.signal
    async def update(self) -> None:
        pass

    @workflow.run
    async def run(self, input: Input_Run) -> None:
        workflow_id = workflow.info().workflow_id
        # Split this: simulation_<simulation-id> and get <simulation-id>
        simulation_id = workflow_id.split("_")[1]
        await workflow.execute_activity(create_simulation, InputCreateSimulation(input.digital_twin_id, simulation_id, input.start_date, input.end_date, input.num_trees),
                                        start_to_close_timeout=timedelta(seconds=10),
                                        retry_policy=RetryPolicy(maximum_attempts=2, backoff_coefficient=1))
        self.time = Time(day=int(input.start_date.split("-")[2]), month=int(input.start_date.split("-")[1]), year=int(input.start_date.split("-")[0]), hour=0, hour_duration=1)
        self.digital_twin = DigitalTwin(input.digital_twin_id, "Digital Twin Pistachio", input.num_trees, 0, 0, input.start_date, input.end_date, 0, 0, 0, 0, "Growing", None)
        self.weather = Weather(0, 0, 0, "N", 0)
        self.plagues = []
        while True:
            self.digital_twin, self.weather, self.time, self.plagues, over = await workflow.execute_activity(run_simulation, InputNextStage(self.time, self.digital_twin, self.plagues, self.weather, simulation_id, input.digital_twin_id),
                                        start_to_close_timeout=timedelta(hours=3),
                                        retry_policy=RetryPolicy(maximum_attempts=1, backoff_coefficient=1))
            self.time["hour_duration"] = self.hour_duration
            if over:
                break
        await workflow.execute_activity(end_simulation, InputEndSimulation(input.digital_twin_id, simulation_id),
                                        start_to_close_timeout=timedelta(seconds=10),
                                        retry_policy=RetryPolicy(maximum_attempts=2, backoff_coefficient=1))

# This is the main function that will be executed by the Temporal worker
async def main():
    client = await Client.connect("localhost:7233", namespace="47-96-0-0-5-20-1")
    async with Worker(client, task_queue="harvest-simulation-task-queue", workflows=[HarvestAiSimulationWorkflow], activities=[run_simulation, create_simulation]) as worker:
        await client.execute_workflow(HarvestAiSimulationWorkflow.run,
                                      Input_Run(enclosure_id="47-96-0-0-5-20-1", num_trees=100, start_date="2022-01-01", end_date="2022-12-31"),
                                      id=f"harvest-simulation-{random.randint(0, 1000)}",
                                      task_queue="harvest-simulation-task-queue",
                                      retry_policy=RetryPolicy(maximum_attempts=1))
    print("Starting simulation")
    # await run_simulation(Initial_Params(100, "1/1/2022", 500))

if __name__ == "__main__":
    asyncio.run(main())