import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsComponent } from './components/comments/comments.component';
import { CommentItemComponent } from './comment-item/comment-item.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [CommentsComponent, CommentItemComponent],
  imports: [SharedModule],
  exports: [CommentsComponent],
})
export class CommentsModule {}
