import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [ButtonComponent],
  template: `<section>
        <h3>Button Sizes</h3>
        <div class="button-row">
          <app-button size="small">Sign in</app-button>
          <app-button size="medium"
          icon="search" iconPosition="left">Sign in</app-button>
          <app-button size="large" icon="search" iconPosition="right">Sign in</app-button>
        </div>
      </section>`
})
export class HomePage {} 