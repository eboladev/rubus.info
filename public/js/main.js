function update_twitter() {
	$('#twitter').text('');
	twitter('duckinator', '#twitter');
}

$(document).ready(function(){
	legacyfix();
	rot_all();
	mailfix();

	/*if ($('#twitter')) {
		// This is so people w/out JS don't see a random "Twitter" on the right
		$('#twitter_header').text('Twitter');
		update_twitter(4); // Initial update
		setInterval(update_twitter, 120000);  // Every 2  minutes
	}*/
});

