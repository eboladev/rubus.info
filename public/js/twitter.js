/* This uses the jQuery Tweets plugin, available at
 *+  http://www.bahiastudio.net/labs/freebies/tweets/
 *+ updated by me, and located at
 *+  https://github.com/duckinator/jQuery-Tweets
 */

function twitter(username, identifier, num_tweets, show_avatar) {
  if(typeof(num_tweets) == "undefined")
    num_tweets = 4;

  if(typeof(show_avatar) == "undefined")
    show_avatar = true;
  
  $(identifier).tweets({
    tweets: num_tweets,
    username: username,
    avatar: show_avatar,
  });
}