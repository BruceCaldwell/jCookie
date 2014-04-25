(function ($) {
	/*
	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 */
	var cookies = {}, rawCookies;

	var parseCookieVal = function (val) {
		val = String(val);
		if (val.indexOf('"') === 0 && val.substr(-1) === '"')
			val = val.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		return decodeURIComponent(val.replace(/\+/g, ' '));
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

		var cookieString = name + '=' + encodeURIComponent(val);
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

	var getCookie = $.getCookie = function (name) {
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
				cookies[cookie[0]] = JSON.parse(parseCookieVal(cookie[1]));
			}
			catch (err) {
				cookies[cookie[0]] = parseCookieVal(cookie[1]);
			}
		});
	}
})(jQuery);
