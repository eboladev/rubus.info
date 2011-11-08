/*
*	jQuery Tweet v0.3
*	written by Nick Markwell and Diego Peralta
*
*	Copyright (c) 2011 Nick Markwell (http://duckinator.net)
*	Copyright (c) 2010 Diego Peralta (http://www.bahiastudio.net/)
*	Dual licensed under the MIT (MIT-LICENSE.txt)
*	and GPL (GPL-LICENSE.txt) licenses.
*	Built using jQuery library 
*
*	Options:
*		- before (string): HTML code before the tweet.
*		- after (string): HTML code after the tweet.
*		- tweets (numeric): number of tweets to display.
*		- loader (bool): 
*		- avatar (bool):
*	
*	Example: 
*	
*		<script type="text/javascript" charset="utf-8">
*   		$(document).ready(function() {
*      			$('#tweets').tweets({
*          			tweets: 4,
*          			username: "diego_ar",
*					avatar: true
*      			});
*  			});
*		</script>
*
*/
(function($){
	$.fn.tweets = function(options) {
		$.ajaxSetup({ cache: true });
		var defaults = {
			tweets: 5,
			before: "<li>",
			after: "</li>",
			loader: true,
			avatar: true,
			linkify: true,
		};
		var options = $.extend(defaults, options);
		function relative_time(time_value) {
			var parsed_date = Date.parse(time_value);
			var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
			var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
			var pluralize = function (singular, n) {
				return '' + n + ' ' + singular + (n == 1 ? '' : 's');
			};
			if(delta < 60) {
				return 'less than a minute ago';
			} else if(delta < (45*60)) {
				return 'about ' + pluralize("minute", parseInt(delta / 60)) + ' ago';
			} else if(delta < (24*60*60)) {
				return 'about ' + pluralize("hour", parseInt(delta / 3600)) + ' ago';
			} else {
				return 'about ' + pluralize("day", parseInt(delta / 86400)) + ' ago';
			}
		}

		function generate_avatar(tweet) {
			return '<span><a href="http://twitter.com/' + tweet.from_user + '"><img width="48" height="48" src="' + tweet.profile_image_url + '" alt=""></a></span>';
		}

		function generate_footer(tweet) {
			return '<small data-time="' + tweet.created_at + '" class="footer"><a href="http://twitter.com/' + options.username + '/status/' + tweet.id_str + '">' + relative_time(tweet.created_at) + '</a></small>';
		}

		function linkify(text) {
			/* linkify() is borrowed from @joaobarbosa's fork of jQuery-Tweets:
			 * https://github.com/joaobarbosa/jQuery-Tweets/blob/6422f8f368bcce017849f496b46062277080f2a4/js/jquery.tweets.0.1.js#L30
			 */
			var regexpUrl = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi;
			var regexpUser = /[\@]+([A-Za-z0-9-_]+)/gi;
			var regexpHash = /(?:^| )[\#]+([A-Za-z0-9-_]+)/gi;
			text = text.replace(regexpUrl,'<a class="link" href="$1">$1</a>');
			text = text.replace(regexpUser,'<a class="mention" href="http://twitter.com/$1">@$1</a>');
			text = text.replace(regexpHash,' <a class="hashtag" href="https://search.twitter.com/search?tag=$1&lang=all">#$1</a>');
			return text;
		}

		return this.each(function() {
			var obj = $(this);
			$.getJSON('http://search.twitter.com/search.json?callback=?&rpp=' + options.tweets + '&q=from:' + options.username,
				function(data) {
					$.each(data.results, function(i, tweet) {
						if(tweet.text !== undefined) {
							var str = options.before;
							if (options.avatar)
								str += generate_avatar(tweet);

							str += '<span class="text">';
							if (options.linkify)
								str += linkify(tweet.text)
							else
								str += tweet.text

							str += '</span>';

							str += generate_footer(tweet) + options.after;
							$(obj).append(str);
						}
					});
				}
			);
		});
	};
})(jQuery);