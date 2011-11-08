function github(username, identifier, limit) {
	var items = [];
	if(!limit)
		limit = 10;

	$.getJSON('https://api.github.com/users/' + username + '/repos?callback=?', function(data){
		$.each(data.data, function(id, repo){
			$('<li data-pushed-at="' + repo.pushed_at + '"><p><a href="' + repo.html_url + '">' + repo.name + '</a> (' + repo.forks + ' forks, ' + repo.watchers + ' watchers)</p>' +
				'<p>' + repo.description + '</p></li>').appendTo(identifier);
		});

		$(identifier + ' li').sortElements(function(a, b){
			return a.getAttribute('data-pushed-at') < b.getAttribute('data-pushed-at') ? 1 : -1;
		});

		$.each($(identifier + ' li'), function(index, li){
			if(index >= limit)
				li.style.display = 'none';
		});
	});
}