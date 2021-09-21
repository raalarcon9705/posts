import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { IComment } from 'src/app/interfaces/comment';

@Component({
  selector: 'app-comment-item',
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentItemComponent implements OnInit {
  @Input() comment!: IComment;

  constructor() {}

  ngOnInit(): void {}
}
