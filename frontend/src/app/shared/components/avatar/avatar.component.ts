import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="avatar" [ngStyle]="{'width.px': size, 'height.px': size, 'font-size.px': size * 0.4, 'background': background}">
      <ng-container *ngIf="src; else initialsBlock">
        <img [src]="src" [alt]="alt || initials" (error)="src = ''" />
      </ng-container>
      <ng-template #initialsBlock>{{ initials }}</ng-template>
    </div>
  `,
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
  @Input() src: string = '';
  @Input() alt: string = '';
  @Input() name: string = '';
  @Input() size: number = 40;
  @Input() background: string = '#bdbdbd';

  get initials(): string {
    if (!this.name) return '';
    const parts = this.name.split(' ');
    return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : this.name.substring(0, 2).toUpperCase();
  }
} 