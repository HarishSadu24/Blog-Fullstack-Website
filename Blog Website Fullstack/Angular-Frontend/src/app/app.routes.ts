import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: 'mainmenu',
        canActivate:[authGuard],
        loadComponent : ()=> import('../app/home/home.component').then((m)=>m.HomeComponent),
        children : [
            {
                path:'profile',
                loadComponent: ()=>import('./home/profile/profile.component').then((m)=>m.ProfileComponent)
            },
            {
                path: 'blog',
                loadComponent : ()=> import('./home/blog/blog.component').then((m)=>m.BlogComponent),
            },
            {
                path:'',
                loadComponent: () => import('./home/dashboard/dashboard.component').then(m=>m.DashboardComponent)
            },
            {
                path:'edit',
                loadComponent: ()=>import('./home/editblog/editblog.component').then(m=>m.EditblogComponent),
            },
            {
                path:'fullblog',
                loadComponent:()=>import('./home/dashboard/blog-interface/blog-interface.component').then(m=>m.BlogInterfaceComponent),
            }
        ]
    },
    {
        path:'',
        loadComponent : ()=> import('../app/login/login.component').then((m)=>m.LoginComponent)
    },
    {
        path:'signup',
        loadComponent:()=>import('../app/signup/signup.component').then((m)=>m.SignupComponent)
    }
];
