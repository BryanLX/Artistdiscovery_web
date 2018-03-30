#!/usr/bin/env python
# Copyright 2015 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""This script uses the Twitter Streaming API, via the tweepy library,
to pull in tweets and publish them to a PubSub topic.
"""

import base64
import datetime
import os
import json
import time

import datetime
import time
from http.client import IncompleteRead
import analysis

import dateutil.parser
from tweepy import OAuthHandler
from tweepy import Stream
from tweepy.streaming import StreamListener


# Get your twitter credentials from the environment variables.
# These are set in the 'twitter-stream.json' manifest file.
consumer_key = 'bfUlTsMntqaesbd1AZPbBkyBD'
consumer_secret = '0j6vbKOTEZxr1l2sSyGXxJ5Pz4GFoTVWraPa1xoR7PSTnK7ozg'
access_token = '1012296254-pTSGwiEimAZy2tYj6MCSQDQ8rOKZMwdT8D0jdeR'
access_token_secret = 'D18d1MdGuGkec8HJVJlvUCYnA00OpgnC7r3TDCrpOlLbn'

PUBSUB_TOPIC = 'projects/social-197017/topics/new_tweets'
NUM_RETRIES = 3


def publish(client, pubsub_topic, data_lines):
    """Publish to the given pubsub topic."""
    messages = []
    for line in data_lines:
        pub = base64.urlsafe_b64encode(line)
        messages.append({'data': pub})
    body = {'messages': messages}
    resp = client.projects().topics().publish(
            topic=pubsub_topic, body=body).execute(num_retries=NUM_RETRIES)
    return resp


class StdOutListener(StreamListener):
    """A listener handles tweets that are received from the stream.
    This listener dumps the tweets into a PubSub topic
    """

    count = 0
    twstring = ''
    tweets = []
    batch_size = 50
    total_tweets = 10000000

    def write_to_pubsub(self, tw):
        publish(self.client, PUBSUB_TOPIC, tw)

    def on_data(self, data):
        """What to do when tweet data is received."""
        data = json.loads(data)
        if "text" not in data: #if this isn't a status post then do nothing with data.
            return True
        else:
            data=tweet_clean(data)
        analysis.analysis_text(data)
        self.tweets.append(data)
        if len(self.tweets) >= self.batch_size:
            # self.write_to_pubsub(self.tweets)
            self.tweets = []
        self.count += 1
        # if we've grabbed more than total_tweets tweets, exit the script.
        # If this script is being run in the context of a kubernetes
        # replicationController, the pod will be restarted fresh when
        # that happens.
        if self.count > self.total_tweets:
            return False

        return True

    def on_error(self, status_code):
        if status_code == 420:
            #returning False in on_data disconnects the stream
            return False


def tweet_clean(data: dict):
    """clean and prepare data"""
    res = {}
    for k,v in data.items():
        if(k=="id"):
            res[k] = int(v)
        elif k=="text" :
            res[k]=str(v)
        elif k=="user":
            res["user_id"]=v["id"]
            # changed
            res["user_screen_name"] = str(v["screen_name"])
        elif k=="created_at":
            res[k]=str(dateutil.parser.parse(v))
        elif k=="in_reply_to_status_id":
            if v!=None:
                res[k]=int(v)
        elif k=="in_reply_to_user_id":
            if v != None:
                res[k]=int(v)
        elif k=="has_coordinates":
            res[k]=v
        elif k=="coordinates":
            if(v!=None and "coordinates" in v and len(v["coordinates"])==2):
                res["longitude"]=v["coordinates"][0]
                res["latitude"]=v["coordinates"][1]
        elif k=="place":
            if v!=None and "id" in v:
                res["place_id"]=v["id"]
        elif k=="quoted_status_id":
            if v != None:
                res[k]=int(v)
        elif k=="is_quoted_status":
            res[k]=v
        elif k=="quote_count":
            res[k]=int(v)
        elif k=="reply_count":
            res[k]=int(v)
        elif k=="retweet_count":
            res[k]=int(v)
        elif k=="favorite_count":
            res[k]=int(v)
        elif k=="entities":
            if "hashtags" in v and v["hashtags"]!=[]:
                res["hashtags"]=list(ht["text"] for ht in v["hashtags"] if "text" in ht)
            if "urls" in v and v["urls"]!=[]:
                res["expanded_urls"] = list(u["expanded_url"] for u in v["urls"] if "expanded_url" in u)
            if "user_mentions" in v and v["user_mentions"]!=[]:
                res["user_mentions"] = list(u["id"] for u in v["user_mentions"] if "id" in u)
        elif k=="filter_level":
            res[k]=v
        elif k=="user_id":
            res[k]=int(v)
    return res
if __name__ == '__main__':
    print ('....')
    listener = StdOutListener()
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)

    # print 'stream mode is: %s' % os.environ['TWSTREAMMODE']

    stream = Stream(auth, listener)
    # set up the streaming depending upon whether our mode is 'sample', which
    # will sample the twitter public stream. If not 'sample', instead track
    # the given set of keywords.
    # This environment var is set in the 'twitter-stream.yaml' file.

    print ("starting time:")
    print(datetime.datetime.now())
    while True:
        try:
            # Connect/reconnect the stream
            stream = Stream(auth, listener)
            # DON'T run this approach async or you'll just create a ton of streams!
            stream.filter(
                    track=['original','cover','song',],
                    languages=['en',],
                    
                    )
        except KeyboardInterrupt:
            # Or however you want to exit this loop
            stream.disconnect()
            break
        except :
            # Oh well, reconnect and keep trucking
            continue
