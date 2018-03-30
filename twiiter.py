import tweepy
from tweepy import Stream
from tweepy.streaming import StreamListener
import json


consumer_key = 'bfUlTsMntqaesbd1AZPbBkyBD'
consumer_secret = '0j6vbKOTEZxr1l2sSyGXxJ5Pz4GFoTVWraPa1xoR7PSTnK7ozg'
access_token = '1012296254-pTSGwiEimAZy2tYj6MCSQDQ8rOKZMwdT8D0jdeR'
access_token_secret = 'D18d1MdGuGkec8HJVJlvUCYnA00OpgnC7r3TDCrpOlLbn'


class twitter():
    """A twitter class that process tweets
    """
    api = None
    auth = None

    def __init__(self,consumer_k,consumer_s,access_t,access_s):
        auth = tweepy.OAuthHandler(consumer_k, consumer_s)
        auth.set_access_token(access_t, access_s)
        self.api = tweepy.API(auth)
        self.auth = auth

    def get_user(self,id):
        return api.get_user(id)

    def get_follower(self,id):
        return api.get_follower(id)



class MyStreamListener(tweepy.StreamListener):

    def on_data(self, data):
        """What to do when tweet data is received."""
        data = json.loads(data)
        if "text" not in data: #if this isn't a status post then do nothing with data.
            return True
        print(data)

    def on_error(self, status_code):
        if status_code == 420:
            #returning False in on_data disconnects the stream
            return False

if __name__ == '__main__':

    # api = register(consumer_key,consumer_secret,access_token,access_token_secret)
    #
    # public_tweets = api.home_timeline()
    # for tweet in public_tweets:
    #     print (tweet.text)
    # user = api.get_user('BrianBinliu')
    # print (user.screen_name)
    # print (user.followers_count)
    # for friend in user.friends():
    #    print (friend.screen_name)
    mytwitter = twitter(consumer_key,consumer_secret,access_token,access_token_secret)
    myStreamListener = MyStreamListener()
    myStream = tweepy.Stream(auth = mytwitter.auth, listener=myStreamListener)
    # myStream.filter(track=['muisc','cover','original','song'],async=True)

    print(mytwitter.api.search("hey"))
