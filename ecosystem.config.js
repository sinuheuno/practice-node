module.exports = {
    apps: [{
        name: 'sim-card-manager',
        script: './server.js'
    }],
    deploy: {
        production: {
            user: 'carlos',
            host: '35.208.12.243',
            ref: 'origin/master',
            repo: 'git@gitlab.com:magna-comunicaciones/sim-card-manager.git',
            path: '/home/carlos/sim-card-manager',
            'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
        }
    }
};