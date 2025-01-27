import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable, Subject } from "rxjs"
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environment';
import { LoginModel, SignupModel, BlogModel } from '../models/blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {
    this.$refreshToken.subscribe((res) => {
      this.getRefreshToken();
    })
  }

  public $refreshToken = new Subject<boolean>;
  public $refreshTokenReceived = new Subject<boolean>;

  addBlog(blog: BlogModel): Observable<any> {
    const { customTag, ...newBlog } = blog;
    return this.http.post(`${environment.blog_api}/createblog`, newBlog);
  }

  signin(loginCredentials: LoginModel) {
    const api_url = `${environment.user_api}/signin`;
    return this.http.post<{ accessToken: string, refreshToken: string, userName: string }>(api_url, loginCredentials).subscribe((res) => {
      sessionStorage.setItem('accessToken', res.accessToken);
      sessionStorage.setItem('refreshToken', res.refreshToken);
      sessionStorage.setItem('userName', res.userName);
      this.router.navigate(['mainmenu']);
      this.toastr.success('Login Successful')

    },
      (error) => {
        this.toastr.error('Invalid Login Credentials');
      });
  }

  signUp(signupCredentials: SignupModel) {
    const api_url = `${environment.user_api}/signup`;
    return this.http.post<any>(api_url, signupCredentials)
  }

  async getRefreshToken() {
    const obj = {
      refreshToken: sessionStorage.getItem('refreshToken')
    }
    this.http.post(`${environment.auth_api}/refresh`, obj).subscribe((res: any) => {
      sessionStorage.setItem('refreshToken', res.refreshToken);
      sessionStorage.setItem('accessToken', res.accessToken);
      sessionStorage.setItem('userName', res.userName);
      this.router.navigateByUrl('/mainmenu')
      this.$refreshTokenReceived.next(true);
    })
  }

  fetchBlogs(sortBy: 'createdAt' | 'likes' = 'createdAt', page: number = 1, limit: number = 4, filter: 'all' | 'user' | 'removed' = 'all') {

    const api_url = `${environment.blog_api}/fetchblogs`;
    return this.http.get<any>(api_url, {
      params: {
        sortBy,
        page,
        limit,
        filter
      },

    });
  }

  incrementLikes(blog_id: string) {
    const api_url = environment.blog_api;
    return this.http.patch<any>(`${api_url}/like/${blog_id}`, {});
  }

  getBlog() {
    const api_url = environment.blog_api;
    const blog_id = sessionStorage.getItem('blog_id');
    return this.http.get(`${api_url}/getblog/${blog_id}`);
  }

  editBlog(blog: BlogModel) {
    const api_url = environment.blog_api;
    const id = sessionStorage.getItem('blog_id');
    return this.http.patch(`${api_url}/updateblog/${id}`, blog).subscribe((res) => {
    });
  }

  removeBlog() {
    const api_url = environment.blog_api;
    const blog_id = sessionStorage.getItem('blog_id');

    const isRemoved: boolean = true;
    return this.http.patch(`${api_url}/removeblog/${blog_id}`, { isRemoved })
  }

  deleteBlog() {
    const api_url = environment.blog_api;
    const blog_id = sessionStorage.getItem('blog_id');
    return this.http.delete(`${api_url}/deleteblog/${blog_id}`).subscribe((res) => {
      this.router.navigateByUrl('/',{
        skipLocationChange:true
      }).then(()=>{
        this.router.navigate([this.router.url])
      })
    },
  (error)=>{
    this.router.navigateByUrl('/',{
      skipLocationChange:true
    }).then(()=>{
      this.router.navigate([this.router.url])
    })
  })
  }

  getTags() {
    const api_url = environment.blog_api;
    return this.http.get(`${api_url}/tags`);
  }

  addMedia(file: File, blog_id: string) {
    const api_url = environment.blog_api;
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${api_url}/uploadfile/${blog_id}`, formData)
  }

  onLogout() {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('blog_id');
    this.router.navigate(['']);
    this.toastr.warning('Logged out');
  }

  
}
