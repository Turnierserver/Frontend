var paths = require('../../paths')
var chalk = require('chalk')
var fetch = require('node-fetch')
var graphQlutilities = require('graphql/utilities')
var fs = require('fs')

/**
 * relay requires 'react-relay' install and in package.json, GRAPHQL_URL env variable set to retrieve local copy of schema.json resulting from `npm run fetchRelaySchema`
 */
var isEnabled = function () {
  var appPackageJson = require(paths.appPackageJson)
  return appPackageJson && appPackageJson.dependencies && appPackageJson.dependencies['react-relay']
}

var requireGraphQlConfig = function () {
  return new Promise((resolve, reject) => {
    // TODO we could use graphql-config package here instead

    // check that required env var REACT_APP_GRAPHQL_URL is setup
    if (!process.env.REACT_APP_GRAPHQL_URL) {
      let errorMessage = chalk.red('Relay requires a url to your graphql server\n') +
        'Specifiy this in a ' + chalk.cyan('REACT_APP_GRAPHQL_URL') + ' environment variable.\n' +
        'You can also create a ' + chalk.cyan('.env') + ' file in your maindir with content: ' +
        chalk.cyan('REACT_APP_GRAPHQL_URL="http://localhost:4000/graphql"') + ' (replace with your host).'
      reject(new Error(errorMessage))
    }

    console.log('Relay support - graphql configured successfully')
    resolve()
  })
}

var validateSchemaJson = function () {
  return new Promise((resolve, reject) => {
    // check that schema.json is there and is readable
    try {
      var schemaFileContents = fs.readFileSync(paths.relaySchema)
    } catch (err) {
      let errorMessage = chalk.red('babel-relay-plugin requires a local copy of your graphql schema\n') +
        'Run ' + chalk.cyan('npm run fetchRelaySchema') + ' to fetch it from the ' + chalk.cyan('REACT_APP_GRAPHQL_URL') + ' environment variable.'
      reject(new Error(errorMessage))
    }

    // check that schema.json is valid json
    try {
      var schemaJSON = JSON.parse(schemaFileContents)
    } catch (err) {
      let errorMessage = chalk.red('JSON parsing of the contents of ' + chalk.cyan(paths.relaySchema) + ' failed.\n') +
        'Check the contents of ' + chalk.cyan(paths.relaySchema) + '. It does not appear to be valid json\n' +
        'Also try running ' + chalk.cyan('npm run fetchRelaySchema') + ' to re-fetch the schema.json from the ' + chalk.cyan('REACT_APP_GRAPHQL_URL') + ' environment variable.'
      reject(new Error(errorMessage))
    }

    // check contents of schema.json has valid graphql schema
    try {
      graphQlutilities.buildClientSchema(schemaJSON.data)
    } catch (err) {
      let errorMessage = chalk.red('Could not parse the contents of schema.json into a valid graphql schema that is compatiable with this version of Relay and babel-relay-plugin\n') +
        'Upgrading graphql library on your server may be a solution.'
      reject(new Error(errorMessage))
    }

    console.log('Relay support - schema.json is found and valid')
    resolve()
  })
}

// retreive JSON of graphql schema via introspection for Babel Relay Plugin to use
var fetchRelaySchema = function () {
  return fetch(process.env.REACT_APP_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'query': graphQlutilities.introspectionQuery})
  })
    .then(res => res.json()).then(schemaJSON => {
      // verify that the schemaJSON is valid a graphQL Schema
      var graphQLSchema = graphQlutilities.buildClientSchema(schemaJSON.data)
      // Save relay compatible schema.json
      fs.writeFileSync(paths.relaySchema, JSON.stringify(schemaJSON, null, 2))

      // Save user readable schema.graphql
      fs.writeFileSync(paths.relaySchema.replace('.json', '.graphql'), graphQlutilities.printSchema(graphQLSchema))

      console.log('Relay support - fetch schema.json from ' + chalk.cyan(process.env.REACT_APP_GRAPHQL_URL))
    })
}

// build does not fetch the relay schema, only uses local copy of shema.js.
//  this helps, but does not guarantee that builds, dev, and tests use the same version of the schema.
var build = function () {
  return requireGraphQlConfig()
    .then(validateSchemaJson)
    .then(() => {
      console.log(chalk.green('Relay support built successfully!'))
    })
}

var start = function () {
  return requireGraphQlConfig()
    .then(fetchRelaySchema)
    .then(validateSchemaJson)
    .then(() => {
      console.log(chalk.green('Relay support enabled successfully!'))
    })
}

module.exports = {
  isEnabled: isEnabled,
  build: build,
  start: start
}
