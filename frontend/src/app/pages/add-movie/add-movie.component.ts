import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatListOption } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIcon } from '@angular/material/icon';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';

// models/media.model.ts
export enum MediaTypeEnum {
  MOVIE = 'MOVIE',
  TV_SHOW = 'TV SHOW',
  DOCUMENTARY = 'DOCUMENTARY',
}

export enum MediaGenreEnum {
  ACTION = 'ACTION',
  COMEDY = 'COMEDY',
  DRAMA = 'DRAMA',
  HORROR = 'HORROR',
  SCI_FI = 'SCI-FI',
  ROMANCE = 'ROMANCE',
  THRILLER = 'THRILLER',
  DOCUMENTARY = 'DOCUMENTARY',
  ANIMATION = 'ANIMATION',
}

export interface MediaForm {
  mediaType: MediaTypeEnum | null;
  title: string;
  synopsis: string;
  releaseDate: string | null;
  duration: number | null;
  language: string;
  genres: Set<MediaGenreEnum>;
  trailerFile: File | null;
  thumbnailFile: File | null;
  mediaFile: File | null;
}

@Component({
  selector: 'app-add-movie',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-movie.component.html',
  styleUrl: './add-movie.component.scss',
})
export class AddMovieComponent {
  mediaForm: FormGroup;
  mediaTypes = Object.values(MediaTypeEnum);
  genreOptions = Object.values(MediaGenreEnum);
  maxDate = new Date().toISOString().split('T')[0];

  constructor(private fb: FormBuilder) {
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

  ngOnInit(): void {}

  atLeastOneGenreValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    return control.value && control.value.length > 0
      ? null
      : { required: true };
  }

  onFileChange(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.mediaForm.get(controlName)?.setValue(input.files[0]);
    }
  }

  toggleGenre(genre: MediaGenreEnum): void {
    const genresControl = this.mediaForm.get('genres');
    if (!genresControl) return;

    const currentGenres: MediaGenreEnum[] = genresControl.value || [];
    const index = currentGenres.indexOf(genre);

    if (index === -1) {
      currentGenres.push(genre);
    } else {
      currentGenres.splice(index, 1);
    }

    genresControl.setValue(currentGenres);
    genresControl.markAsTouched();
  }

  isGenreSelected(genre: MediaGenreEnum): boolean {
    const genres = this.mediaForm.get('genres')?.value || [];
    return genres.includes(genre);
  }

  onSubmit(): void {
    if (this.mediaForm.valid) {
      const formValue: MediaForm = {
        ...this.mediaForm.value,
        releaseDate: this.mediaForm.value.releaseDate,
        genres: new Set(this.mediaForm.value.genres),
      };
      console.log('Form submitted:', formValue);
      // Here you would typically call a service to submit the form
    } else {
      this.mediaForm.markAllAsTouched();
    }
  }
}
