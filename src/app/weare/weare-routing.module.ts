import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WeareComponent } from './weare.component';
import { ContactusComponent } from './contactus/contactus.component';
import { FaqComponent } from './faq/faq.component';
import { BlogComponent } from './blog/blog.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { PolicyComponent } from './policy/policy.component';
import { TermconditionComponent } from './termcondition/termcondition.component';

const routes: Routes = [
    {
        path: '', component: WeareComponent,
        children: [
            { path: '', redirectTo: 'aboutus', pathMatch: 'full' },
            { path: 'contactus', component: ContactusComponent },
            { path: 'faq', component: FaqComponent },
            { path: 'blog', component: BlogComponent },
            { path: 'aboutus', component: AboutusComponent },
            { path: 'policy', component: PolicyComponent },
            { path: 'terms', component: TermconditionComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WeareRoutingModule { }
