jQuery.fn.thumbnails = function(user_options) {
	var options = {
		amount: 10
	};
	if (user_options.amount) {
		options.amount = user_options.amount;
	}

	var that = this;
	var container_height = this.height();
	var container_width = this.width();
	console.log(container_width, container_height);
	$.get('/api/facebook/random-users/' + options.amount, function(res) {
		console.log('response')
		console.log(res);
		var id_list = res.data;

		function preloadImages(callback) {
	    	for (var i = 0; i < id_list.length; i++) {
				var img = new Image();
				var url = 'http://graph.facebook.com/' + id_list[i].id + '/picture'
				img.src = url;
				id_list[i].img = img;

	    	}
	    	if (callback && typeof(callback) === "function") {
	    		console.log('callback');
	    		callback();
	    	}
	    }

	    function appendImages() {
	    	function appendAfterDelay($item, duration) { 
				setTimeout(function() {
					$item.addClass('appeared');	
				}, duration);
			}

			for (var i = 0; i < id_list.length; i++) {
				var $thumb = $('<img>').attr('class', 'thumbnail');
				$thumb.attr('src', 'https://graph.facebook.com/' + id_list[i] + '/picture');
				that.append($thumb);
				appendAfterDelay($thumb, i * 150);
			}
		}

		preloadImages(appendImages);
	});
	console.log('thumbnail')
}
