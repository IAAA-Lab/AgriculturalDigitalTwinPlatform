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
task_end_info = Gauge(
    'task_end_info', 'Task end info',
    ['task_name', 'task_status', 'task_time_elapsed', 'task_memory_peak'])
task_status = Gauge(
    'task_status', 'Task status', ['task_name', 'task_status'])

# Enum for task status


class TaskStatus(Enum):
    STARTED = 'started'
    RUNNING = 'running'
    FINISHED = 'finished'
    FAILED = 'failed'

# Define a decorator to wrap the etl flow function


def flow(flow):
    '''
    Log to prometheus:
      - Start time
      - End time
      - Time elapsed
      - Status
      - Memory peak
    '''
    def wrapper(*args, **kwargs):
        # Start time
        start_time = time.time()
        # Memory profile
        mem_usage = memory_usage(-1, interval=1)
        # If function is async, get task status every 10 seconds
        try:
            if asyncio.iscoroutinefunction(flow):
                # Start task
                task = asyncio.create_task(flow(*args, **kwargs))
                # Get task status
                task_status.state(TaskStatus.STARTED.value)
                while not task.done():
                    task_status.state(TaskStatus.RUNNING.value)
                    time.sleep(10)
                task_status.state(TaskStatus.FINISHED.value)
            else:
                flow(*args, **kwargs)
        except Exception as e:
            print(e)
            task_status.state(TaskStatus.FAILED.value)
        # Memory peak
        mem_peak = max(mem_usage)
        # End time
        end_time = time.time()
        # Time elapsed
        time_elapsed = end_time - start_time
        # Export metrics
        task_end_info.labels(flow.__name__, task_status._state.value,
                             time_elapsed, mem_peak).set(1)
        # Return function
        return flow(*args, **kwargs)

    return wrapper
