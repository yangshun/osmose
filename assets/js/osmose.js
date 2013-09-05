var osm_dates = {

	short_month_names: [
	    "January", "February", "March",
	    "April", "May", "June",
	    "July", "August", "September",
	    "October", "November", "December"
	],

	shortMonthDateFormatting: function(time_string, upper_case) {
		var date_components = time_string.split('T')[0].split('-');
		var short_month_name = this.short_month_names[parseInt(date_components[1])-1].substr(0, 3);
		if (upper_case) {
			short_month_name = short_month_name.toUpperCase();
		}
		return short_month_name + ' ' + parseInt(date_components[2]);
	},

	timeAgo: function(time_string){
		// Facebook style of time ago string
		var new_time_string = (time_string || "").replace(/-/g,"/").replace(/[TZ]/g," ");

		var timeDiff = -(new Date()).getTimezoneOffset();

		var date = new Date(new_time_string);
		date.setMinutes(date.getMinutes() + 2*timeDiff);

		var diff = (((new Date()).getTime() - date.getTime()) / 1000),
		    day_diff = Math.floor(diff / 86400);

		if (isNaN(day_diff) || day_diff < 0) {
		    return;
		} 

		if (day_diff >= 31) {
			return this.shortMonthDateFormatting(time_string, true);
		}

		return day_diff == 0 && (
		        diff < 60 && "just now" ||
		        diff < 120 && "1 minute ago" ||
		        diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
		        diff < 7200 && "1 hour ago" ||
		        diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
		    day_diff == 1 && "Yesterday" ||
		    day_diff < 7 && day_diff + " days ago" ||
		    day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
	}
};

var osm_user = {
	getFacebookProfilePicture: function(fb_id) {
		return 'https://graph.facebook.com/' + fb_id + '/picture';
	}
};

var osmose_markdowns = {
	available_markdowns: [
		{ 	regex: /\(Y\)/g  , icon: 'thumbs-up' },
		// { 	regex: '\(:', icon: 'smile' },
	],

	convertToMarkdown: function(text) {
		
			text = text.replace(/\(Y\)/g, '<i class="icon-thumbs-up"></i>')
			.replace(/\(Y2\)/g, '<i class="icon-thumbs-up-alt"></i>')
			.replace(/\(:/g, '<i class="icon-smile"></i>')
			.replace(/:\)/g, '<i class="icon-smile"></i>')
			.replace(/:\(/g, '<i class="icon-frown"></i>')
			.replace(/\):/g, '<i class="icon-frown"></i>')
			.replace(/:\|/g, '<i class="icon-meh"></i>')
			.replace(/\|:/g, '<i class="icon-meh"></i>')
			.replace(/\[male\]/g, '<i class="icon-male"></i>')
			.replace(/\[female\]/g, '<i class="icon-female"></i>')
			.replace(/\[bulb\]/g, '<i class="icon-lightbulb"></i>')
			.replace(/\[warning\]/g, '<i class="icon-warning-sign"></i>')
			.replace(/\[music\]/g, '<i class="icon-music"></i>')
			.replace(/<3/g, '<i class="icon-heart"></i>')
			.replace(/\[heart\]/g, '<i class="icon-gittip"></i>')
			.replace(/\[star\]/g, '<i class="icon-star"></i>')
			.replace(/\[star2\]/g, '<i class="icon-star-empty"></i>')
			.replace(/\[tick\]/g, '<i class="icon-ok"></i>')
			.replace(/\[cross\]/g, '<i class="icon-remove"></i>')
			.replace(/\[flag\]/g, '<i class="icon-flag"></i>')
			.replace(/\[coffee\]/g, '<i class="icon-coffee"></i>')
			.replace(/\[apple\]/g, '<i class="icon-apple"></i>')
			.replace(/\[android\]/g, '<i class="icon-android"></i>')
			.replace(/\[facebook\]/g, '<i class="icon-facebook-sign"></i>')
			.replace(/\[github\]/g, '<i class="icon-github"></i>')
			.replace(/\[instagram\]/g, '<i class="icon-instagram"></i>')
			.replace(/\[skype\]/g, '<i class="icon-skype"></i>')
			.replace(/\[tumblr\]/g, '<i class="icon-tumblr"></i>')
			.replace(/\[twitter\]/g, '<i class="icon-twitter"></i>')
			.replace(/\[youtube\]/g, '<i class="icon-youtube"></i>')
			.replace(/<script>/g, '&lt;script&gt;')
			.replace(/<\/script>/g, '&lt;/script&gt;');
			return text;
	},

	linkify: function(text) {
	    var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

        // www. sans http:// or https://
        var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

        // Email addresses
        var emailAddressPattern = /\w+@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6})+/gim;

        return text
            .replace(urlPattern, '<a href="$&">$&</a>')
            .replace(pseudoUrlPattern, '$1<a href="http://$2">$2</a>')
            .replace(emailAddressPattern, '<a href="mailto:$&">$&</a>');
	},

	osmosifyContent: function(text) {
		text = this.linkify(text);
		text = this.convertToMarkdown(text);
		return text;
	}
}
