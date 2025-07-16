import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ScreenShotComponent } from '../../../shared/components/screen-shot/screen-shot.component';
import { CommentCardComponent } from '../../../shared/components/comment-card/comment-card.component';
import { TopCastCardComponent } from '../../../shared/top-cast-card/top-cast-card.component';
import { RatingCardComponent } from '../../../shared/components/rating-card/rating-card.component';
import { FooterComponent } from '../../../features/footer/footer.component';

@Component({
  selector: 'app-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    ScreenShotComponent,
    CommentCardComponent,
    TopCastCardComponent,
    RatingCardComponent,
    FooterComponent
  ],
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss']
})
export class DetailPage implements OnInit {
  screenshots: string[] = [];
  comments: any[] = [];
  topCast: any[] = [];
  reviews: any[] = [];

  constructor(private http: HttpClient) {
    console.log('HttpClient injected:', !!http);
  }

  ngOnInit() {
    this.http.get<{ screenshots: string[] }>('screenshots.json')
      .subscribe(data => {
        this.screenshots = data.screenshots;
      });
    this.http.get<{ comments: any[] }>('comments.json')
      .subscribe(data => {
        this.comments = data.comments;
      });
    this.http.get<{ topCast: any[] }>('top-cast.json')
      .subscribe(data => {
        this.topCast = data.topCast;
      });
    this.http.get<{ reviews: any[] }>('reviews.json')
      .subscribe(data => {
        this.reviews = data.reviews;
      });
  }
} 