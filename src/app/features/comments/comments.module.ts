import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsComponent } from './components/comments/comments.component';
import { CommentItemComponent } from './comment-item/comment-item.component';

@NgModule({
  declarations: [CommentsComponent, CommentItemComponent],
  imports: [CommonModule],
  exports: [CommentsComponent],
})
export class CommentsModule {}
