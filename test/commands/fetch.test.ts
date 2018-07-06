import {expect, test} from '@oclif/test'

describe('releases:fetch', () => {
  test
  .nock('https://api.heroku.com', api => api
    .get('/apps/jeff-test/releases')
    .reply(200, [
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
      }
    ]
  ))
  .stdout()
  .command(['releases:fetch', '-a', 'jeff-test'])
  .it('runs releases:fetch with a mock app', ctx => {
    expect(ctx.stdout).to.be.equal(
      `Release info for jeff-test
2 - 2018-01-22T15:24:25Z - 19c11dcf-b84a-4bb9-bca9-9034157c12d9 - ftcjeff@gmail.com
1 - 2018-01-22T15:24:24Z - 28e520c5-1ba8-480c-be6f-29496a68943d - ftcjeff@gmail.com
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
