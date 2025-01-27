import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
	FormGroup,
	Validators,
	FormBuilder,
	ReactiveFormsModule,
	FormsModule,
	FormArray,
} from '@angular/forms';
import { BlogService } from '../../services/blog.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { HighlightPipe } from "../../pipes/highlight.pipe";

@Component({
	selector: 'app-blog',
	standalone: true,
	imports: [ReactiveFormsModule, FormsModule, CommonModule, HighlightPipe],
	templateUrl: './blog.component.html',
	styleUrl: './blog.component.css'
})
export class BlogComponent implements OnInit {


	blogForm!: FormGroup;
	tags: string[] = [];
	selectedTags: string[] = [];
	showAddInputTag: boolean = false;
	uniqueTags!: Set<string>;
	selectedFile: any | null = null;
	content: {
		type: string;
		content: string;
	}[] = [];
	newContent = '';

	constructor(private fb: FormBuilder, private blogService: BlogService, private router: Router, private toastr: ToastrService, private cdr: ChangeDetectorRef) {
	}
	ngOnInit() {
		this.blogForm = this.fb.group({
			title: ['', [Validators.required, Validators.minLength(3)]],
			content: [[], [Validators.required]],
			tags: [[], Validators.required],
			media: this.fb.array([]),
			customTag: ['']
		});

		this.blogService.getTags().subscribe((data: any) => {
			this.tags.push(...data);
			this.uniqueTags = new Set(this.tags);
		});
	}

	addContent(description: HTMLTextAreaElement, type: HTMLSelectElement) {
		let newContent = {
			type: type.value,
			content: description.value,
		}
		this.content.push(newContent);
		this.blogForm.get('content')?.setValue(this.content);
		type.value = 'text'
		description.value = '';

	}

	checkTags() {
		if (!this.selectedTags.includes(this.blogForm.value.customTag) && (this.blogForm.value.customTag !== "other")) {
			this.selectedTags.push(this.blogForm.value.customTag);
			this.showAddInputTag = false;
			this.blogForm.get('tags')?.setValue(this.selectedTags);
		}
		else if (!this.selectedTags.includes(this.blogForm.value.customTag) && (this.blogForm.value.customTag === 'other')) {
			this.showAddInputTag = true;
			this.blogForm.get('customTag')?.setValue('');
		}
	}

	addCustomTag() {
		const newTag = this.blogForm.get('customTag')?.value;
		if (newTag) {
			this.selectedTags.push(newTag);
			this.blogForm.get('tags')?.setValue(this.selectedTags);
			this.blogForm.get('customTag')?.setValue('');
			this.showAddInputTag = false;
		}
	}

	removeTag(index: number) {
		this.blogForm.get('customTag')?.setValue('');
		this.selectedTags.splice(index, 1);
		this.blogForm.get('tags')?.setValue(this.selectedTags);
	}

	get mediaArray(): FormArray {
		return this.blogForm.get('media') as FormArray;
	}

	onMediaChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			this.mediaArray.push(this.fb.control(input.files[0]))
		}
	}

	onSubmit() {
		this.blogService.addBlog({ ...this.blogForm.value }).subscribe((data) => {
			// if(data.status == 406)
			// 	console.log('blog not created');
			this.toastr.success('Blog created');

			window.location.reload();
		},
			(error: HttpErrorResponse) => {
				this.toastr.error('Cannot create Blog');
			}
		);
		this.router.navigate(['mainmenu'])
	}

	onCancel() {
		this.router.navigateByUrl('/mainmenu')
	}

}
