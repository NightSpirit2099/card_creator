export class Result {
            constructor(isSuccess, value, error) {
                this.isSuccess = isSuccess;
                this.isFailure = !isSuccess;
                this.value = value;
                this.error = error;
            }
            
            static success(value) {
                return new Result(true, value, null);
            }
            
            static failure(error) {
                return new Result(false, null, error);
            }
            
            map(fn) {
                if (this.isFailure) return this;
                try {
                    return Result.success(fn(this.value));
                } catch (error) {
                    return Result.failure(error);
                }
            }
        }
        //
