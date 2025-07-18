import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Comment {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  userLiked?: boolean;
  userDisliked?: boolean;
}

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.scss']
})
export class CommentSectionComponent {
  newComment = '';
  comments: Comment[] = [
    {
      id: 1,
      user: {
        name: 'Davida',
        avatar: 'assets/images/image.png'
      },
      text: 'Anyway to get drugs pushed down our throats, i\'m really not liking it. It should be taken down the internet',
      timestamp: 'July 12, 2025 at 12:25 am',
      likes: 0,
      dislikes: 0
    },
    {
      id: 2,
      user: {
        name: 'Davida',
        avatar: 'assets/images/Rectangle 6.png'
      },
      text: 'Anyway to get drugs pushed down our throats, i\'m really not liking it. It should be taken down the internet',
      timestamp: 'July 12, 2025 at 12:25 am',
      likes: 0,
      dislikes: 0
    },
    {
      id: 3,
      user: {
        name: 'Davida',
        avatar: 'assets/images/Rectangle 5.png'
      },
      text: 'Anyway to get drugs pushed down our throats, i\'m really not liking it. It should be taken down the internet',
      timestamp: 'July 12, 2025 at 12:25 am',
      likes: 0,
      dislikes: 0
    },
    {
      id: 4,
      user: {
        name: 'Davida',
        avatar: 'assets/images/Rectangle 4.png'
      },
      text: 'Anyway to get drugs pushed down our throats, i\'m really not liking it. It should be taken down the internet',
      timestamp: 'July 12, 2025 at 12:25 am',
      likes: 0,
      dislikes: 0
    }
  ];

  currentUser = {
    name: 'User',
    avatar: 'assets/images/Rectangle 3.png'
  };

  addComment() {
    if (this.newComment.trim()) {
      const comment: Comment = {
        id: Date.now(),
        user: this.currentUser,
        text: this.newComment,
        timestamp: new Date().toLocaleString(),
        likes: 0,
        dislikes: 0
      };
      
      this.comments.unshift(comment);
      this.newComment = '';
    }
  }

  submitComment() {
    this.addComment();
  }

  cancelComment() {
    this.newComment = '';
  }

  likeComment(comment: Comment) {
    if (comment.userLiked) {
      comment.likes--;
      comment.userLiked = false;
    } else {
      if (comment.userDisliked) {
        comment.dislikes--;
        comment.userDisliked = false;
      }
      comment.likes++;
      comment.userLiked = true;
    }
  }

  dislikeComment(comment: Comment) {
    if (comment.userDisliked) {
      comment.dislikes--;
      comment.userDisliked = false;
    } else {
      if (comment.userLiked) {
        comment.likes--;
        comment.userLiked = false;
      }
      comment.dislikes++;
      comment.userDisliked = true;
    }
  }
} 