import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'header',
    templateUrl: './header.template.html',
    styleUrls: ['./header.styles.scss']
})

export class HeaderComponent {
    constructor(private router: Router) {}

    public goHome(): void {
        this.router.navigate(['/']);
        // this.router.navigate(['/', 5], { queryParams: { age: 25, gender: 'male' } });
    }
}