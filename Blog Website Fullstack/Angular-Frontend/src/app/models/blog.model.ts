export interface BlogModel{
    _id:string;
    title: string;
    content: {
        type:string;
        content:string;
    };
    likes:number;
    likedUsers:string[];
    userName:string;
    comments:CommentModel[];
    tags: string[];
    isRemoved:boolean;
    createdAt:Date;
    updatedAt:Date;
    media:any;
    customTag:string;  
}

export interface LoginModel {
    userName: string;
    password: string;
}

export interface SignupModel {
    userName : string;
    displayName : string;
    password : string;
    confirmPassword: string;
    email: string;
}

export interface UpdateProfileModel {
    displayName: string;
    password: string;
    email: string;
}

export interface EditBlogModel {
    title: string;
    content: string;
    media: File | null;
    tags: string[];
    isRemoved:boolean;
}

export interface CommentModel {
    _id:string;
    userName:string;
    comment:string;
    replies:CommentModel[];
    likedUsers:string[];
    createdAt:Date;
    updatedAt:Date;
    parentComment:string;
}