import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="avatar"
      [ngStyle]="{
        'width.px': size,
        'height.px': size,
        'font-size.px': size * 0.4,
        background: background,
      }"
    >
      <ng-container *ngIf="src; else initialsBlock">
        <img [src]="src" [alt]="alt || initials" (error)="src = ''" />
      </ng-container>
      <ng-template #initialsBlock>
        <ng-container *ngIf="initials; else svgBlock">{{ initials }}</ng-container>
        <ng-template #svgBlock>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-user-icon lucide-user"
            style="width: 30px; height:30px"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </ng-template>
      </ng-template>
    </div>
  `,
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent {
  @Input() src: string = '';
  @Input() alt: string = '';
  @Input() name: string = '';
  @Input() size: number = 40;
  @Input() background: string = '#fff';

  get initials(): string {
    if (!this.name) return '';
    const parts = this.name.split(' ');
    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : this.name.substring(0, 2).toUpperCase();
  }
}
