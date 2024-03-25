'use strict';
import Task from '@scripts/task';
import queue from 'async/queue';

export default class {
    constructor(data = []) {
        this.data = [];
        this.dataMap = {};

        this.type = ['success', 'waiting', 'failed'];
        for (let i of this.type) {
            this[i] = [];
        }

        this.queue = null;
        this.concurrency = 3;

        this.isWorking = false;

        this.enqueue(data);
    }
    get length() {
        return this.data.length;
    }
    get completed() {
        return [...this.success, ...this.failed];
    }
    enqueue(data, index = Infinity) {
        const ar = [data].flat(Infinity);
        for (let i = 0; i < ar.length; i++) {
            const task = new Task(ar[i]);
            if (this.dataMap[task.id]) continue;
            this.dataMap[task.id] = task;
            this.data.splice(index + i, 0, task);
            this.waiting.splice(index + i, 0, task);

            if (this.queue) this.queue.push(task);
        }
    }
    dequeue(index = 0) {
        const task = this.data.splice(index, 1)[0];
        delete this.dataMap[task.id];

        for (let i of this.type) {
            const index = this[i].indexOf(task);
            if (index !== -1) this[i].splice(index, 1);
        }

        // info: 處理中的任務刪不掉
        if (this.queue) {
            this.queue.remove(({ data, priority }) => {
                return data.id === task.id;
            });
        }

        return task;
    }
    async start({
        onProcess = async () => {},
        onSuccess = async () => {},
        onFailed = async () => {}
    }) {
        this.isWorking = true;
        this.queue = queue(async (task, callback = () => {}) => {
            task.processing();
            const result = await onProcess(task);
            await onSuccess(result);
            await task.success(result);
            this.success.push(task);
            callback();
        }, this.concurrency);
        this.queue.error(async (err, task) => {
            err = err.message;
            console.error(err, task);
            await task.failed(err);
            this.failed.push(task);
        });

        this.queue.push(this.waiting.splice(0));

        await this.queue.drain();
        this.queue = null;
        this.isWorking = false;
    }
    clear(type = 'data') {
        console.time('remove data : ' + type);

        const set = new Set(this[type]);
        this.data = this.data.filter((task) => !set.has(task));
        this[type] = [];

        console.timeEnd('remove data : ' + type);
    }
}
