jCookie.js
==========

jQuery plugin that provides an easy way to get, set, and delete cookies in JavaScript. Released under GPL 3.0

Why?
----


There are a couple of cookie libraries available, but they come with a set of limitations that are annoying in my opinion, such as not caching cookie values when you update their values. There also have been no use of one of the greatest things about JavaScript - events. This plugin does both.

Normalization
-------------

jCookie automatically `URIComponentDecode()` and `URIComponentEncode()` and will attempt to `JSON.parse()` and `JSON.stringify()` when you get and set cookies, respectively.

Tracking Changes with Events
----------------------------

jCookie provides one event on `$(document)`. You can fire a function when a cookie set like this:

```
$(document).on('cookieset', function(e, name, val) {
	console.log(name + ' => ' + value); // Or whatever other code you want to put here
});
```

Usage
-----

### Get

You can get a cookie using `$.cookie()` or `$.getCookie()` or `$.getAllCookies()[]`. The `$.cookie` function is a wrapper for all of jCookie's functionality.

Here are some examples for getting a cookie `testcookie`, all giving you the same end result:


``
var cookie = $.cookie('testcookie');
``

``
var cookie = $.getCookie('testcookie');
``

``
var cookie = $.getAllCookies()['testcookie'];
``

### Set

You can set a cookie's value using `$.cookie()`, or `$.setCookie()`. The `$.cookie` function is a wrapper for all of jCookie's functionality.

These functions take 3 parameters:

* `name`: The cookie's name

* `value`: The value to set the cookie to

* `opts`: Object of options. There are 4 (totally optional) options available:
	* `expires`: The expiration time. Either an *int* or UTC-formatted date time string, such as `'Thu, 01 Jan 1970 00:00:00 GMT'`.
	* `path`: This decides what owns the cookie. By default the page the User is on will own the cookie. Set to `'/'` to use site-wide.
	* `domain`: The domain that this cookie should be associated with
	* `secure`: The cookie secure flag. If this is set you will only be able to access this cookie over SSL

	You can read on how each of these works in the HTTP cookie documentation. This [Wikipedia article](http://en.wikipedia.org/wiki/HTTP_cookie) is very useful as well.

**Here are some examples:**

``
$.cookie('testcookie', 'super!');
``

With path variable to make cookie site-wide:

``
$.setCookie('testcookie', 'Site-wide!', {path: '/'});
``

### Delete

You can delete a cookie using `$.cookie()` and setting the `value` argument to `false`, or by using `$.delCookie()`.

jCookie uses the W3Schools way of deleting cookies here, setting the expires date to `Jan 1st, 1970`, instead of just setting it to a negative value. This is because in testing I found that just setting a negative value in WebKit browsers will cause the browser to set the cookie to be deleted at the end of the browser session, instead of immediately.

**Examples:**

``
$.cookie('testcookie', false);
``

``
$.delCookie('testcookie');
``