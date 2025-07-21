import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddMediaService } from '../../core/services/add-media/add-media.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule, Location, TitleCasePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { f } from '../../../../node_modules/@angular/material/icon-module.d-COXCrhrh';
import { MatIcon } from '@angular/material/icon';

enum mediaTypeEnum {
  MOVIE = 'MOVIE',
  'TV_SHOW' = 'SERIES',
}

enum mediaGenreEnum {
  ACTION = 'ACTION',
  COMEDY = 'COMEDY',
  DRAMA = 'DRAMA',
  THRILLER = 'THRILLER',
  HORROR = 'HORROR',
  'SCIENCE_FICTION' = 'SCIENCE FICTION',
  FANTASY = 'FANTASY',
  ROMANCE = 'ROMANCE',
  ANIMATION = 'ANIMATION',
  DOCUMENTARY = 'DOCUMENTARY',
}

@Component({
  selector: 'app-add-movie.page',
  imports: [TitleCasePipe, CommonModule, ReactiveFormsModule, MatProgressSpinnerModule, MatIcon],
  templateUrl: './add-movie.page.component.html',
  styleUrls: ['./add-movie.page.component.scss'],
})
export class AddMoviePageComponent {
  mediaForm!: FormGroup;
  isLoading = false;
  mediaTypes = Object.values(mediaTypeEnum);
  genreOptions = Object.values(mediaGenreEnum);
  maxDate = new Date().toISOString().split('T')[0];

  constructor(
    private fb: FormBuilder,
    private mediaService: AddMediaService,
    private snackBar: MatSnackBar,
    private location: Location,
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.mediaForm = this.fb.group({
      mediaType: [null, Validators.required],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      synopsis: ['', Validators.maxLength(2000)],
      releaseDate: [null, Validators.required],
      duration: [null, [Validators.required, Validators.min(0)]],
      language: ['', [Validators.required, Validators.maxLength(50)]],
      genres: [[], [this.atLeastOneGenreValidator]],
      trailerFile: [null],
      thumbnailFile: [null, Validators.required],
      mediaFile: [null, Validators.required],
    });
  }

  atLeastOneGenreValidator(control: AbstractControl): { [key: string]: boolean } | null {
    return control.value && control.value.length > 0 ? null : { required: true };
  }

  onFileChange(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.mediaForm!.get(controlName)?.setValue(input.files[0]);
      this.mediaForm!.get(controlName)?.markAsTouched();
    }
  }

  toggleGenre(genre: mediaGenreEnum): void {
    const genresControl = this.mediaForm!.get('genres');
    if (!genresControl) return;

    const currentGenres: mediaGenreEnum[] = genresControl.value || [];
    const index = currentGenres.indexOf(genre);

    if (index === -1) {
      currentGenres.push(genre);
    } else {
      currentGenres.splice(index, 1);
    }

    genresControl.setValue(currentGenres);
    genresControl.markAsTouched();
  }

  isGenreSelected(genre: mediaGenreEnum): boolean {
    const genres = this.mediaForm!.get('genres')?.value || [];
    return genres.includes(genre);
  }

  onSubmit(): void {
    if (this.mediaForm!.invalid) {
      this.mediaForm!.markAllAsTouched();
      this.snackBar.open('Please fill all required fields correctly', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    this.isLoading = true;
    const formData = this.prepareFormData();

    this.mediaService.createMedia(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.snackBar.open('Media created successfully!', 'Close', {
          duration: 5000,
          panelClass: ['success-snackbar'],
        });
        this.mediaForm!.reset();
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        let errorMessage = 'An error occurred while creating media';
        if (error.error?.message) {
          errorMessage = error.error.message;
        }
        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
        console.error('Error creating media:', error);
      },
    });
  }

  private prepareFormData(): FormData {
    const formValue = this.mediaForm!.value;
    const formData = new FormData();

    // Append simple fields
    formData.append('mediaTypeEnum', formValue.mediaType);
    formData.append('title', formValue.title);
    formData.append('synopsis', formValue.synopsis);
    formData.append('releaseDate', formValue.releaseDate);
    formData.append('duration', formValue.duration.toString());
    formData.append('language', formValue.language);

    // Append arrays
    formValue.genres.forEach((genre: string) => {
      formData.append('genres', genre);
    });

    // Append files
    if (formValue.trailerFile) {
      formData.append('trailerFile', formValue.trailerFile);
    }
    if (formValue.thumbnailFile) {
      formData.append('thumbnailFile', formValue.thumbnailFile);
    }
    if (formValue.mediaFile) {
      formData.append('mediaFile', formValue.mediaFile);
    }

    return formData;
  }

  goBack() {
    this.location.back();
  }
}
