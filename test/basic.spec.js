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

let listId;
describe('subscriptions', async () => {
  beforeAll(async () => {
    const response = await mailchimp.post({path: '/lists'}, {
      name: 'test',
      contact: {
        company: 'test',
        address1: 'Graßgasse',
        city: 'Landau',
        state: 'Rlp',
        zip: '76829',
        country: 'germany'
      },
      permission_reminder: 'hayho',
      campaign_defaults: {
        from_name: 'developer',
        from_email: 'developer@mobilehead.com',
        subject: 'test',
        language: 'en'
      },
      email_type_option: false
    })
    listId = response.id;
    expect(listId).toBeTruthy()
  })

  test('subscribe', async () => {
    const response = await mailchimp.subscribe({email_address: 'lukas.strassel@mobilehead.de'}, listId)
    expect(response.id).toBeTruthy()
  })

  test('update', async () => {
    const response = await mailchimp.update({email_address: 'lukas.strassel@mobilehead.de', merge_fields: {FNAME: 'max'}}, listId)
    expect(response.merge_fields.FNAME).toBe('max')
  })

  test('unsubscribe', async () => {
    const response = await mailchimp.unsubscribe({email_address: 'lukas.strassel@mobilehead.de'}, listId)
    expect(response.id).toBeTruthy()
  })

  afterAll(async () => {
    await mailchimp.delete('lists/'+listId)
  })
})