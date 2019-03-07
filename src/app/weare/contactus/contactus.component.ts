import { Component, OnInit } from '@angular/core';
import { StatusService, SpinnerService, ValidationService, CommonService } from '../../service';
import emailMask from 'text-mask-addons/dist/emailMask';
import { ToastrService } from 'ngx-toastr';
import { ContactService } from '../../service/contact/contact.service';


@Component({
    selector: 'app-contactus',
    templateUrl: './contactus.component.html',
    styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements OnInit {

    name: string;
    email: string;
    subject: string;
    message: string;

    constructor(
        public status_service: StatusService,
        private toaster: ToastrService,
        public spinner_service: SpinnerService,
        public validation: ValidationService,
        public contact_service: ContactService,
    ) { }

    ngOnInit() {
        this.status_service.fast_search = false;
    }

    send() {
        if (!this.name || this.name === '') {
            this.toaster.error('Please input name', 'error');
            return;
        }
        if (!this.email || this.email === '') {
            this.toaster.error('Please input email', 'error');
            return;
        }
        if (!this.validation.emailValidate(this.email)) {
            this.toaster.error('Invalid Email', 'error');
            return;
        }
        if (!this.subject || this.subject === '') {
            this.toaster.error('Please input email', 'error');
            return;
        }

        if (!this.message || this.message === '') {
            this.toaster.error('Please input message', 'error');
            return;
        }
        const param = {
            name: this.name,
            email: this.email,
            subject: this.subject || '',
            message: this.message,
        };
        console.log('send');
        this.spinner_service.show();
        this.contact_service.add(param).then(data => {
            this.spinner_service.hide();
            this.toaster.success('Sent successfully', 'Success');
            this.reset();
        }).catch(error => {
            this.spinner_service.hide();
            if (error.error && error.error.message) {
                this.toaster.error(error.error.message, 'Error');
            }
        });
    }

    reset() {
        this.name = undefined;
        this.email = undefined;
        this.subject = undefined;
        this.message = undefined;
    }

}
