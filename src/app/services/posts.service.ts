import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { IPost } from '../interfaces/post';
import { environment } from '@environments';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private _posts$ = new BehaviorSubject<IPost[]>([]);
  private _loading$ = new BehaviorSubject<boolean>(false);
  private _pageInfo$ = new BehaviorSubject({
    page: 1,
    limit: 10,
    hasNext: true,
  });
  private _selectedPost$ = new BehaviorSubject<IPost | null>(null);

  get selectedPost$() {
    return this._selectedPost$.asObservable();
  }

  get posts$() {
    return this._posts$.asObservable();
  }
  get pageInfo$() {
    return this._pageInfo$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }

  readonly url = `${environment.apis.api}/posts`;

  constructor(private http: HttpClient) {}

  loadPosts() {
    this._loading$.next(true);
    const pageInfo = this._pageInfo$.value;
    const params: any = {
      _page: pageInfo.page,
      _limit: pageInfo.limit,
      _expand: 'user',
    };
    this.http
      .get<IPost[]>(this.url, { params, observe: 'response' })
      .pipe(
        tap((res) => {
          // Update the Pagination Info

          const pageInfo = this._pageInfo$.value;
          pageInfo.page++;
          const total = +(res.headers.get('x-total-count') || '0');
          const pages = total / pageInfo.limit;
          pageInfo.hasNext = pageInfo.page < pages;
          this._pageInfo$.next(pageInfo);
        }),
        map((res) => res.body as IPost[]),
        withLatestFrom(this._posts$)
      )
      .subscribe(
        ([newPosts, loadedPosts]) => {
          // Prevent duplications in the collection
          const posts = loadedPosts.concat(
            newPosts.filter((p) => !loadedPosts.find((_p) => _p.id === p.id))
          );
          this._posts$.next(posts);
          this._loading$.next(false);
        },
        () => this._loading$.next(false)
      );
  }

  loadPost(id: number) {
    this.http
      .get<IPost>(`${this.url}/${id}`, { params: { _expand: 'user' } })
      .subscribe((post) => {
        this._selectedPost$.next(post);
      });
  }
}
