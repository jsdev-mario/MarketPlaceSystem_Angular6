import { Injectable } from '@angular/core';

@Injectable()
export class SpinnerService {

    waitting = false;

    constructor() { }

    show() {
        this.waitting = true;
    }

    hide() {
        this.waitting = false;
    }
}
