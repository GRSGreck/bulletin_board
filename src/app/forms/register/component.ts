import {Component} from '@angular/core';
import { NgForm } from '@angular/forms';

import { User } from '../../models/user';

@Component({
    selector: 'form-register',
    templateUrl: './template.html',
    styleUrls: ['./styles.scss']
})

export class FormRegisterComponent {
    onSubmit(form: NgForm) {

        console.log(form);
        console.log('form.value:', form.value);
        console.log('form.valid:', form.valid);
    }
}