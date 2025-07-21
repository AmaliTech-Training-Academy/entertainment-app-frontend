import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-screen-shot',
  standalone: true,
  templateUrl: './screen-shot.component.html',
  styleUrls: ['./screen-shot.component.scss'],
})
export class ScreenShotComponent {
  @Input() imageUrl: string = '';
  imgError = false;
}
