import os
import ujson
import soundcloud


ROOT_DIR = '/Users/a67'
APP_DIR = 'Project/Empachat'
DATA_DIR = 'emotion_songdb/data'
SONGJSONS_DIR = 'song_jsons'
QUERYMAP_DIR = 'query_songlinks_mappings'
SONGLINKS_DIR = 'song_links'

def read_txt_to_jsonlist(fdir):
  result = []
  with open(fdir, 'r') as f:
    for line in f:
      result.append(ujson.loads(line.strip()))
  return result


def get_soundcloudsonglinks_from_query(
        soundcloud_client, query, current_query_songlinks_mapping):
  if query in current_query_songlinks_mapping:
    return current_query_songlinks_mapping[query]
  tracks = soundcloud_client.get('/tracks', q=query)
  if not tracks:
    return []
  return [track.permalink_url for track in tracks]


def get_current_query_songlinks_mapping(fdir):
  if os.path.exists(fdir):
    with open(fdir, 'r') as f:
      content = f.read()
      if content:
        current_query_songlinks_mapping = ujson.loads(content)
      else:
        current_query_songlinks_mapping = dict()
  else:
    os.system('touch ' + fdir)
    current_query_songlinks_mapping = dict()
  return current_query_songlinks_mapping


def write_query_songlinks_mapping(query_songlinks_mapping, fdir):
  with open(fdir, 'w') as f:
    f.write(ujson.dumps(query_songlinks_mapping))


def construct_soundcloudsonglinks_from_emotion(soundcloud_client, emotion):
  jsonlist_txt_filedir = '/'.join([ROOT_DIR, APP_DIR, DATA_DIR, SONGJSONS_DIR, emotion + '.txt'])
  query_songlinks_mapping_filedir = '/'.join([ROOT_DIR, APP_DIR, DATA_DIR, QUERYMAP_DIR, emotion + '.txt'])
  query_songlinks_mapping = get_current_query_songlinks_mapping(
    query_songlinks_mapping_filedir
  )
  json_list = read_txt_to_jsonlist(jsonlist_txt_filedir)
  result = []
  for j in json_list:
    print j
    query = ' '.join([j['title'], j['artist']])
    songlinks = get_soundcloudsonglinks_from_query(
      soundcloud_client, query, query_songlinks_mapping)
    if query not in query_songlinks_mapping:
      query_songlinks_mapping[query] = dict()
    for link in songlinks:
      query_songlinks_mapping[query][link] = 1
      result.append(link)
  write_query_songlinks_mapping(query_songlinks_mapping, query_songlinks_mapping_filedir)
  return result


emotions = ['crazy', 'happy', 'mellow', 'nice', 'relax', 'sad', 'slow', 'smooth',
            'soft', 'trippy', 'upbeat']
client = soundcloud.Client(client_id='d3f2b79d4e0732d66a4cc3accf02dd92')
for emotion in emotions:
  song_links = construct_soundcloudsonglinks_from_emotion(client, emotion)
  with open('/'.join([ROOT_DIR, APP_DIR, DATA_DIR, SONGLINKS_DIR, emotion + '.txt']), 'w') as f:
    for link in song_links:
      f.write(link + '\n')
