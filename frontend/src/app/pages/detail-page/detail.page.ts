import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScreenShotComponent } from '../../shared/components/screen-shot/screen-shot.component';
import { CommentCardComponent } from '../../shared/components/comment-card/comment-card.component';
import { TopCastCardComponent } from '../../shared/top-cast-card/top-cast-card.component';
import { RatingCardComponent } from '../../shared/components/rating-card/rating-card.component';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommentService } from '../../core/services/comment/comment.service';
import { Comment, CommentPost } from '../../shared/components/comments';
import { MediaDetailsService } from '../../core/services/media-details/media-details.service';
import { MediaDetails, Screenshot } from '../../shared/components/media-details';

function getUserId(): number | null {
  // Parse cookies
  const cookies = document.cookie.split(';').reduce((acc: any, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});
  const userStr = cookies['auth_user'];
  if (userStr) {
    try {
      const user = JSON.parse(decodeURIComponent(userStr));
      return user.id; 
    } catch (e) {
      console.log('Error parsing user cookie:', e, userStr);
    }
  }
  return null;
}

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
    RouterModule
  ],
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  screenshots: Screenshot[] = [];
  comments: Comment[] = [];
  topCast: any[] = [];
  reviews: any[] = [];
  isLoggedIn = false;
  user: any = null;
  commentText = '';
  mediaId: number | null = null;
  title: string = '';
  synopsis: string = '';
  thumbnailUrl: string = '';

  constructor(
    // private http: HttpClient,
    private route: ActivatedRoute,
    private commentService: CommentService,
    private mediaDetailsService: MediaDetailsService,
    private router:Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.mediaId = Number(params.get('id'));
      if (this.mediaId) {
        this.fetchMediaDetails();
        // this.fetchComments(); // If you want to keep comments in sync with the comment service
      }
    });
    this.setUser();
  }

  setUser() {
    // Parse cookies
    const cookies = document.cookie.split(';').reduce((acc: any, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {});
    const token = cookies['auth_token'];
    const userStr = cookies['auth_user'];
    if (token && userStr) {
      try {
        this.user = JSON.parse(decodeURIComponent(userStr));
        console.log('auth_user cookie:', userStr);
        this.isLoggedIn = true;
        return;
      } catch {}
    }
    this.user = null;
    this.isLoggedIn = false;
  }

  fetchMediaDetails() {
    if (!this.mediaId) return;
    console.log('Fetching media details for mediaId:', this.mediaId);
    this.mediaDetailsService.getMediaDetailsById(this.mediaId).subscribe({
      next: (res) => {
        console.log('GET media details response:', res);
        const data: MediaDetails = res.data;
        this.screenshots = data.screenshots || [];
        this.topCast = data.castMembers || [];
        this.reviews = data.reviews || [];
        this.comments = data.comments || [];
        this.title = data.title;
        this.synopsis = data.synopsis;
        this.thumbnailUrl = data.thumbnailUrl;
        console.log('Comments from backend:', data.comments);
      },
      error: (err) => {
        console.log('GET media details error:', err);
        this.screenshots = [];
        this.topCast = [];
        this.reviews = [];
        this.comments = [];
        this.title = '';
        this.synopsis = '';
        this.thumbnailUrl = '';
      }
    });
  }

  // fetchComments() {
  //   if (!this.mediaId) return;
  //   console.log('Fetching comments for mediaId:', this.mediaId);
  //   this.commentService.getCommentsByMediaId(this.mediaId).subscribe({
  //     next: (res) => {
  //       console.log('GET comments response:', res);
  //       this.comments = res.data || [];
  //     },
  //     error: (err) => {
  //       console.log('GET comments error:', err);
  //       this.comments = [];
  //     }
  //   });
  // }

  login() {
    this.router.navigate(['/login']);
  }

  submitComment() {
    console.log('submitComment called');
    if (!this.commentText.trim()) {
      console.log('No comment text');
      return;
    }
    if (!this.mediaId) {
      console.log('No mediaId');
      return;
    }
    const userId = getUserId();
    if (!userId) {
      console.log('No userId');
      return;
    }
    const payload: CommentPost = {
      userId: userId,
      mediaId: this.mediaId,
      comment: this.commentText.trim(),
    };
    console.log('Posting comment payload:', payload);
    this.commentService.postComment(this.mediaId, payload).subscribe({
      next: (res) => {
        console.log('POST comment response:', res);
        this.commentText = '';
        this.fetchMediaDetails();
      },
      error: (err) => {
        console.log('POST comment error:', err);
      }
    });
  }

  cancelComment() {
    this.commentText = '';
  }
}
