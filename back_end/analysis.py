import nltk
from nltk.corpus import stopwords
from nltk.tokenize import sent_tokenize,word_tokenize,PunktSentenceTokenizer
import json
import datetime

# lexicon and corporas
# corpora - body of test. ex: presidential speeches, english language
# lexicon - words and their means

stop_words = set(stopwords.words("english"))

def analysis_sentence(sent):
    try:
        words = word_tokenize(sent)
        if sent.find("cover by")==1:
            return 1;
        if "original" in words and "song" in words:
            return 1;

        tagged =nltk.pos_tag(words)

        return 0;

    except Exception as e:
        print(str(e))

def analysis_text(data):

    text = data['text']
    sent_token = sent_tokenize(text)
    recommend =""
    ## Check if a data contains video links
    ## Get rid of tweets that contains no video
    if "expanded_urls" not in data:
        return
    bl = False
    for item in data["expanded_urls"]:
        if "youtu" in item or "soundcloud" in item:
            bl =True
    if bl == False:
        return

    for sentence in sent_token:

        result = analysis_sentence(sentence)
        if result == 1:
            print(extract_contact(data))


def extract_contact(data):
    header = 'twitter.com/'
    print(datetime.datetime.now())
    print ("Got one tweet with relavent information.")
    print ("Tweet:")
    print (data)
    print ("Name and contact link:")
    name = data['user_screen_name']

    return (name,header+name)
if __name__ == '__main__':
    with open('test.json','r') as json_data:
        while (json_data.readline()):
            text = json_data.readline()
            d = json.loads(text)
            analysis_text(d)
