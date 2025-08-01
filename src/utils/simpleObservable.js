export class SimpleObservable {
            constructor(initialValue) {
                this._value = initialValue;
                this._observers = [];
            }
            
            get value() {
                return this._value;
            }
            
            set value(newValue) {
                if (this._value !== newValue) {
                    this._value = newValue;
                    this._notifyObservers(newValue);
                }
            }
            
            subscribe(observer) {
                this._observers.push(observer);
                observer(this._value);
                
                return () => {
                    const index = this._observers.indexOf(observer);
                    if (index > -1) {
                        this._observers.splice(index, 1);
                    }
                };
            }
            
            _notifyObservers(value) {
                this._observers.forEach(observer => {
                    try {
                        observer(value);
                    } catch (error) {
                        console.error('Error in observer:', error);
                    }
                });
            }
        }
        //
