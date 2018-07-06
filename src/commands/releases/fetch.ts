import {Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'

export default class ReleasesFetch extends Command {
  static description = 'fetch the releases for an app and print some info'

  static examples = [
    '$ heroku releases:fetch --app app-name'
  ]

  // TODO(ftcjeff) - allow for limits/paging
  static flags = {
    app: flags.string({char: 'a', description: 'application to query', required: true}),
    'slug-size': flags.boolean({char: 's', description: 'include the slug size in the output'})
  }

  private print_release_info(release: any, slug_size: int) {
    // TODO(ftcjeff) - make this pretty, allow JSON output
    let slug_log = ''
    if (slug_size !== -1) {
      slug_log = `- ${slug_size}`
    }

    this.log(`${release.version} - ${release.created_at} - ${release.id} - ${release.user.email} ${slug_log}`)
  }

  async run() {
    const {flags} = this.parse(ReleasesFetch)

    try {
      const response = await this.heroku.get<Heroku.Release>(`/apps/${flags.app}/releases`)
      const body = response.body

      this.log(`Release info for ${flags.app}`)

      for (let release of body.reverse()) {
        let slug_size = -1
        if (flags['slug-size']) {
          const slug_response = await this.heroku.get<Heroku.Release>(`/apps/${flags.app}/slugs/${release.slug.id}`)
          const slug_body = slug_response.body
          slug_size = slug_body.size
        }

        this.print_release_info(release, slug_size)
      }
    } catch (e) {
      this.log(`${e.http.statusCode} - ${e.body.message}`)
      return
    }
  }
}
