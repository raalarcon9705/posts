import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { CommentsComponent } from 'src/app/features/comments/components/comments/comments.component';
import { IPost } from 'src/app/interfaces/post';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('collapse', [
      state(
        'hidden',
        style({
          height: '0',
          overflow: 'hidden',
        })
      ),
      state(
        'visible',
        style({
          height: '100%',
          overflow: 'hidden',
        })
      ),
      transition('hidden <=> visible', animate(200)),
    ]),
  ],
})
export class PostItemComponent implements OnInit {
  commentRef!: CommentsComponent;

  @Input() post!: IPost;
  @Input() showFooter = true;
  @Input() loadCommentsOnInit = false;

  collapseState!: 'hidden' | 'visible';

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.collapseState = !!this.showFooter ? 'hidden' : 'visible';
  }

  toggleState() {
    if (this.collapseState === 'visible') {
      this.collapseState = 'hidden';
    } else {
      this.collapseState = 'visible';
    }
    this.cdr.detectChanges();
  }
}
