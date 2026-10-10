import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category-service';
import { Category } from '../../classes/category';

@Component({
  selector: 'app-category-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-page.html',
  styleUrl: './category-page.css',
})
export class CategoryPage implements OnInit {
  categoryForm!: FormGroup;

  categories: Category[] = [];
  category: Category | undefined;
  isEdit: boolean = false;

  constructor(private categoryService: CategoryService, private fb: FormBuilder, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getData();
    this.initForm();
  }

  private initForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  get f() {
    return this.categoryForm.controls;
  }

  private getData(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  onSubmit(): void {
    const categoryData: Category = this.categoryForm.value;
    if (this.isEdit) { // update
      this.categoryService.update(this.category!._id!, categoryData).subscribe({
        next: () => {
          alert('Update completed');
          this.resetForm();
        },
        error: (err) => alert(this.errorText(err))
      });
    } else { // add
      this.categoryService.create(categoryData).subscribe({
        next: () => {
          alert('New category created');
          this.resetForm();
        },
        error: (err) => alert(this.errorText(err))
      });
    }
  }

  selectCategory(selected: Category): void {
    this.isEdit = true; // change to edit mode
    this.category = selected;
    this.categoryForm.patchValue({
      name: selected.name,
      description: selected.description
    });
  }

  resetForm(): void {
    this.isEdit = false;
    this.category = undefined;
    this.categoryForm.reset();
    this.getData();
  }

  deleteCategory(deleted: Category): void {
    if (confirm('Are you sure to delete ' + deleted.name + '?')) {
      this.categoryService.delete(deleted._id!).subscribe({
        next: () => {
          alert('DELETE OK.');
          this.resetForm();
        },
        error: (err) => alert(this.errorText(err))
      });
    }
  }

  private errorText(err: any): string {
    return err.error?.message ?? 'Cannot reach the server. Is the back-end running?';
  }

}
