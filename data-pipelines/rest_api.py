from flask import Flask
from datetime import datetime
import os
import croniter

def get_etl_schedule_list() -> list:
    # Get crontab string
    jobs = os.popen('crontab -l').read()
    # Obtain job name and time
    list_of_jobs = []
    for job in jobs.split('\n'):
        if job != '' and job[0] != '#' and job[0] != '@':
            # 0 0 * * 7 /usr/local/bin/python3 -m /opt/data-pipelines/etl/ndvi/ndvi_etl.scheduled";
            job_name = job.split(' ')[-1].split('/')[-1]
            # get job schedule and translate it to format: [Day] of [Month] at [HH:MM]
            job_schedule = job.split(' ')[0:-3]
            print(job_schedule)
            job_schedule = croniter.croniter(' '.join(job_schedule), datetime.now()).get_next(datetime).strftime('%A of %B at %H:%M')
            list_of_jobs.append({'job_name': job_name, 'job_schedule': job_schedule, 'job_description': ''})
    print(list_of_jobs)
    return list_of_jobs
# Function that create the app 
def create_app(test_config=None ):
    # create and configure the app
    app = Flask(__name__)

    @app.route('/')
    def hello():
        return 'Hello, World!'

    @app.route('/list-jobs')
    def list_jobs():
        return get_etl_schedule_list()
     
    return app # do not forget to return the app

APP = create_app()

def init_rest_api():
    # APP.run(host='0.0.0.0', port=9092)
    import bjoern
    bjoern.run(APP, '0.0.0.0', 9092)

if __name__ == '__main__':
    init_rest_api()