import networkx as nx
import matplotlib.pyplot as plt

with open('data/connected_synonyms_graph.adjlist', 'rb') as f:
  g = nx.read_adjlist(f, delimiter='=-=', create_using=nx.DiGraph())

print g.nodes()
print "\n\n\n\n\n"
#print g.edges()
# http://networkx.readthedocs.org/en/networkx-1.11/
# http://networkx.readthedocs.org/en/networkx-1.11/reference/algorithms.html

#nx.draw(g)
#plt.savefig("path.png")

#print(nx.shortest_path(g,source=u'funereal',target=u'happy'))
#matrix = nx.shortest_path(g)
#print matrix[u'funereal'][u'happy']

#print(nx.shortest_path(g,source=u'funereal',target=u'dynamic'))
#print(nx.shortest_path(g,source=u'funereal',target=u'winsome'))
#print(nx.shortest_path(g,source=u'funereal',target=u'unstable'))
funereal_dict = nx.shortest_path(g, source=u'funereal')

for value in funereal_dict.values():
	print value

print "\n\n\n\n\n"
length_list = []
for value in funereal_dict.values():
	length_list.append(len(value))
print max(length_list)
print min(length_list)
print "\n\n\n\n\n"

#print(nx.shortest_path(g,source=u'peaceful',target=u'happy'))
#print(nx.shortest_path(g,source=u'happy',target=u'peaceful'))
print nx.has_path(g, u'happy', u'peaceful')
print nx.has_path(g, u'peaceful', u'happy')

matrix = nx.shortest_path(g)
print matrix




