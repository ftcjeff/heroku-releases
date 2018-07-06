import {Command, flags} from '@heroku-cli/command'

export default class ReleasesFetch extends Command {
  static description = 'fetch the releases for an app and print some info'

  static examples = [
    '$ oclif-example releases:fetch'
  ]

  static flags = {
    // flag with a value (-a, --app=VALUE)
    app: flags.string({char: 'a', description: 'application to query', required: true}),
  }

  static args = []

  async run() {
    const {args, flags} = this.parse(ReleasesFetch)

    this.log(`using app ${flags.app}`)
  }
}
