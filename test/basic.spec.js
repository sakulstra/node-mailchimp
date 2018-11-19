var api_key = process.env.MAILCHIMP_TEST_API_KEY

var Mailchimp = require('../index');


if (!api_key) {
  throw 'api key is needed to run test suite'
}

describe('handle initialization', function () {
  it('should fail for no api key', function () {
    expect(() => new Mailchimp(null)).toThrowError()
  })

  it('should fail for invalid api key', function () {
    expect(() => new Mailchimp('invalid api key format')).toThrowError()
   })

  it('should work for correctly formated api key', function () {
    expect(new Mailchimp('key-dc')).toBeTruthy()
  })
})

let mailchimp;

describe('basic mailchimp api methods', function () {
  beforeAll(() => {
    mailchimp = new Mailchimp(api_key);
    jest.setTimeout(10000)
  })

  it('should handle simple get with promise', async () => {
    const response = await mailchimp.get({
      path : '/lists',
    })
    expect(response.lists).toBeTruthy()
  })


  it('should handle wrong path with promise', async () => {
    const response = await mailchimp.get({
      path : '/wrong',
    })
    expect(response.status).toBe(404)
  })

  it('should handle get with just a path with promise', async () => {
    const response = await mailchimp.get('/lists');
    expect(response.lists).toBeTruthy();
  })

  it('should handle get with a path and query with promise', async () => {
    const response = await mailchimp.get('/lists', {offset : 1})
      .then(function (result) {
        assert.ok(result)
        assert.ok(result.lists)
        done()
      })
      .catch(function (err) {
        done(new Error(err))
      })
  })
})
