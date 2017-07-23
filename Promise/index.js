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
                        } else {
                            // must be fulfilled with the same value as promise1.
                        }
                    }
                    if (this.state === 2) {
                        if (onRejected && typeof(onRejected) === 'function') {
                            // it must be called after promise is rejected, with promise’s reason as its first argument.
                        } else {
                            // must be rejected with the same reason as promise1.
                        }
                    }
                })
            }
            if (this.state) {
                thenWork();
            } else {
                this.callbackQueue.push(thenWork)
            }
        })
    }
}