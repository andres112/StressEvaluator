import pandas as pd
from datetime import datetime
import os
import sys

path = "./timestamp_creator"
e4_ts = path+"/input/e4_timestamps.json"  # Columns: sessionId, time

# Only should be one report in json format in this folder
input_data = os.listdir(path+"/input")[0]

if not input_data.endswith(".json"):
    print("Invalid file format")
    sys.exit()


ts = pd.DataFrame()
sessions = pd.read_json(path+"/input/"+input_data)
sessions = sessions.query('consent == True & close_date != None')

e4_sessions = pd.read_json(e4_ts)

for i, session in sessions.iterrows():
    responses = session['responses']
    responses = pd.DataFrame.from_dict(responses)
    index = 0
    step_info = {'sessionId': session['_id'],
                 'e4_start': e4_sessions[e4_sessions['sessionId'] == session['_id']].iloc[0]['time']}
    for index, step in responses.iterrows():
        [start, end] = [step['start_time'], step['end_time']]
        dur = end - start
        step_info.update(
            {f'step_{index}': step['step_id'],
             f'type_step_{index}': step['type'],
             f'e4_diff_step_{index}': start - step_info['e4_start'],
             f'start_step_{index}': start,
             f'end_step_{index}': end,
             f'dur_step_{index}': dur})
    ts = ts.append(step_info, ignore_index=True)

# create csv with timestamp
ts.to_csv(path+"/output/timestamp.csv", index=False)
