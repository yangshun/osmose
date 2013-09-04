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

var osmose_markups = {
	available_markups: [
		{ 	regex: /\(Y\)/g  , icon: 'thumbs-up' },
		// { 	regex: '\(:', icon: 'smile' },
	],
	convert_to_markup: function(text) {
		text = text.replace(/\(Y\)/g, '<i class="icon-thumbs-up"></i>');
		text = text.replace(/\(Y2\)/g, '<i class="icon-thumbs-up-alt"></i>');
		text = text.replace(/\(:/g, '<i class="icon-smile"></i>');
		text = text.replace(/\[star\]/g, '<i class="icon-star"></i>');
		text = text.replace(/\[star2\]/g, '<i class="icon-star-empty"></i>');
		text = text.replace(/\[tick\]/g, '<i class="icon-ok"></i>');
		text = text.replace(/<3/g, '<i class="icon-heart"></i>');
		return text;
	}
}