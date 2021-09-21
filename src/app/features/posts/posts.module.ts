import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostsRoutingModule } from './posts-routing.module';
import { PostsComponent } from './posts.component';
import { PostListComponent } from './views/post-list/post-list.component';
import { PostDetailsComponent } from './views/post-details/post-details.component';
import { PostItemComponent } from './components/post-item/post-item.component';
import { CommentsModule } from '../comments/comments.module';


@NgModule({
  declarations: [
    PostsComponent,
    PostListComponent,
    PostDetailsComponent,
    PostItemComponent
  ],
  imports: [
    CommonModule,
    PostsRoutingModule,
    CommentsModule
  ]
})
export class PostsModule { }
