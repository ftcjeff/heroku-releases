import {Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'

export default class ReleasesFetch extends Command {
  static description = 'fetch the releases for an app and print some info'

  static examples = [
    '$ heroku releases:fetch --app app-name'
  ]

  static flags = {
    app: flags.string({char: 'a', description: 'application to query', required: true}),
    'slug-size': flags.boolean({char: 's', description: 'include the slug size in the output'}),
    skip: flags.integer({char: 'k', description: 'the number of elements to skip before printing'}),
    limit: flags.integer({char: 'l', description: 'the max number of elements to show'})
  }

  async run() {
    const {flags} = this.parse(ReleasesFetch)

    try {
      const response = await this.heroku.get<Heroku.Release>(`/apps/${flags.app}/releases`)
      const body = response.body

      this.log(`Release info for ${flags.app}`)

      let elements = body.reverse()
      if (flags.skip) {
        elements = elements.slice(flags.skip)
      }

      if (flags.limit) {
        elements = elements.slice(0, flags.limit)
      }

      for (let release of elements) {
        let slug_size = -1
        if (flags['slug-size']) {
          if (release.slug) {
            const slug_response = await this.heroku.get<Heroku.Release>(`/apps/${flags.app}/slugs/${release.slug.id}`)
            const slug_body = slug_response.body
            slug_size = slug_body.size
          }
        }

        this.print_release_info(release, slug_size)
      }
    } catch (e) {
       this.log(`${e.http.statusCode} - ${e.body.message}`)
       return
    }
  }

  private print_release_info(release: any, slug_size: number) {
    // TODO(ftcjeff) - make this pretty, allow JSON output
    let slug_log = ''
    if (slug_size !== -1) {
      slug_log = ` - ${slug_size}`
    }

    this.log(`${release.version} - ${release.created_at} - ${release.id} - ${release.user.email}${slug_log}`)
  }
}
