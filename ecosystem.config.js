module.exports = {
  apps: [
    {
      name: "pika",
      script: "./server_app/bundle.js",

      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      args: "start",
      instances: 2,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],

  // deploy: {
  //   production: {
  //     user: "root",
  //     host: "111.229.9.30",
  //     ref: "origin/master",
  //     repo: "git@github.com:mbaxszy7/music-motion.git",
  //     path: "/var/www/production",
  //     "post-deploy":
  //       "sudo npm install && npm run build-client && npm run build-server && pm2 reload ecosystem.config.js --env production",
  //   },
  // },
}
