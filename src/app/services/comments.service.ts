import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments';
import { BehaviorSubject } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { IComment } from '../interfaces/comment';
import { Filter } from '../interfaces/filter';
import { IPageInfo } from '../interfaces/page-info';

interface ICommentState {
  pageInfo: IPageInfo;
  loading: boolean;
  comments: IComment[];
  filter: Filter;
}

interface CommentsStore {
  [id: number]: ICommentState;
}

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  readonly url = `${environment.apis.api}/comments`;

  commentsStore$: BehaviorSubject<CommentsStore> = new BehaviorSubject({});

  constructor(private http: HttpClient) {}

  setLoading(postId: number, value: boolean) {
    const store = this.commentsStore$.value;
    const newStore = {
      ...store,
      [postId]: {
        ...store[postId],
        loading: value,
      },
    };
    this.commentsStore$.next(newStore);
  }

  loadComments(postId: number) {
    this.setLoading(postId, true);

    // Get current state from post with ID postId
    const state = this.commentsStore$.value[postId];
    const pageInfo = state?.pageInfo ?? { page: 1, limit: 10, hasNext: true };
    const comments = state?.comments ?? [];
    const filter = state?.filter ?? {};
    const params: any = {
      _page: pageInfo.page,
      _limit: pageInfo.limit,
      postId,
    };
    if (filter?.q) {
      params.q = filter.q;
    }
    if (filter.order) {
      params._order = filter.order;
    }
    if (filter.sort) {
      params._sort = filter.sort;
    }
    this.http
      .get<IComment[]>(this.url, { params, observe: 'response' })
      .pipe(
        tap((res) => {
          // Update the Pagination Info
          pageInfo.page++;
          const total = +(res.headers.get('x-total-count') || '0');
          const pages = total / pageInfo.limit;
          pageInfo.hasNext = pageInfo.page < pages;
        }),
        map((res) => res.body as IComment[]),
        map((comments) => {
          if (filter.q) {
            const query = new RegExp(filter.q, 'g');
            const match = `<strong>${filter.q}</strong>`;
            return comments.map((post) => ({
              ...post,
              body: post.body.replace(query, match),
            }));
          }
          return comments;
        })
      )
      .subscribe(
        (newComments) => {
          // Prevent duplications in the collection

          const _comments = comments.concat(
            newComments.filter((p) => !comments.find((_p) => _p.id === p.id))
          );
          const store = this.commentsStore$.value;
          store[postId] = {
            comments: _comments,
            pageInfo,
            loading: false,
            filter: {},
          };
          this.commentsStore$.next(store);
          this.setLoading(postId, false);
        },
        () => this.setLoading(postId, false)
      );
  }

  setFilter(postId: number, filter: Filter) {
    const state = this.commentsStore$.value;
    const newState: CommentsStore = {
      ...state,
      [postId]: {
        comments: [],
        pageInfo: { page: 1, limit: 10, hasNext: true },
        filter: filter,
        loading: true,
      },
    };
    this.commentsStore$.next(newState);
    this.commentsStore$
      .pipe(take(1))
      .subscribe(() => this.loadComments(postId));
  }
}
