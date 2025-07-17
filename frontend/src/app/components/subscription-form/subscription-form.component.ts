import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-subscription-form',
  standalone: true,
  templateUrl: './subscription-form.component.html',
  styleUrls: ['./subscription-form.component.scss'],
  imports: [ButtonComponent],
})
export class SubscriptionFormComponent {}
