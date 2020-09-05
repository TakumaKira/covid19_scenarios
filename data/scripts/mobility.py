import pandas as pd
import numpy as np
import codecs
import json
import copy
import datetime

data_url = 'https://www.gstatic.com/covid19/mobility/Global_Mobility_Report.csv'
print('Downloading ' + data_url + '...')
data_frame = pd.read_csv(data_url)
print('Download finished.')

country_codes_url = 'data/country_codes.csv'
country_codes_df = pd.read_csv(country_codes_url)
country_codes = {}
for c in np.array(country_codes_df):
    country_codes[c[1]] = { 'name': c[0], 'alpha-3': c[2] }

scenarios_json_url = 'src/assets/data/scenarios.json'
with open(scenarios_json_url) as f:
    scenarios_df = json.load(f)
scenario_names = {}
for d in scenarios_df['all']:
    scenario_names[d['name']] = ''

def get_transmission_reduction(retail_and_recreation, grocery_and_pharmacy, parks, transit_stations, workplaces, residential):
    # Some of the parameters could be dropped because they don't meet "quality and privacy thresholds". See https://www.google.com/covid19/mobility/data_documentation.html
    # Caluculate transmission reduction here
    reduction_by_mobility = -(transit_stations * 0.5 + workplaces * 0.5)
    if reduction_by_mobility <= 0: # TODO: Remove these 2 lines after transmission reduction accepts negative numbers.
        reduction_by_mobility = 0
    return { 'begin': reduction_by_mobility, 'end': reduction_by_mobility }

def get_tomorrow_str(today_str):
    tomorrow = pd.to_datetime(today_str) + datetime.timedelta(days=1)
    return tomorrow.strftime('%Y-%m-%d')

data_json = {
    'all': []
}
data_temp = {
    'data': {
        'mitigation': {
            'mitigationIntervals': []
        }
    },
    'name': ''
}
mitigationInterval_temp = {
    'color': '#cccccc',
    'name': '',
    'timeRange': {
        'begin': '',
        'end': ''
    },
    'transmissionReduction': {
        'begin': 0,
        'end': 0
    }
}

for d in np.array(data_frame):
    if isinstance(d[3], str):
        continue
    elif isinstance(d[2], str):
        name = country_codes[d[0]]['alpha-3'] + '-' + d[2]
    else:
        name = country_codes[d[0]]['name']

    if len(data_json['all']) == 0 or not data_json['all'][-1]['name'] == name:
        if (name not in scenario_names) == True:
            continue
        print('Processing ' + name + '...')
        data_add = copy.deepcopy(data_temp)
        data_add['name'] = name
        data_json['all'].append(data_add)

    mitigationInterval_add = copy.deepcopy(mitigationInterval_temp)
    mitigationInterval_add['name'] = 'Mobility ' + d[7]
    mitigationInterval_add['timeRange']['begin'] = d[7]
    mitigationInterval_add['timeRange']['end'] = get_tomorrow_str(d[7])
    mitigationInterval_add['transmissionReduction'] = get_transmission_reduction(d[8], d[9], d[10], d[11], d[12], d[13])
    if np.isnan(mitigationInterval_add['transmissionReduction']['begin']) or np.isnan(mitigationInterval_add['transmissionReduction']['end']):
        continue
    data_json['all'][-1]['data']['mitigation']['mitigationIntervals'].append(mitigationInterval_add)

output_url = 'src/assets/data/mobility.json'
print('Writing ' + output_url + '...')
f = codecs.open(output_url, 'w', 'utf-8')
json.dump(data_json, f, indent=2, ensure_ascii=False)
f.close
print('Output finished.')
