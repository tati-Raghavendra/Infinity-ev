import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Roadblock {
  title: string;
  description: string;
}

@Component({
  selector: 'app-roadblocks',
  templateUrl: './roadblocks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class RoadblocksComponent {
  roadblocks = signal<Roadblock[]>([
    { title: 'Limited Driving Range', description: '"Range anxiety" hinders long-distance EV travel.' },
    { title: 'Charging Inconveniences', description: 'Dependency on infrastructure leads to long wait times.' },
    { title: 'Battery Lifecycle Concerns', description: 'Production and disposal have environmental impacts.' },
    { title: 'High Upfront Cost', description: 'EVs often cost more than ICE counterparts initially.' }
  ]);
}
