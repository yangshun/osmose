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
		var date = new Date(new_time_string),
		    diff = (((new Date()).getTime() - date.getTime()) / 1000),
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
	convert_to_markdown: function(text) {
		text = text.replace(/\(Y\)/g, '<i class="icon-thumbs-up"></i>');
		text = text.replace(/\(Y2\)/g, '<i class="icon-thumbs-up-alt"></i>');
		text = text.replace(/\(:/g, '<i class="icon-smile"></i>');
		text = text.replace(/:\)/g, '<i class="icon-smile"></i>');
		text = text.replace(/:\(/g, '<i class="icon-frown"></i>');
		text = text.replace(/\):/g, '<i class="icon-frown"></i>');
		text = text.replace(/:\|/g, '<i class="icon-meh"></i>');
		text = text.replace(/\|:/g, '<i class="icon-meh"></i>');
		text = text.replace(/\[male\]/g, '<i class="icon-male"></i>');
		text = text.replace(/\[female\]/g, '<i class="icon-female"></i>');
		text = text.replace(/\[bulb\]/g, '<i class="icon-lightbulb"></i>');
		text = text.replace(/\[music\]/g, '<i class="icon-music"></i>');
		text = text.replace(/<3/g, '<i class="icon-heart"></i>');
		text = text.replace(/\[heart\]/g, '<i class="icon-gittip"></i>');
		text = text.replace(/\[star\]/g, '<i class="icon-star"></i>');
		text = text.replace(/\[star2\]/g, '<i class="icon-star-empty"></i>');
		text = text.replace(/\[tick\]/g, '<i class="icon-ok"></i>');
		text = text.replace(/\[cross\]/g, '<i class="icon-remove"></i>');
		text = text.replace(/\[flag\]/g, '<i class="icon-flag"></i>');
		text = text.replace(/\[coffee\]/g, '<i class="icon-coffee"></i>');
		text = text.replace(/\[apple\]/g, '<i class="icon-apple"></i>');
		text = text.replace(/\[android\]/g, '<i class="icon-android"></i>');
		text = text.replace(/\[facebook\]/g, '<i class="icon-facebook-sign"></i>');
		text = text.replace(/\[github\]/g, '<i class="icon-github"></i>');
		text = text.replace(/\[instagram\]/g, '<i class="icon-instagram"></i>');
		text = text.replace(/\[skype\]/g, '<i class="icon-skype"></i>');
		text = text.replace(/\[tumblr\]/g, '<i class="icon-tumblr"></i>');
		text = text.replace(/\[twitter\]/g, '<i class="icon-twitter"></i>');
		text = text.replace(/\[youtube\]/g, '<i class="icon-youtube"></i>');
		text = text.replace(/<script>/g, '&lt;script&gt;');
		text = text.replace(/<\/script>/g, '&lt;/script&gt;');
		return text;
	}
}