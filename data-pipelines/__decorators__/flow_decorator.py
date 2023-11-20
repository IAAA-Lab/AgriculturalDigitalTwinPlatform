import sys
from memory_profiler import memory_usage
import time
from prometheus_client import Gauge
import asyncio
from enum import Enum

# Define prometheus object that includes the following metrics:
# - Start time
# - End time
# - Time elapsed
# - Memory peak
task_end_memory_peak = Gauge(
    'task_end_memory', 'Memory peak', ['task_name'])
task_end_time_elapsed = Gauge(
    'task_end_time', 'Elapsed time', ['task_name'])
task_end_start_time = Gauge(
    'task_end_start', 'Start time', ['task_name'])
task_end_end_time = Gauge(
    'task_end_end', 'End time', ['task_name'])
task_status = Gauge(
    'task_status', 'Task status', ['task_name'])

# Enum for task status


class TaskStatus(Enum):
    STARTED = 0,
    RUNNING = 1,
    FINISHED = 2,
    FAILED = 3

# Define a decorator to wrap the etl flow function


def flow(flow_func):
    '''
    Log to prometheus:
      - Start time
      - End time
      - Time elapsed
      - Status
      - Memory peak
    '''
    def wrapper(*args, **kwargs):
        # # Start time
        start_time = time.time()
        # # # Memory profile
        # mem_usage = memory_usage(-1, interval=1)
        res = None
        # task_status.labels(flow_func.__name__).set(TaskStatus.STARTED.value)
        try:
            if asyncio.iscoroutinefunction(flow_func):
                # Start task
                task = asyncio.create_task(flow_func(*args, **kwargs))
                # Get task status
                while not task.done():
                    task_status.labels(flow_func.__name__).set(TaskStatus.RUNNING.value)
                    time.sleep(10)
                    res = task.result()
            else:
                res = flow_func(*args, **kwargs)

        except Exception as e:
            print(e)
            task_status.labels(flow_func.__name__).set(TaskStatus.FAILED.value)
        # Result
        # task_status.labels(flow_func.__name__).set(TaskStatus.FINISHED.value)
        # # Memory peak
        # mem_peak = max(mem_usage)
        # End time
        end_time = time.time()
        # # Time elapsed
        # time_elapsed = end_time - start_time
        # # Export metrics
        # task_end_memory_peak.labels(flow_func.__name__).set(mem_peak)
        # task_end_time_elapsed.labels(flow_func.__name__).set(time_elapsed)
        task_end_start_time.labels(flow_func.__name__).set(start_time)
        task_end_end_time.labels(flow_func.__name__).set(end_time)
        # # Return function
        return res

    return wrapper
