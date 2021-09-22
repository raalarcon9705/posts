import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map, take, tap, withLatestFrom } from 'rxjs/operators';
import { Filter } from 'src/app/interfaces/filter';
import { IPost } from 'src/app/interfaces/post';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostListComponent implements OnInit {
  orderOptions = [
    { field: 'title', label: 'Title' },
    { field: 'body', label: 'Content' },
  ];
  posts$ = this.postsService.posts$;
  loading$ = this.postsService.loading$;
  hasNext$ = combineLatest([this.loading$, this.postsService.pageInfo$]).pipe(
    map(([loading, pageInfo]) => !loading && pageInfo.hasNext)
  );
  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    this.postsService.pageInfo$.pipe(take(1)).subscribe((pageInfo) => {
      if (pageInfo.page === 1) {
        this.postsService.loadPosts();
      }
    });
  }

  loadMore() {
    this.postsService.pageInfo$.pipe(take(1)).subscribe((pageInfo) => {
      if (pageInfo.hasNext) {
        this.postsService.loadPosts();
      }
    });
  }

  setFilter(filter: Filter) {
    this.postsService.setFilter(filter);
  }

  trackById(idx: number, post: IPost) {
    return post.id;
  }
}
