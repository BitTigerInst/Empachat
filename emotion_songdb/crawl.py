from selenium import webdriver
from selenium.common import exceptions
from time import sleep
import sys
import ujson

CLICK_WAIT_TIME = 2

class ThesixtyoneCrawler:
    def __init__(self):
        self.driver = webdriver.Firefox()

    def open_page(self):
        self.driver.get('http://www.thesixtyone.com')
        sleep(CLICK_WAIT_TIME)

    def get_song(self, tag):
        result = []
        link_tag = self.driver.find_element_by_link_text(tag)
        sleep(CLICK_WAIT_TIME)
        link_tag.click()
        sleep(CLICK_WAIT_TIME)
        title_a_tags = self.driver.find_elements_by_xpath('//span[@id="miniplayer_song_title"]/a')
        if not title_a_tags:
            print 'title_tags not found'
            return result
        title = title_a_tags[0].get_attribute('title')
        artist_tags = self.driver.find_elements_by_xpath('//div[@id="miniplayer_artist_name"]/a')
        if not artist_tags:
            print 'artist_tags not found'
            artist = ''
        else:
            artist = artist_tags[0].text
        result = {
            'title': title,
            'artist': artist
        }
        print title, artist
        return result

def main(word_index_start, word_index_end, num_songs):
    word_list = ['mellow', 'upbeat', 'relax', 'crazy', 'lovely',
        'happy', 'trippy', 'nice', 'chill', 'soft',
        'slow', 'party', 'smooth', 'sad', 'rocky', 'love', 'funny']
    crawler = ThesixtyoneCrawler()
    crawler.open_page()
    for i in range(word_index_start, word_index_end + 1):
        if i > len(word_list):
            break
        for j in range(0, num_songs):
            result = crawler.get_song(word_list[i])
            with open('data/' + word_list[i] + '.txt', 'a') as f:
                f.write(ujson.dumps(result).encode('utf-8') + '\n')

main(int(sys.argv[1]), int(sys.argv[2]), int(sys.argv[3]))
