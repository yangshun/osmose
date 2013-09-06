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

	convertEmoticons: function(text) {
		text = text.replace(/\(Y\)/gi, '<i class="icon-thumbs-up"></i>')
			.replace(/\(Y2\)/gi, '<i class="icon-thumbs-up-alt"></i>')
			.replace(/\(:/gi, '<i class="icon-smile"></i>')
			.replace(/:\)/gi, '<i class="icon-smile"></i>')
			.replace(/:\(/gi, '<i class="icon-frown"></i>')
			.replace(/\):/gi, '<i class="icon-frown"></i>')
			.replace(/:\|/gi, '<i class="icon-meh"></i>')
			.replace(/\|:/gi, '<i class="icon-meh"></i>')
			.replace(/\[male\]/gi, '<i class="icon-male"></i>')
			.replace(/\[female\]/gi, '<i class="icon-female"></i>')
			.replace(/\[bulb\]/gi, '<i class="icon-lightbulb"></i>')
			.replace(/\[warning\]/gi, '<i class="icon-warning-sign"></i>')
			.replace(/\[music\]/gi, '<i class="icon-music"></i>')
			.replace(/<3/gi, '<i class="icon-heart"></i>')
			.replace(/\[heart\]/gi, '<i class="icon-gittip"></i>')
			.replace(/\[star\]/gi, '<i class="icon-star"></i>')
			.replace(/\[star2\]/gi, '<i class="icon-star-empty"></i>')
			.replace(/\[tick\]/gi, '<i class="icon-ok"></i>')
			.replace(/\[cross\]/gi, '<i class="icon-remove"></i>')
			.replace(/\[flag\]/gi, '<i class="icon-flag"></i>')
			.replace(/\[coffee\]/gi, '<i class="icon-coffee"></i>')
			.replace(/\[apple\]/gi, '<i class="icon-apple"></i>')
			.replace(/\[android\]/gi, '<i class="icon-android"></i>')
			.replace(/\[facebook\]/gi, '<i class="icon-facebook-sign"></i>')
			.replace(/\[github\]/gi, '<i class="icon-github"></i>')
			.replace(/\[instagram\]/gi, '<i class="icon-instagram"></i>')
			.replace(/\[skype\]/gi, '<i class="icon-skype"></i>')
			.replace(/\[tumblr\]/gi, '<i class="icon-tumblr"></i>')
			.replace(/\[twitter\]/gi, '<i class="icon-twitter"></i>')
			.replace(/\[youtube\]/gi, '<i class="icon-youtube"></i>')

		return text;
	},

	convertMediaMarkdown: function(text) {
		function youtube_embeded_link(str, m1) {
			return m1.replace('https://', '').replace('http://', '').replace(/(?:http:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g, '<iframe width="420" height="345" src="http://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>');
		}

		function full_url(str, m1) {
			var url = m1;
			if (url.search('://') == -1) {
				url = '//' + url;
			}

			return "<a href='" + url + "' target='_blank'>" + m1 + "</a>";
		}

		text = text.replace(/\[img:(.*)\]/g, '<img src=$1 />')
			.replace(/\[youtube:(.*)\]/g, youtube_embeded_link)
			.replace(/\[link:(.*)\]/g, full_url);
			return text;	
	},

	convertToMarkdown: function(text, format_media) {
		text = this.convertEmoticons(text);
		if (format_media) {
			text = this.convertMediaMarkdown(text);
		}
		return text;
	},

	// linkify: function(text) {
	//     var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

 //        // www. sans http:// or https://
 //        var pseudoUrlPattern = /(?:<img.+>)|(^|[^\/])(www\.[\S]+(\b|$))/gim;

 //        // Email addresses
 //        var emailAddressPattern = /\w+@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6})+/gim;

 //        return text
 //            .replace(urlPattern, '<a href="$&">$&</a>')
 //            .replace(pseudoUrlPattern, '$1<a href="http://$2">$2</a>')
 //            .replace(emailAddressPattern, '<a href="mailto:$&">$&</a>');
	// },

	osmosifyContent: function(text, emoticons_only) {
		function safe_tags(str) {
    	return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') ;
		}
		function nl2br(str) {
			return str.replace(/\\n/g, '<br>');
		}
		function nl2br (str, is_xhtml) {   
			var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
			return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
		}

		text = nl2br(safe_tags(text), false);
		text = this.convertToMarkdown(text, emoticons_only);
		return text;
	}
}
