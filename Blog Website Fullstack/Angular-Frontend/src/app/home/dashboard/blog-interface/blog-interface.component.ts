import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from '../../../services/blog.service';
import { FormsModule } from '@angular/forms';
import { BlogModel, CommentModel } from '../../../models/blog.model';
import { CommentComponent } from './comment/comment.component';
import { CommentService } from '../../../services/comment.service';
import { HighlightPipe } from '../../../pipes/highlight.pipe';
import { DateToDistancePipe } from '../../../pipes/date.pipe';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-blog-interface',
  standalone: true,
  imports: [CommonModule, FormsModule, CommentComponent, HighlightPipe, DateToDistancePipe],
  templateUrl: './blog-interface.component.html',
  styleUrl: './blog-interface.component.css'
})
export class BlogInterfaceComponent implements OnInit {
  blog: BlogModel | any = {};
  currentUser!: string | null;
  newComment!: string;
  comments: CommentModel[] = [];
  page: number = 1;
  limit: number = 4;
  islastPage: boolean = false;
  count: number = 0;

  constructor(private router: Router, private blogService: BlogService, private commentService: CommentService, private toastr: ToastrService) { };

  ngOnInit(): void {
    this.currentUser = sessionStorage.getItem('userName');
    this.loadBlog();
    this.loadComments();
  }

  loadBlog(): void {

    this.blogService.getBlog().subscribe((blog: any) => {
      this.blog = blog;
    })

  }

  loadComments(): void {
    this.commentService.getComments(this.page, this.limit).subscribe({
      next: (res) => {
        if (res.comments && res.comments.length < this.limit) {
          this.islastPage = true
        }
        this.comments.push(...res.comments);
      },
      error: (err) => {
        console.log(`there is some error in fetching the comments`);

      }
    })
  }
  
  onEdit(): void {
    this.router.navigate(['mainmenu', 'edit']);

  }

  convertToImage(file: any): string {
    return `data:${file.mimetype};base64,${file.buffer_string}`;
  }

  checkTime(createdAt: Date): boolean {
    return (((new Date()).getTime() - (new Date(createdAt)).getTime()) < (24 * 60 * 60 * 1000))

  }

  addLike(blog_id: string): void {
    this.blogService.incrementLikes(blog_id).subscribe((updatedBlog) => {
      this.blog = updatedBlog;
    })
  }

  onRemove(): void {
    this.blogService.removeBlog().subscribe((res) => {
      this.router.navigate(['mainmenu']);
    });
  }

  onBack(): void {
    this.router.navigate(['mainmenu']);
  }

  addComment(): void {
    this.commentService.addComment(this.newComment).subscribe((data: any) => {
      this.onRefreshComments();
    })
    this.newComment = '';
  }

  onRefreshComments(): void {
    this.page = 1;
    this.comments = [];
    this.loadComments();
  }

  loadMoreComments(): void {
    this.page++;
    this.loadComments();
  }

  copyCode(content: string): void {
    navigator.clipboard.writeText(content.replaceAll('```', '')).then(() => {
      this.toastr.success('code copied to clipboard');
    })
  }
}

