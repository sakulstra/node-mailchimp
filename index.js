"use strict";

const { URL, URLSearchParams } = require("url");
const fetch = require("node-fetch");
const md5 = require("md5");

const btoa = str => Buffer.from(str).toString("base64");

function Mailchimp(api_key) {
  var api_key_regex = /.+\-.+/;

  if (!api_key_regex.test(api_key)) {
    throw new Error("missing or invalid api key: " + api_key);
  }

  this.__api_key = api_key;
  this.__base_url =
    "https://" + this.__api_key.split("-")[1] + ".api.mailchimp.com/3.0";
}

const formatPath = function(path) {
  if (!path) {
    path = "/";
  }

  if (path[0] !== "/") {
    path = "/" + path;
  }

  return path;
};

Mailchimp.prototype.get = function(options = {}, query) {
  if (typeof options === "string") {
    options = {
      path: options
    };
  }
  options.method = "get";

  if (query && options.query) {
    console.warn("query set on request options overwritten by argument query");
  }

  if (query) {
    options.query = query;
  }

  return this.request(options);
};

Mailchimp.prototype.post = function(options = {}, body) {
  if (typeof options === "string") {
    options = {
      path: options
    };
  }
  options.method = "post";

  if (body && options.body) {
    console.warn("body set on request options overwritten by argument body");
  }

  if (body) {
    options.body = body;
  }

  return this.request(options);
};

Mailchimp.prototype.patch = function(options = {}, body) {
  if (typeof options === "string") {
    options = {
      path: options
    };
  }
  options.method = "patch";

  if (body && options.body) {
    console.warn("body set on request options overwritten by argument body");
  }

  if (body) {
    options.body = body;
  }

  return this.request(options);
};

Mailchimp.prototype.put = function(options = {}, body) {
  if (typeof options === "string") {
    options = {
      path: options
    };
  }
  options.method = "PUT";

  if (body && options.body) {
    console.warn("body set on request options overwritten by argument body");
  }

  if (body) {
    options.body = body;
  }

  return this.request(options);
};

Mailchimp.prototype.delete = function(options = {}, done) {
  if (typeof options === "string") {
    options = {
      path: options
    };
  }
  options.method = "delete";
  return this.request(options, done);
};

Mailchimp.prototype.request = async function(options) {
  var mailchimp = this;
  const url = new URL(
    encodeURI(mailchimp.__base_url + formatPath(options.path))
  );
  url.search = new URLSearchParams(options.query);
  const result = await fetch(url, {
    method: options.method || "get",
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
    headers: {
      authorization: "Basic " + btoa(`any:${mailchimp.__api_key}`),
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
  return result.json();
};

Mailchimp.prototype.subscribe = function(data, list) {
  const hash = md5(data.email_address.toLowerCase());
  return this.put({
    body: { status: "subscribed", ...data },
    path: `/lists/${list}/members/${hash}`
  });
};

Mailchimp.prototype.unsubscribe = function(data, list) {
  const hash = md5(data.email_address.toLowerCase());
  return this.patch({
    body: { status: "unsubscribed" },
    path: `/lists/${list}/members/${hash}`
  });
};

Mailchimp.prototype.update = function(data, list) {
  const { email_address, ...rest } = data;
  const hash = md5(email_address.toLowerCase());
  return this.put({
    body: { ...rest },
    path: `/lists/${list}/members/${hash}`
  });
};

module.exports = Mailchimp;
