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
		console.log(new_time_string);
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
}