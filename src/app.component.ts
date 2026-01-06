import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { RoadblocksComponent } from './components/roadblocks/roadblocks.component';
import { SolutionComponent } from './components/solution/solution.component';
import { BenefitsComponent } from './components/benefits/benefits.component';
import { BusinessModelComponent } from './components/business-model/business-model.component';
import { TeamComponent } from './components/team/team.component';
import { ContactComponent } from './components/contact/contact.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeaderComponent,
    HeroComponent,
    RoadblocksComponent,
    SolutionComponent,
    BenefitsComponent,
    BusinessModelComponent,
    TeamComponent,
    ContactComponent,
    AdminDashboardComponent,
    AdminLoginComponent
  ]
})
export class AppComponent {
  currentYear = new Date().getFullYear();
  
  // Tracks if we are showing the admin SECTION (vs public site)
  isAdminView = signal(false);
  
  // Tracks if the user has actually logged in
  isAuthenticated = signal(false);

  toggleAdminView(): void {
    if (this.isAdminView()) {
      // If closing admin view, also logout
      this.isAdminView.set(false);
      this.isAuthenticated.set(false);
    } else {
      // Open admin view (starts at login)
      this.isAdminView.set(true);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onLoginSuccess(): void {
    this.isAuthenticated.set(true);
  }

  onLogout(): void {
    this.isAuthenticated.set(false);
    // Optional: stay in admin view but show login, or go back to site?
    // Let's go back to login screen
  }
}