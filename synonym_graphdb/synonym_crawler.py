from urllib2 import urlopen
import contextlib
from lxml.html import document_fromstring
from Queue import Queue
import ujson
import sys


class SynonymCrawler:
    def __init__(self):
        pass

    def work(self, url):
        with contextlib.closing(urlopen(url)) as page_source:
            page_content = page_source.read()
        doc = document_fromstring(page_content)
        synonym_set_tags = doc.xpath('//div[contains(@class, "synonyms_wrapper")]/div[contains(@class, "synonyms")]')
        synonym_sets = []
        for synonym_set_tag in synonym_set_tags:
            word_tags = synonym_set_tag.xpath('div[contains(@class, "filters")]/div[contains(@class, "relevancy-block")]/div[contains(@class, "relevancy-list")]/ul/li/a/span[@class="text"]')
            synonym_sets.append([tag.text_content() for tag in word_tags])
        return synonym_sets

    def parse(self):
        with open('data/seed_words.txt', 'r') as f:
            words = f.read().split()
        with open('data/seed_words.txt', 'w') as f:
            for w in words:
                f.write(w.strip() + '\n')
        print'Done'

    def run(self, max_level=1):
        seed_words = []
        with open('data/seed_words.txt', 'r') as f:
            for line in f:
                seed_words.append(line.strip())
        visited_words = dict()
        q = Queue()
        queue_words_dict = dict()
        for w in seed_words:
            q.put(w)
            queue_words_dict[w] = 1
        word_synonyms_dict = dict()

        old_size = len(seed_words)
        new_size = 0
        curr_level = 0
        while not q.empty():
            if curr_level >= max_level:
                break
            for i in range(0, old_size):
                curr = q.get()
                if curr in visited_words:
                    continue
                url = 'http://www.thesaurus.com/browse/' + '%20'.join(curr.split())
                print url, len(queue_words_dict), len(visited_words)
                try:
                    synonym_sets = self.work(url)
                except Exception as e:
                    print e
                    synonym_sets = []
                synonyms = []
                for synonym_set in synonym_sets:
                    synonyms.extend([w.encode('utf-8') for w in synonym_set])
                word_synonyms_dict[curr] = synonyms
                for synonym in synonyms:
                    if synonym in visited_words or synonym in queue_words_dict:
                        continue
                    q.put(synonym)
                    queue_words_dict[synonym] = 1
                    new_size += 1
                visited_words[curr] = 1
            old_size = new_size
            new_size = 0
            curr_level += 1
        with open('data/word_synonyms.json', 'w') as f:
            f.write(ujson.dumps(word_synonyms_dict))

    def connect(self, start_i=0, end_i=30000):
        with open('data/word_synonyms.json', 'r') as f:
            data = ujson.loads(f.read())
        word_dict = dict()
        for key in data.keys():
            word_dict[key] = 1
            for syn in data[key]:
                word_dict[syn] = 1
        connected_matrix = dict()
        for i, word in enumerate(word_dict):
            if i < start_i or i >= end_i:
                continue
            url = 'http://www.thesaurus.com/browse/' + '%20'.join(word.split())
            print url, i
            try:
                crawled_synonym_sets = self.work(url)
            except Exception as e:
                print e
                crawled_synonym_sets = []
            crawled_synonyms = []
            for synonym_set in crawled_synonym_sets:
                crawled_synonyms.extend([w.encode('utf-8') for w in synonym_set])
            exist_synonyms = []
            for synonym in crawled_synonyms:
                if synonym in word_dict:
                    exist_synonyms.append(synonym)
            connected_matrix[word] = exist_synonyms
        with open('data/connected_synonyms' + str(start_i) + '.json', 'w') as f:
            f.write(ujson.dumps(connected_matrix))

    def merge(self):
        json_files = [
            'data/connected_synonyms0.json',
            'data/connected_synonyms400.json',
            'data/connected_synonyms800.json',
            'data/connected_synonyms1200.json',
            'data/connected_synonyms1600.json',
            'data/connected_synonyms2000.json',
        ]

        merged = dict()
        for fname in json_files:
            with open(fname, 'r') as f:
                data = ujson.loads(f.read())
            print len(data)
            for key in data.keys():
                merged[key] = data[key]
        print len(merged)
        with open('data/connected_synonyms.txt', 'w') as f:
            f.write(ujson.dumps(merged))



sc = SynonymCrawler()
# sc.run()
# sc.connect(int(sys.argv[1]), int(sys.argv[2]))
# sc.merge()
