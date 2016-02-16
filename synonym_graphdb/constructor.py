import ujson
import networkx as nx
from networkx.readwrite import json_graph


class Constructor:
    def __init__(self):
        pass

    def work(self):
        with open('data/connected_synonyms.txt', 'r') as f:
            connected_synonyms_dict = ujson.loads(f.read())
        g = nx.Graph()
        for key in connected_synonyms_dict:
            g.add_node(key)
        for key in connected_synonyms_dict:
            for synonym in connected_synonyms_dict[key]:
                g.add_edge(key, synonym)
        # data = json_graph.node_link_data(g)
        with open('data/connected_synonyms_graph.adjlist', 'wb') as f:
            # f.write(ujson.dumps(data))
            nx.write_adjlist(g, f)

c = Constructor()
c.work()
