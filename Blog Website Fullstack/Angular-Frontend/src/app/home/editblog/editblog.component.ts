import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import hljs from 'highlight.js';


@Component({
	selector: 'app-editblog',
	standalone: true,
	imports: [ReactiveFormsModule, FormsModule, CommonModule],
	templateUrl: './editblog.component.html',
	styleUrl: './editblog.component.css'
})
export class EditblogComponent implements OnInit {

	tags: string[] = ['Java', 'Python', 'JavaScript'];
	selectedTags: string[] = [];
	showAddInputTag: boolean = false;
	editBlogForm !: FormGroup;
	uniqueTags!: Set<string>;
	content: {
		type: string;
		content: string;
	}[] = [];
	newContent = '';

	constructor(private fb: FormBuilder, private router: Router, private blogService: BlogService) { };

	ngOnInit(): void {
		this.editBlogForm = this.fb.group({
			id: [''],
			title: ['', Validators.minLength(3)],
			content: [[]],
			tags: [[]],
			media: this.fb.array([]),
			customTag: ['']
		});

		this.blogService.getTags().subscribe((data: any) => {
			this.tags.push(...data);
			this.uniqueTags = new Set(this.tags);
		});

		this.blogService.getBlog().subscribe((data: any) => {
			console.log(data);
			if (!data) {
				this.router.navigate(['mainmenu']);
				alert('only blog author can edit the blog');
			}
			this.editBlogForm.patchValue({
				id: data._id,
				title: data.title,
				content: [],
				tags: data.tags,
				media: data.media
			});
			this.content = data.content
			this.selectedTags = data.tags;
		},
			(error) => {
				alert('only blog author can edit the blog');
				this.router.navigate(['mainmenu'])
			});
	}

	removeContent(index: number) {
		this.content.splice(index, 1);
		console.log(this.content, 'remove content');
	}
	addContent(description: HTMLTextAreaElement, type: HTMLSelectElement) {
		let newContent = {
			type: type.value,
			content: description.value,
		}
		this.content.push(newContent);
		this.editBlogForm.get('content')?.setValue(this.content);
		type.value = 'text'
		description.value = '';
	}

	checkContent(content: any) {
		console.log(content);
	}

	checkTags() {
		if (!this.selectedTags.includes(this.editBlogForm.value.customTag) && (this.editBlogForm.value.customTag !== "other")) {
			this.selectedTags.push(this.editBlogForm.value.customTag);
			this.showAddInputTag = false;
			this.editBlogForm.get('tags')?.setValue(this.selectedTags);
		}
		else if (!this.selectedTags.includes(this.editBlogForm.value.customTag) && (this.editBlogForm.value.customTag === 'other')) {
			this.showAddInputTag = true;
			this.editBlogForm.get('customTag')?.setValue('');
		}
	}

	addCustomTag() {
		const newTag = this.editBlogForm.get('customTag')?.value;
		if (newTag) {
			this.selectedTags.push(newTag);
			this.editBlogForm.get('tags')?.setValue(this.selectedTags);
			this.editBlogForm.get('customTag')?.setValue('');
			this.showAddInputTag = false;
		}
	}

	removeTag(index: number) {
		this.selectedTags.splice(index, 1);
		this.editBlogForm.get('tags')?.setValue(this.selectedTags);
		console.log(this.editBlogForm.value.tags);
	}

	get mediaArray(): FormArray {
		return this.editBlogForm.get('media') as FormArray;
	}

	onMediaChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			this.mediaArray.push(this.fb.control(input.files[0]))
		}
	}


	onSaveChanges() {
		this.editBlogForm.get('content')?.setValue(this.content);
		const { id, customTag, ...blog } = this.editBlogForm.value;
		this.blogService.editBlog(blog);
		this.router.navigate(['mainmenu', 'fullblog']); 
		setTimeout(()=>window.location.reload(), 200)
	}

	onBack() {
		this.router.navigate(['mainmenu', 'fullblog']);
	}

}
