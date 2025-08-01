export class Debouncer {
            constructor(delay = 250) {
                this.delay = delay;
                this.timeoutId = null;
            }
            
            execute(fn) {
                clearTimeout(this.timeoutId);
                this.timeoutId = setTimeout(fn, this.delay);
            }
        }
        //
