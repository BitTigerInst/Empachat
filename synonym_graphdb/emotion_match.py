import networkx as nx

with open('data/connected_synonyms_graph.adjlist', 'rb') as f:
  g = nx.read_adjlist(f, delimiter='=-=')

print g.nodes()
print g.edges()
# http://networkx.readthedocs.org/en/networkx-1.11/
# http://networkx.readthedocs.org/en/networkx-1.11/reference/algorithms.html
