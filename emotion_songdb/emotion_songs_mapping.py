import os
import ujson
import soundcloud
from pymongo import MongoClient

ROOT_DIR = '/Users/a67'
APP_DIR = 'Project/Empachat'
DATA_DIR = 'emotion_songdb/data'
SONGJSONS_DIR = 'song_jsons'
QUERYMAP_DIR = 'query_songlinks_mappings'
SONGLINKS_DIR = 'song_links'
mongo_client = MongoClient(host='54.175.4.6', port=27017)
soundcloud_client = soundcloud.Client(client_id='d3f2b79d4e0732d66a4cc3accf02dd92')
db = mongo_client.empachat


def read_txt_to_jsonlist(fdir):
  result = []
  with open(fdir, 'r') as f:
    for line in f:
      result.append(ujson.loads(line.strip()))
  return result


def get_soundcloudsonglinks_from_query(soundcloud_client, query):
  tracks = soundcloud_client.get('/tracks', q=query)
  if not tracks:
    result = []
  else:
    result = [track.permalink_url for track in tracks]
  return result


def write_query_songlinks_mapping(query_songlinks_mapping, fdir):
  with open(fdir, 'w') as f:
    f.write(ujson.dumps(query_songlinks_mapping))


def construct_soundcloudsonglinks_from_emotion(soundcloud_client, emotion):
  jsonlist_txt_filedir = '/'.join([ROOT_DIR, APP_DIR, DATA_DIR, SONGJSONS_DIR, emotion + '.txt'])
  json_list = read_txt_to_jsonlist(jsonlist_txt_filedir)
  result = []
  for j in json_list:
    print j
    query = ' '.join([j['title'], j['artist']])
    cursor = db.test_query_songlinks_map.find({'query': query})
    records = [doc for doc in cursor]
    if records:
      song_links = records[0]['song_links']
    else:
      song_links = get_soundcloudsonglinks_from_query(
        soundcloud_client, query
      )
      db.test_query_songlinks_map.insert_one({
        'query': query,
        'song_links': song_links,
        'emotion': emotion,
      })
  return result


emotions = ['crazy', 'happy', 'mellow', 'nice', 'relax', 'sad', 'slow', 'smooth',
            'soft', 'trippy', 'upbeat']
for emotion in emotions:
  song_links = construct_soundcloudsonglinks_from_emotion(soundcloud_client, emotion)
