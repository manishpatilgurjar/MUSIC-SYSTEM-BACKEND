module.exports = {
    apps : [{
      name: 'music-app',
      script: 'dist/index.js', // Adjust this path to your compiled TypeScript output
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 8000, // Adjust as needed
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8000, // Adjust as needed
      }
    }],
  };
  