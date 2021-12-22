const Bree = require('bree')

const bree = new Bree({
    jobs: [
        {
            name: 'aggregator',
            interval: 'every day at 12 am'
        },
        {
            name: 'statusCheck',
            interval: 'every 5 minutes'
        }
    ]
})

bree.start()