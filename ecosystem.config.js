module.exports = {
  apps: [
    {
      name: 'futurelearn-api',
      cwd: './backend',
      script: 'dist/main.js',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'futurelearn-web',
      cwd: './frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
