import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScreenShotComponent } from '../../shared/components/screen-shot/screen-shot.component';
import { CommentCardComponent } from '../../shared/components/comment-card/comment-card.component';
import { TopCastCardComponent } from '../../shared/top-cast-card/top-cast-card.component';
import { RatingCardComponent } from '../../shared/components/rating-card/rating-card.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ScreenShotComponent,
    CommentCardComponent,
    TopCastCardComponent,
    RatingCardComponent,
    MatIconModule,
  ],
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  screenshots: string[] = [];
  comments: any[] = [];
  topCast: any[] = [];
  reviews: any[] = [];
  isLoggedIn = false;
  user = {
    id: 1,
    name: 'John Doe',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  };
  commentText = '';

  constructor(private http: HttpClient) {
    console.log('HttpClient injected:', !!http);
  }

  ngOnInit() {
    this.http.get<{ screenshots: string[] }>('screenshots.json').subscribe((data) => {
      this.screenshots = data.screenshots;
    });
    this.http.get<{ comments: any[] }>('comments.json').subscribe((data) => {
      this.comments = data.comments;
    });
    this.http.get<{ topCast: any[] }>('top-cast.json').subscribe((data) => {
      this.topCast = data.topCast;
    });
    this.http.get<{ reviews: any[] }>('reviews.json').subscribe((data) => {
      this.reviews = data.reviews;
    });
  }

  login() {
    this.isLoggedIn = true;
  }

  submitComment() {
    if (this.commentText.trim()) {
      this.comments.push({
        avatar: this.user.avatar,
        user: this.user.name,
        date: new Date().toLocaleString(),
        text: this.commentText,
      });
      this.commentText = '';
    }
  }

  cancelComment() {
    this.commentText = '';
  }
}
