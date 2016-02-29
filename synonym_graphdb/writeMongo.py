import networkx as nx
from pymongo import MongoClient
import matplotlib.pyplot as plt

with open('data/connected_synonyms_graph.adjlist', 'rb') as f:
  G = nx.read_adjlist(f, delimiter='=-=', create_using=nx.DiGraph())

nodes = G.nodes()

MAX_LENGTH = 10000
client = MongoClient("127.0.0.1:3001")
db = client.meteor
collection = db.graphs
#for doc in collection.find():
#	print doc
#collection.insert_one({"source": "S", "target": "T", "distance": 1000})

for v in nodes:
	for w in nodes:
		distance = MAX_LENGTH;
		if nx.has_path(G, v, w):
			distance = len(nx.shortest_path(G, source = v, target = w))
		collection.insert_one({"source": v, "target": w, "distance": distance})
