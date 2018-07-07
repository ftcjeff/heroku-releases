import {expect, test} from '@oclif/test'

const jeff_test_obj = [
  {
    created_at: '2018-01-22T15:24:24Z',
    id: '28e520c5-1ba8-480c-be6f-29496a68943d',
    user: {
      email: 'ftcjeff@gmail.com'
    },
    version: 1
  },
  {
    created_at: '2018-01-22T15:24:25Z',
    id: '19c11dcf-b84a-4bb9-bca9-9034157c12d9',
    user: {
      email: 'ftcjeff@gmail.com'
    },
    version: 2
  },
  {
    created_at: '2018-01-22T15:24:25Z',
    id: '89d11dcf-c84a-1bb9-0ca9-e034157c12df',
    user: {
      email: 'ftcjeff@gmail.com'
    },
    version: 3
  }
]

describe('releases:fetch', () => {
  test
  .nock('https://api.heroku.com', api => api
    .get('/apps/jeff-test/releases')
    .reply(200, jeff_test_obj)
  )
  .stdout()
  .command(['releases:fetch', '-a', 'jeff-test'])
  .it('runs releases:fetch with a mock app', ctx => {
    expect(ctx.stdout).to.be.equal(
      `Release info for jeff-test
3 - 2018-01-22T15:24:25Z - 89d11dcf-c84a-1bb9-0ca9-e034157c12df - ftcjeff@gmail.com
2 - 2018-01-22T15:24:25Z - 19c11dcf-b84a-4bb9-bca9-9034157c12d9 - ftcjeff@gmail.com
1 - 2018-01-22T15:24:24Z - 28e520c5-1ba8-480c-be6f-29496a68943d - ftcjeff@gmail.com
`)
  })

  test
  .nock('https://api.heroku.com', api => api
    .get('/apps/jeff-test/releases')
    .reply(200, jeff_test_obj)
  )
  .stdout()
  .command(['releases:fetch', '-a', 'jeff-test', '--skip', '1'])
  .it('runs releases:fetch with a mock app skipping the first element', ctx => {
    expect(ctx.stdout).to.be.equal(
      `Release info for jeff-test
2 - 2018-01-22T15:24:25Z - 19c11dcf-b84a-4bb9-bca9-9034157c12d9 - ftcjeff@gmail.com
1 - 2018-01-22T15:24:24Z - 28e520c5-1ba8-480c-be6f-29496a68943d - ftcjeff@gmail.com
`)
  })

  test
  .nock('https://api.heroku.com', api => api
    .get('/apps/jeff-test/releases')
    .reply(200, jeff_test_obj)
  )
  .stdout()
  .command(['releases:fetch', '-a', 'jeff-test', '--limit', '2'])
  .it('runs releases:fetch with a mock app limiting to 2 elements', ctx => {
    expect(ctx.stdout).to.be.equal(
      `Release info for jeff-test
3 - 2018-01-22T15:24:25Z - 89d11dcf-c84a-1bb9-0ca9-e034157c12df - ftcjeff@gmail.com
2 - 2018-01-22T15:24:25Z - 19c11dcf-b84a-4bb9-bca9-9034157c12d9 - ftcjeff@gmail.com
`)
  })

  test
  .nock('https://api.heroku.com', api => api
    .get('/apps/jeff-test/releases')
    .reply(200, jeff_test_obj)
  )
  .stdout()
  .command(['releases:fetch', '-a', 'jeff-test', '--skip', '1', '--limit', '1'])
  .it('runs releases:fetch with a mock app skipping the first element and limiting to 2 elements', ctx => {
    expect(ctx.stdout).to.be.equal(
      `Release info for jeff-test
2 - 2018-01-22T15:24:25Z - 19c11dcf-b84a-4bb9-bca9-9034157c12d9 - ftcjeff@gmail.com
`)
  })

  test
  .stdout()
  .command(['releases:fetch', '-a', 'missing-app'])
  .it('runs releases:fetch with an app that doesn\'t exist', ctx => {
    expect(ctx.stdout).to.contain('You do not have access to the app missing-app')
  })

  test
  .command(['releases:fetch'])
  .catch(err => {
    expect(err.message).to.contain('Missing required flag')
  })
  .it('runs releases:fetch with no app specified')
})
