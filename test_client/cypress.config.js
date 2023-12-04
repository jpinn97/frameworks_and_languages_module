const { defineConfig } = require('cypress')
module.exports = defineConfig({
    e2e: {
        supportFile: false,
        specPattern: 'cypress/**/*.cy.js',
        screenshotOnRunFailure: true,
        screenshotsFolder: 'reports/screenshots',
        video: true,
        videosFolder: 'reports/videos',
        chromeWebSecurity: false,
        reporter: 'junit',
        reporterOptions: {
            mochaFile: 'reports/junit-[hash].xml'
        },
    }
})