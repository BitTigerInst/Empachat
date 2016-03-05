import json
import networkx as nx
from pymongo import MongoClient
import matplotlib.pyplot as plt

with open('data/connected_synonyms_graph.adjlist', 'rb') as f:
  G = nx.read_adjlist(f, delimiter='=-=', create_using=nx.DiGraph())

nodes = G.nodes()

#with open('nodes.json', 'w') as f:
#	json.dump([{'word': node} for node in nodes], f, indent=4)


#client = MongoClient("127.0.0.1:3001")
#db = client.meteor
#collection = db.graphs
#for doc in collection.find():
#	print doc
#collection.insert_one({"source": "S", "target": "T", "distance": 1000})

def getScore(d1, d2):
	return (d1+d2)/2.0/(d1*d2);

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

