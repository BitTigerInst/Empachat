import json
import networkx as nx
from pymongo import MongoClient
import matplotlib.pyplot as plt

with open('data/connected_synonyms_graph.adjlist', 'rb') as f:
  G = nx.read_adjlist(f, delimiter='=-=', create_using=nx.DiGraph())

nodes = G.nodes()

#with open('nodes.json', 'w') as f:
#	json.dump([{'word': node} for node in nodes], f, indent=4)

# generate words.json
targetEmotions = ["chill", "crazy", "happy", "love", "lovely", "mellow", "nice", "party", "relax", "rocky", "sad", "slow", "smooth", "soft", "trippy", "upbeat"]
words = {}
with open('words.json', 'w') as f:
	for node in nodes:
		optimalTarget = ""
		distance = 10000
		for targetEmotion in targetEmotions:
			if targetEmotion not in nodes:
				continue
			if nx.has_path(G, node, targetEmotion):
				curDistance = len(nx.shortest_path(G, source=node, target=targetEmotion))
			if nx.has_path(G, targetEmotion, node):
				curDistance = len(nx.shortest_path(G, source=targetEmotion, target=node))
			if curDistance < distance:
				optimalTarget = targetEmotion
				distance = curDistance
		words[node] = (optimalTarget, distance)
	json.dump([{'word': k, 'target': v[0], 'distance': v[1]} for k, v in words.items()], f, indent=4)
	
# generate pair.json
data = {}
i = 0
for v in nodes:
	for w in nodes:
		i = i+1
		print i
		if nx.has_path(G, v, w):
			distance = len(nx.shortest_path(G, source = v, target = w))
			if distance > 3:
				continue
		else:
			continue
		data[v, w] = 0

with open('pair.json', 'w') as f:
	json.dump([{'source': k[0], 'target': k[1]} for k, v in data.items()], f)

# old version of data, too large
"""
data = {}
for v in nodes:
	for w in nodes:
		if nx.has_path(G, v, w):
			distance = len(nx.shortest_path(G, source = v, target = w))
			data[(v, w)] = distance;
			#print data


with open('match.json', 'w') as f:
	json.dump([{'source': k[0], 'target': k[1], 'distance': v} for k, v in data.items()], f, indent=4)
		#collection.insert_one({"source": v, "target": w, "distance": distance})
"""

