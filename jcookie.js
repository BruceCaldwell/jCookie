(function ($) {
	$(document).ready(function () {
		var cookies = {}, rawCookies;

		var parseCookieVal = function (val) {
			if (val.indexOf('"') === 0) val = val.replace(/^!\\"/g, '').replace(/\\\\/g, '\\');
			return decodeURIComponent(val);
		};

		var setCookie = $.setCookie = function (name, val, opts) {
			if (!name || val === undefined) return false;

			if (!opts) opts = {};
			if (val instanceof Object || val instanceof Array) val = JSON.stringify(val);
			if (!val) val = '';

			if (opts.hasOwnProperty('expires')) {
				var exp;

				if (opts.expires instanceof Number) {
					var date = new Date();
					date.setTime(date.getTime() + opts.expires);
					exp = date.toUTCString();
				}
				else exp = opts.expires.toString();
			}

			var cookieString = name + '=' + parseCookieVal(val);
			cookieString += (exp) ? '; expires=' + exp : '';
			cookieString += (opts.path) ? '; path=' + opts.path : '';
			cookieString += (opts.domain) ? '; domain=' + opts.domain : '';
			cookieString += (opts.secure) ? '; secure' : '';

			cookies[name] = val;
			$(document).trigger('cookieset', [name, val]);

			return document.cookie = cookieString;
		};

		var getAllCookies = $.getAllCookies = function () {
			// We don't want to be able to reference the hidden variable here.
			return JSON.parse(JSON.stringify(cookies));
		};

		var getCookie = $.delCookie = function (name) {
			if (name === undefined) return getAllCookies();
			if (cookies.hasOwnProperty(name)) return cookies[name];

			return false;
		};

		var delCookie = $.delCookie = function (name) {
			if (!name) return false;

			if (cookies.hasOwnProperty(name)) delete cookies[name];

			// We use the W3Schools way here. In tests with Webkit, setting expires to something like -1
			// just causes the cookie to be set to expire when the browser is closed. This fixes that.
			return setCookie(name, '', {expires: 'Thu, 01 Jan 1970 00:00:00 GMT'});
		};

		$.cookie = function (name, value, opts) {
			if (name === undefined) return getAllCookies();
			if (value === false) return delCookie(name);
			if (value === undefined) return getCookie(name);
			return setCookie(name, value, opts);
		};

		if (document.cookie.length && (rawCookies = document.cookie.split(';'))) {
			// prototype.forEach() is supported every browser I have tested in.
			// This can be changed to a for() loop if it becomes necessary.
			rawCookies.forEach(function (s) {
				var cookie = s.split('=');
				cookie[0] = cookie[0].trim();
				cookie[1] = cookie[1].trim();

				try {
					var obj = JSON.parse(parseCookieVal(cookie[1]));
					cookies[cookie[0]] = cookie[1];
				}
				catch (err) {
					cookies[cookie[0]] = parseCookieVal(cookie[1]);
				}
			});
		}
	});
})(jQuery);