import { Component,  OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BlogService } from '../../services/blog.service';
import { DateToDistancePipe } from '../../pipes/date.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule , DateToDistancePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  constructor(private blogService: BlogService, private router: Router, private http: HttpClient) { };

  filter: 'all' | 'user' | 'removed' = 'all';
  blogs: any[] = [];
  page = 1;
  limit = 4;
  isLastPage = false;
  sortBy: 'createdAt' | 'likes' = 'createdAt';
  currentUser!: string | null;
  removedBlogs: boolean = false;
  isRemovedPage: boolean = false;

  ngOnInit(): void {
    this.loadBlogs();
    this.currentUser = sessionStorage.getItem('userName');
    this.blogService.$refreshTokenReceived.subscribe((res: any) => {
      this.currentUser = sessionStorage.getItem('userName');
      this.filter = 'all';
      this.blogs = [];
      this.page = 1;
      this.limit = 4;
      this.isLastPage = false;
      this.sortBy = 'createdAt';
      window.location.reload();
      this.loadBlogs();
    })
  }

  loadBlogs(): void {
    this.blogService.fetchBlogs(this.sortBy, this.page, this.limit, this.filter).subscribe((data) => {
      if (data.length < this.limit) {
        this.isLastPage = true;
      }
      this.blogs.push(...data);

    });

  }

  loadMore(): void {
    this.page++;
    this.loadBlogs();
  }

  updateSorting(): void {
    this.blogs = [];
    this.page = 1;
    this.isLastPage = false;
    this.loadBlogs();
  }

  addLike(blog_id: string) {
    this.blogService.incrementLikes(blog_id).subscribe((updatedBlog) => {
      const index = this.blogs.findIndex((blog) => blog._id === blog_id);
      if (index !== -1) {
        this.blogs[index] = updatedBlog;
      }
    })
  }

  updateFilter() {
    this.blogs = [];
    this.page = 1;
    this.isLastPage = false;
    this.loadBlogs();
  }

  onReadMore(id: any) {
    sessionStorage.setItem('blog_id', id);
    this.router.navigate(['mainmenu', 'fullblog']);
  }

  onToggleSwitch() {
    if (this.isRemovedPage) {
      this.filter = 'removed';
    }
    else {
      this.filter = 'all';
    }

    this.updateFilter();
  }

  onEdit(id: any) {
    sessionStorage.setItem('blog_id', id)
    this.router.navigate(['mainmenu', 'edit']);
  }

  onDelete(id: any) {
    sessionStorage.setItem('blog_id', id);
    this.blogService.deleteBlog();
  }

  onRepublish(id: any) {
    sessionStorage.setItem('blog_id', id);
    const editedBlog: any = {
      isRemoved: false
    }
    this.blogService.editBlog(editedBlog);
    window.location.reload();
  }
}
