import {expect, test} from '@oclif/test'

describe('releases:fetch', () => {
  test
  .stdout()
  .command(['releases:fetch', '-a', 'pure-fjord-62694'])
  .it('runs releases:fetch with a known app', ctx => {
    expect(ctx.stdout).to.contain('6517f983-2f93-48d1-87cb-bb16ccef2d9a')
    expect(ctx.stdout).to.contain('28e520c5-1ba8-480c-be6f-29496a68943d')
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
