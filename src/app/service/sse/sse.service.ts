import { Injectable } from '@angular/core';
import API_URL from '../api_url';
import Constants from '../constant';
declare var require: any;
const store = require('store');


@Injectable()
export class SseService {

    ss_event: EventSource;
    constructor() { }

    createEventSource(event_name, callback) {
        if (event_name === Constants.sseEventNames.ADD_BUTORDERS) {
            this.ss_event = new EventSource(`${API_URL.SSE_BUTORDERS_INFO}/${store.get('token')}`);
            this.ss_event.addEventListener(event_name, function (result) {
                callback(result);
            });
            this.ss_event.onerror = function (e) {
                console.log('EventSource Error: ' + e);
            };
        }
    }

    disconnect() {
        this.ss_event.close();
    }
}
