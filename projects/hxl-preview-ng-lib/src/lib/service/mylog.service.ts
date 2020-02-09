import { Injectable } from '@angular/core';
@Injectable()
export class MyLogService {
    public info(message: any) {
        console.log(message);
    }

    public log(message: any) {
        console.log(message);
    }

    public error(message: any) {
        console.error(message);
    }
}
