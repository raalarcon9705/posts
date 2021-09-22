import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostsRoutingModule } from './posts-routing.module';
import { PostsComponent } from './posts.component';
import { PostListComponent } from './views/post-list/post-list.component';
import { PostDetailsComponent } from './views/post-details/post-details.component';
import { PostItemComponent } from './components/post-item/post-item.component';
import { CommentsModule } from '../comments/comments.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    PostsComponent,
    PostListComponent,
    PostDetailsComponent,
    PostItemComponent,
  ],
  imports: [SharedModule, PostsRoutingModule, CommentsModule],
})
export class PostsModule {}
