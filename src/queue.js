/**
 * Create globals
 */
let enabled = false;
let threads = 1;
let debug = false;
let config = {};
let queueChecker = null;
const activeQueue = {};
const commandsRunning = {};
const commandsRemaining = {};
const commandsCompleted = {};

/**
 * Init function to add the queues to the global objects
 *
 * @param conf Object
 */
const init = (conf) => {
    if (typeof conf.queues === "undefined") {
        throw new Error("[QUEUE] Missing queues array!");
    }

    if (conf.queues.length < 1) {
        throw new Error("[QUEUE] Missing queue's in queues array!");
    }

    if (typeof conf.threads !== "undefined" && typeof conf.threads === "number") {
        threads = conf.threads;
    }

    if (typeof conf.debug !== "undefined" && typeof conf.debug === "boolean") {
        debug = conf.debug;
    }

    if (typeof conf.onUpdate !== "undefined" && typeof conf.onUpdate === "function") {
        update = conf.onUpdate;
    }

    config = conf;

    for(let item = 0; item < config.queues.length; item++){
        activeQueue[config.queues[item]] = [];
        commandsRunning[config.queues[item]] = 0;
        commandsRemaining[config.queues[item]] = 0;
        commandsCompleted[config.queues[item]] = 0;
    }

    if(debug) {
        console.log(`[QUEUE] Ready! Queues available: ${config.queues}`);
    }

    startQueues();

    update({
        enabled,
        commandsRunning,
        commandsRemaining,
        commandsCompleted
    });
};

/**
 * Function to add a command to the queue
 *
 * @param queue string
 * @param command Function
 */
const add = (queue, command) => {
    activeQueue[queue].push(command);
    commandsRemaining[queue]++;

    if(debug) {
        console.log(`[QUEUE] Added command in queue: ${queue}, Commands remaining: ${activeQueue[queue].length}`);
    }
};

/**
 * Function that must be run when a command is done
 *
 * @param queue
 */
const complete = (queue) => {
    commandsRunning[queue]--;
    commandsRemaining[queue]--;
    commandsCompleted[queue]++;

    update({
        enabled,
        commandsRunning,
        commandsRemaining,
        commandsCompleted
    });

    if(debug) {
        console.log(`[QUEUE] Completed command in queue: ${queue}, Commands remaining: ${activeQueue[queue].length}`);
    }
};

/**
 * Disable the queues
 */
const disable = () => {
    if(queueChecker !== null) {
        clearInterval(queueChecker);
        enabled = false;

        update({
            enabled,
            commandsRunning,
            commandsRemaining,
            commandsCompleted
        });

        if(debug) {
            console.log(`[QUEUE] Disabled!`);
        }
    }
};

/**
 * Dummy function that will be overwritten by user
 */
let update = () => {};

/**
 * Loop over the commands and execute them when possible
 */
const startQueues = () => {
    enabled = true;

    queueChecker = setInterval(() => {
        for (let item = 0; item < config.queues.length; item++) {
            if (activeQueue[config.queues[item]].length > 0) {
                if (commandsRunning[config.queues[item]] < threads) {
                    if(debug) {
                        console.log(`[QUEUE] Started new job in queue: ${config.queues[item]}, Jobs remaining: ${activeQueue[config.queues[item]].length}`);
                    }

                    commandsRunning[config.queues[item]]++;
                    activeQueue[config.queues[item]][0](() => {
                        complete(config.queues[item]);
                    });
                    activeQueue[config.queues[item]].splice(0, 1);

                    update({
                        enabled,
                        commandsRunning,
                        commandsRemaining,
                        commandsCompleted
                    });
                }
            }
        }
    }, 10);
};

module.exports = {init, add, disable};
