/**
 * Import own packages
 */
const codeQueue = require('../src/queue');

/**
 * Update function for the code queue
 *
 * @param update
 */
const onUpdate = (update) => {
    console.log('update', update);
};

/**
 * Init the code queue
 */
codeQueue.init({
    debug: false,
    queues: [
        "default"
    ],
    threads: 1,
    onUpdate
});

/**
 * Let's fill the queue
 */
for(let item = 1; item < 51; item++) {
    codeQueue.add("default", (completed) => {
        console.log(`Starting item: ${item}`);
        setTimeout(() => {
            console.log(`Completed item: ${item}`);
            completed();
        }, 100);
    })
}

/**
 * Run disable after 2 secs
 */
setTimeout(() => {
    codeQueue.disable();
}, 2000);
