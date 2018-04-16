# Code Queue

A small package to create code queue's

[![npm](https://img.shields.io/npm/v/code-queue.svg)](https://www.npmjs.com/package/code-queue) ![node](https://img.shields.io/node/v/code-queue.svg) ![dependencies](https://david-dm.org/glenndehaan/code-queue.svg) [![Build Status](https://travis-ci.org/glenndehaan/code-queue.svg?branch=master)](https://travis-ci.org/glenndehaan/code-queue) [![Coverage Status](https://coveralls.io/repos/github/glenndehaan/code-queue/badge.svg?branch=master)](https://coveralls.io/github/glenndehaan/code-queue?branch=master)

## Functionalities
* Multiple code queue's
* Thread count support

## Setup
Install the Code Queue package:
```
npm install code-queue
```
Require the Code Queue package somewhere in your code:
```
const codeQueue = require('code-queue');
```

## Usage
Start by initializing the package with the following function:
```
codeQueue.init({
    debug: false,
    queues: [
        "default"
    ],
    threads: 1,
    onUpdate: (update) => {
        console.log(update);
    }
});
```

The only required item in the config is the `queues` array. The reset of these items are optional.

Now to add functions to the queue do the following:
```
codeQueue.add("default", (completed) => {
    console.log(`Starting item: ${item}`);
    setTimeout(() => {
        console.log(`Completed item: ${item}`);
        completed();
    }, 1000);
});
```

This will add a function to the `default` queue. That will complete after the `setTimeout` is done
You have to trigger the completed in your own code when you are done with your function.

## Threads
By default we will run at 1 thread. This means we will only run one function at a time.
To change this:
```
codeQueue.init({
    threads: 5
});
```

## Update
To check the progress of a queue you can hook into the update function as follows:
```
codeQueue.init({
    onUpdate: (update) => {
        console.log(update);
    }
});
```

## Disable
Since we are constantly checking for your new code your NodeJS app will never exit.
So we made a function that you can trigger to stop the queue module.

```
codeQueue.disable();
```

## Debug
Want to see what is happening on the background. Sure just set debug to `true`:
```
codeQueue.init({
    debug: true
});
```

## License

MIT
