This package is highly inspired by https://github.com/thorning/node-mailchimp but aiming for another purpose:
as small as possible while providing only the features we actually need

# Differences to the mailchimp-api-v3 package
- no dependency on bluebird which makes node 8 the lowest compatible engine
- no callback support
- no lodash
- node-fetch instead of request
- for now *no batching support*
- errors are only throw when there was an actual error `mid-flight` in every other case you'll get a response object containing the error inside status
- jest instead of mocha


Mailchimp api wrapper for v3 of the mailchimp api, with batch handling. Supports both promise and callback handling.

```javascript
var Mailchimp = require('mailchimp-api-v3')

var mailchimp = new Mailchimp(api_key);

//Promise style
mailchimp.get({
  path : '/lists/id1'
})
.then(function (result) {
  ...
})
.catch(function (err) {
  ...
})
```

seamless batch calls, with polling and unpacking of results

```javascript
//Promise style
mailchimp.batch([
{
  method : 'get',
  path : '/lists/id1'
},
{
  method : 'get',
  path : '/lists/id2'
}])
.then(function (results) {
  //results[0] same as result in previous example
})
.catch(function (err) {
  ...
})
```

## Why
Version 3 of the mailchimp api is an excellent RESTful api. This library makes it easy to integrate mailchimp using their own api documentation.

This library also supports easy usage of the mailchimp batch operations, enabling them to be used just as the standard api calls.

## Installation

`$ npm install mailchimp-api-v3-next`

## Usage

For information on the possible calls, refer to the mailchimp api v3 documentation: [http://developer.mailchimp.com/documentation/mailchimp/reference/overview/](http://developer.mailchimp.com/documentation/mailchimp/reference/overview/)


### Initialization

```javascript
var Mailchimp = require('mailchimp-api-v3')

var mailchimp = new Mailchimp(api_key);
```

### Standard Calls

```javascript
mailchimp.request({
  method : 'get|post|put|patch|delete',
  path : 'path for the call, see mailchimp documentation for possible calls',
  path_params : {
    //path parameters, see mailchimp documentation for each call
  },
  body : {
    //body parameters, see mailchimp documentation for each call
  },
  query : {
    //query string parameters, see mailchimp documentation for each call
  }
})
```

`path` can be given either exactly as in the mailchimp documentation (`"/campaigns/{campaign_id}"`) and `path_params` specifying id values, or as a string with path parameters already substituted, and no `path_params`

For each request method, convenience calls exists to make common calls:

```javascript
mailchimp.get(path, [query])
mailchimp.post(path, [body])
mailchimp.put(path, [body])
mailchimp.patch(path, [body])
mailchimp.delete(path)
```

This allows shorthand forms like:

```javascript
mailchimp.get('/lists')
.then(function(results) {
  ...
})
.catch(function (err) {
  ...
})

mailchimp.post('/lists/id/members', {
  email_address : '...',
  status : 'subscribed'
  ...
})
.then(function(results) {
  ...
})
.catch(function (err) {
  ...
})
```