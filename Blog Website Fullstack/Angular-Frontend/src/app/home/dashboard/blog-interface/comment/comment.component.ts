import { Component, Input } from '@angular/core';
import { CommentModel } from '../../../../models/blog.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../../../../services/comment.service';
import { BlogInterfaceComponent } from '../blog-interface.component';
import { DateToDistancePipe } from '../../../../pipes/date.pipe';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, FormsModule , DateToDistancePipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {
  @Input() comment!: CommentModel;
  @Input() count!: number;

  isShowReplies: boolean = false;
  isGiveReply: boolean = false;
  newReply: string = '';
  replies: CommentModel[] = [];
  isEdit: boolean = false;
  editedComment: string = '';
  currentUser!: string | any;
  page = 1;
  limit = 4;
  isLastPage: boolean = false;

  constructor(private commentService: CommentService , private parentComponent:BlogInterfaceComponent) {
    this.currentUser = sessionStorage.getItem('userName');
  }

  showReplies() {
    if (!this.isShowReplies) {
      this.onRefresh();
      this.isShowReplies = true;
    }
    else {
      this.isShowReplies = false;
      this.onRefresh();
    }
  }

  giveReply() {
    if (!this.isGiveReply)
      this.isGiveReply = true;
    else
      this.isGiveReply = false;
  }

  loadReplies() {
    this.commentService.getReplies(this.comment._id, this.page, this.limit).subscribe((data: any) => {
      if (data.length < this.limit) {
        this.isLastPage = true;
      }
      else {
        this.isLastPage = false;
      }
      this.replies.push(...data)
    });
  }

  onRefresh() {
    this.page = 1;
    this.replies = [];
    this.loadReplies();
  }

  lodeMoreReplies() {
    this.page++;
    this.loadReplies();
  }

  addReply() {
    this.commentService.addReply(this.comment._id, this.newReply).subscribe((data: any) => {
      this.onRefresh();
      this.newReply = '';
      this.isGiveReply = false;
    })
  }

  onEdit() {
    if (!this.isEdit) {
      this.isEdit = true;
      this.editedComment = this.comment.comment
    }
    else
      this.isEdit = false;
  }

  editComment() {
    return this.commentService.editComment(this.comment._id, this.editedComment).subscribe((res: any) => {
      this.isEdit = false;
      this.comment.comment = res.comment;
    })
  }

  addLike() {
    return this.commentService.likeComment(this.comment._id).subscribe((res: any) => {
      this.comment.likedUsers = res;
    })
  }

  checkTime(): boolean {
    return (((new Date()).getTime() - (new Date(this.comment.createdAt)).getTime()) < (5 * 60 * 1000))

  }

  deleteComment(comment_id:string){
    this.commentService.deleteComment(comment_id).subscribe((data)=>{
      this.parentComponent.onRefreshComments();
    })
  }
}
