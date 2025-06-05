import { Routes } from '@angular/router';
import { HomeComponent } from '@features/home/home.component';
import { PrivacyPolicyComponent } from '@features/privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from '@features/terms-conditions/terms-conditions.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-conditions', component: TermsConditionsComponent },

  { path: '**', redirectTo: '' }, // Wildcard route for 404
];
