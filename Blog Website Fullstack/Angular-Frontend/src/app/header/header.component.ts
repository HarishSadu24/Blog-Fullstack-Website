import { ToastrService } from 'ngx-toastr';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BlogService } from '../services/blog.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(public router: Router , private toastr:ToastrService , private blogService:BlogService){};
  onClick(url: any){
    this.router.navigate(['mainmenu',url]);
  }

  onLogout(){
    // sessionStorage.removeItem('accessToken');
    // sessionStorage.removeItem('refreshToken');
    // sessionStorage.removeItem('userName');
    // sessionStorage.removeItem('blog_id');
    // this.router.navigate(['']);
    // this.toastr.warning('Logged out');
    this.blogService.onLogout();
  }

  onBlog(){
    this.router.navigate(['mainmenu']);
  }
}
