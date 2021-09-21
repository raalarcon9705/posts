import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostsComponent } from './posts.component';
import { PostDetailsComponent } from './views/post-details/post-details.component';
import { PostListComponent } from './views/post-list/post-list.component';

const routes: Routes = [
  {
    path: '',
    component: PostsComponent,
    children: [
      {
        path: ':id',
        component: PostDetailsComponent,
      },
      {
        path: '',
        component: PostListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostsRoutingModule {}
