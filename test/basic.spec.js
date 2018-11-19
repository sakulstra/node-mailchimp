var api_key = process.env.MAILCHIMP_TEST_API_KEY

var Mailchimp = require('../index');


if (!api_key) {
  throw 'api key is needed to run test suite'
}

describe('handle initialization', function () {
  test('should fail for no api key', function () {
    expect(() => new Mailchimp(null)).toThrowError()
  })

  test('should fail for invalid api key', function () {
    expect(() => new Mailchimp('invalid api key format')).toThrowError()
   })

  test('should work for correctly formated api key', function () {
    expect(new Mailchimp('key-dc')).toBeTruthy()
  })
})

const mailchimp = new Mailchimp(api_key);
jest.setTimeout(8000)

describe('basic mailchimp api methods', function () {
  test.concurrent('should handle simple get with promise', async () => {
    const response = await mailchimp.get({
      path : '/lists',
    })
    expect(response.lists).toBeTruthy()
  })


  test.concurrent('should handle wrong path with promise', async () => {
    const response = await mailchimp.get({
      path : '/wrong',
    })
    expect(response.status).toBe(404)
  })

  test.concurrent('should handle get with just a path with promise', async () => {
    const response = await mailchimp.get('/lists');
    expect(response.lists).toBeTruthy();
  })

  test.concurrent('should handle get with a path and query with promise', async () => {
    const response = await mailchimp.get('/lists', {offset: 1});
    expect(response.lists).toBeTruthy();
  })
})
