import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

interface TeamMember {
  name: string;
  email: string;
  imageUrl: string;
}

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgOptimizedImage]
})
export class TeamComponent {
  teamMembers = signal<TeamMember[]>([
    {
      name: 'Raghavendra Tati',
      email: 'tatiraghavendra@gmail.com',
      imageUrl: 'https://i.ibb.co/hF9LLK2s/raghavendra.png'
    },
    {
      name: 'Sai Saranya Ravipudi',
      email: 'saisaranyaravipudi@gmail.com',
      imageUrl: 'https://i.ibb.co/qFPpzRJt/sai-saranya.png'
    },
    {
      name: 'Yesu Babu Raavi',
      email: 'yesubaburaavi@gmail.com',
      imageUrl: 'https://i.ibb.co/d0X48HKc/yesu-babu.jpg'
    }
  ]);
}
