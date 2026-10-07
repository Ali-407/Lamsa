import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'v8bcoq1q',
    dataset: 'production'
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
  typegen: {
    enabled: true,
    path: '../Lamsa-FrontEnd/src/**/*.ts',
    generates: '../Lamsa-FrontEnd/sanity.types.ts',
    overloadClientMethods: true,
  },
})
