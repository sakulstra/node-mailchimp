"use strict";

const  _ = require('lodash');
const { URL, URLSearchParams } = require('url');
const fetch = require('node-fetch');

const btoa = (str) => Buffer.from(str).toString('base64')

function Mailchimp (api_key) {
  var api_key_regex = /.+\-.+/

  if (!api_key_regex.test(api_key)) {
    throw new Error('missing or invalid api key: ' + api_key)
  }


  this.__api_key = api_key;
  this.__base_url = "https://"+ this.__api_key.split('-')[1] + ".api.mailchimp.com/3.0"
}

var formatPath = function (path, path_params) {

  if (!path) {
    path = '/';
  }

  if (path[0] != '/') {
    path = '/' + path;
  }

  if (!path_params) {
    return path;
  }

  if (_.isEmpty(path_params)) {
    return path;
  }

  path = _.reduce(path_params, function (_path, value, param) {
    return _path.replace('{'+param+'}', value);
  }, path)
  
  return path;

}

Mailchimp.prototype.get = function (options, query) {
  options = _.clone(options) || {};

  if (_.isString(options)) {
    options = {
      path : options,
    }
  }
  options.method = 'get';

  if (query && options.query) {
    console.warn('query set on request options overwritten by argument query');
  }

  if (query) {
    options.query = query;
  }

  return this.request(options);
}

Mailchimp.prototype.post = function (options, body) {
  options = _.clone(options) || {};

  if (_.isString(options)) {
    options = {
      path : options,
    }
  }
  options.method = 'post';

  if (body && options.body) {
    console.warn('body set on request options overwritten by argument body');
  }

  if (body) {
    options.body = body;
  }

  return this.request(options);
}

Mailchimp.prototype.patch = function (options, body) {
  options = _.clone(options) || {};

  if (_.isString(options)) {
    options = {
      path : options,
    }
  }
  options.method = 'patch';

  if (body && options.body) {
    console.warn('body set on request options overwritten by argument body');
  }

  if (body) {
    options.body = body;
  }

  return this.request(options);
}

Mailchimp.prototype.put = function (options, body) {
  options = _.clone(options) || {};

  if (_.isString(options)) {
    options = {
      path : options,
    }
  }
  options.method = 'put';

  if (body && options.body) {
    console.warn('body set on request options overwritten by argument body');
  }

  if (body) {
    options.body = body;
  }

  return this.request(options);
}

Mailchimp.prototype.delete = function (options, done) {
  options = options || {};
  options = _.clone(options)
  if (_.isString(options)) {
    options = {
      path : options,
    }
  }
  options.method = 'delete';
  return this.request(options, done);
}

Mailchimp.prototype.request = async function (options) {
  var mailchimp = this;
  const url = new URL(
    encodeURI(mailchimp.__base_url+formatPath(options.path, options.path_params))
  );
  url.search = new URLSearchParams(options.query);
  const result = await  fetch(url, {
    method: options.method || 'get',
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
    headers: {
      authorization: 'Basic ' + btoa(`any:${mailchimp.__api_key}`),
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  return result.json()
}


module.exports = Mailchimp;
