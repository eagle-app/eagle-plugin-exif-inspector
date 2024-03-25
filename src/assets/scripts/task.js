'use strict';
export default class {
    constructor(args) {
        this.id = args.id ?? crypto.randomUUID();

        // data
        this.name = args.name;
        this.ext = args.ext;
        this.size = args.size;
        this.filePath = args.filePath;

        this.result = {
            state: 'waiting',
            message: '',
            data: null
        };

        this.is_eagle = args.is_eagle ?? true;
    }
    isWaiting() {
        return this.result.state === 'waiting';
    }
    isProcessing() {
        return this.result.state === 'processing';
    }
    isSuccess() {
        return this.result.state === 'success';
    }
    isFailed() {
        return this.result.state === 'failed';
    }
    waiting() {
        this.result.state = 'waiting';
        this.result.message = '';
        this.result.data = null;
    }
    processing(process = 0) {
        this.result.state = 'processing';
        this.result.message = '';
        this.result.data = process;
    }
    success(data = null) {
        this.result.state = 'success';
        this.result.message = '';
        this.result.data = data;
    }
    failed(message = '') {
        this.result.state = 'failed';
        this.result.message = message;
        this.result.data = null;
    }
}
