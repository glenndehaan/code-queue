/**
 * Import test suite
 */
const should = require('should');
const request = require('request');

/**
 * Import packages needed for tests
 */
const codeQueue = require('../src/queue');

describe("Queue", () => {
    it('Should crash when no config is defined', (done) => {
        try {
            codeQueue.init({});
        } catch (e) {
            e.should.Error();
            done();
        }
    });

    it('Should crash when empty queues array is defined', (done) => {
        try {
            codeQueue.init({
                queues: []
            });
        } catch (e) {
            e.should.Error();
            done();
        }
    });

    it('Should be able to process items in the queue', (done) => {
        codeQueue.init({
            debug: false,
            queues: [
                "default"
            ],
            threads: 1,
            onUpdate: () => {}
        });

        codeQueue.add("default", (completed) => {
            completed();
            done();
        })
    });

    it('Should be able to disable the queue (exit app)', (done) => {
        codeQueue.disable();
        done();
    });
});
