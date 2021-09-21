import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { IComment } from 'src/app/interfaces/comment';
import { CommentsService } from 'src/app/services/comments.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsComponent implements OnInit {
  @Input() postId!: number;
  @Input() loadOnInit!: boolean;
  comments$!: Observable<IComment[]>;
  loading$!: Observable<boolean>;
  hasNext$: Observable<boolean>;
  noComments$: Observable<boolean>;

  showComments = false;

  constructor(
    private commentsService: CommentsService,
    private cdr: ChangeDetectorRef
  ) {
    const state = this.commentsService.commentsStore$.pipe(
      map((s) => s[this.postId])
    );
    this.comments$ = state.pipe(map((s) => s?.comments));
    this.loading$ = state.pipe(map((s) => s?.loading));
    this.hasNext$ = state.pipe(map((s) => s?.pageInfo?.hasNext));
    this.noComments$ = this.comments$?.pipe(
      withLatestFrom(this.loading$),
      map(([comments, loading]) => !comments?.length && !loading)
    );
  }

  ngOnInit(): void {
    if (this.loadOnInit) {
      this.loadComments();
    }
  }

  loadComments() {
    this.showComments = true;
    this.cdr.detectChanges();
    this.commentsService.loadComments(this.postId);
  }
}
