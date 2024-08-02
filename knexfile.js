// Cannot use require because the config file cannot be bundled. Need to use a fs reader.
const loadConfig = require( './server/loadConfig.js' );
const config = loadConfig();

module.exports = {
  development: {
    client: 'pg',
    connection: config.DATABASE_URL || 'postgres://localhost/paper_programs_development'
  },
  docker: {
    client: 'pg',
    connection: config.DATABASE_URL || 'postgres://root@postgres/paper_programs_development'
  },
  production: {
    client: 'pg',
    connection: config.DATABASE_URL
  }
};