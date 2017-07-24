const stateMap = new Map([
    ['pending', 0],
    ['fulfilled', 1],
    ['rejected', 2]
])

function MPromise () {
    this.state = stateMap.get('pending');
    this.callbackQueue = [];

    this.then = function (onFulfilled, onRejected) {
        return new MPromise((resolve, rejected) => {
            const thenWork = function () {
                // 2.2.4
                setImmediate(() => {
                    if (this.state === 1) {
                        if (onFulfilled && typeof(onFulfilled) === 'function') {
                            // must be called after promise is fulfilled, with promise’s value as its first argument.
                            this.reslove(onFulfilled(this.value));
                        } else {
                            // must be fulfilled with the same value as promise1.
                            this.reslove(this.value);
                        }
                    }
                    if (this.state === 2) {
                        if (onRejected && typeof(onRejected) === 'function') {
                            // it must be called after promise is rejected, with promise’s reason as its first argument.
                            this.reject(onRejected(this.reason));
                        } else {
                            // must be rejected with the same reason as promise1.
                            this.reject(this.reason);
                        }
                    }
                })
            }
            if (this.state) {
                thenWork();
            } else {
                this.callbackQueue.push(thenWork);
            }
        })
    }

    this.resolve = function (value) {
        // 状态流转到 reslove
        if (this.state) return;
        if (value === this) return this.reject(new TypeError('refer to the same object'));
        if (typeof value === 'object' || typeof value === 'function') {
            try {
                let then = value.then;
                if (typeof then === 'function') {
                    then.call(value);
                }
            } catch (e) {
                this.reject(e);
            }
        }
        this.state = stateMap.get('reslove');
        this.value = value;
        this.callbackQueue.forEach((cb) => {
            cb(this);
        })
    }

    this.reject = function (reason) {
        // 状态流转到reject
        if (this.state) return;
        if (reason === this) return this.reject(new TypeError('refer to the same object'));
        this.state = stateMap.get('rejected');
        this.reason = reason;
        this.callbackQueue.forEach((cb) => {
            cb(this);
        })
    }
}

module.exports = MPromise;