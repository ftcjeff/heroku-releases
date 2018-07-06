import {Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'

export default class ReleasesFetch extends Command {
  static description = 'fetch the releases for an app and print some info'

  static examples = [
    '$ heroku releases:fetch --app app-name'
  ]

  // TODO(ftcjeff) - allow for limits/paging
  static flags = {
    app: flags.string({char: 'a', description: 'application to query', required: true})
  }

  private print_release_info(release: any) {
    // TODO(ftcjeff) - make this pretty, allow JSON output
    this.log(`${release.version} - ${release.created_at} - ${release.id} - ${release.user.email}`)
  }

  async run() {
    const {flags} = this.parse(ReleasesFetch)

    try {
      const response = await this.heroku.get<Heroku.Release>(`/apps/${flags.app}/releases`)
      const body = response.body

      this.log(`Release info for ${flags.app}`)

      for (let release of body.reverse()) {
        this.print_release_info(release)
      }
    } catch (e) {
      this.log(`${e.http.statusCode} - ${e.body.message}`)
      return
    }
  }
}
