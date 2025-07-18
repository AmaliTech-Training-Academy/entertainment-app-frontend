import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
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

@Component({
  selector: 'app-add-movie',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatSelect,
    MatOption,
    MatListOption,
    MatDatepickerModule,
    MatIcon,
    MatNativeDateModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-movie.component.html',
  styleUrl: './add-movie.component.scss',
})
export class AddMovieComponent {
  movieForm!: FormGroup;
  genres = [
    'Action',
    'Adventure',
    'Animation',
    'Comedy',
    'Crime',
    'Documentary',
    'Drama',
    'Family',
    'Fantasy',
    'History',
    'Horror',
    'Music',
    'Mystery',
    'Romance',
    'Science Fiction',
    'TV Movie',
    'Thriller',
    'War',
    'Western',
  ];
  languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ru', name: 'Russian' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'other', name: 'Other' },
  ];
  statuses = [
    'Rumored',
    'Planned',
    'In Production',
    'Post Production',
    'Released',
    'Canceled',
  ];

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.createForm();
  }

  createForm() {
    this.movieForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      original_title: ['', Validators.maxLength(100)],
      tagline: ['', Validators.maxLength(200)],
      overview: ['', [Validators.required, Validators.maxLength(1000)]],
      release_date: ['', Validators.required],
      runtime: [
        '',
        [Validators.required, Validators.min(1), Validators.max(600)],
      ],
      genres: this.fb.array([], Validators.required),
      language: ['', Validators.required],
      production_companies: [''],
      production_countries: [''],
      status: ['', Validators.required],
      vote_average: ['', [Validators.min(0), Validators.max(10)]],
      vote_count: ['', Validators.min(0)],
      poster: [null, Validators.required],
      backdrop: [null],
      cast: [''],
      crew: [''],
      keywords: [''],
    });
  }

  onGenreChange(event: any, genre: string) {
    const genres = this.movieForm.get('genres') as FormArray;
    if (event.checked) {
      genres.push(new FormControl(genre));
    } else {
      const index = genres.controls.findIndex((x) => x.value === genre);
      genres.removeAt(index);
    }
  }

  onFileChange(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      this.movieForm.get(field)?.setValue(file);
    }
  }

  onSubmit() {
    if (this.movieForm.valid) {
      // Here you would typically send the form data to your backend
      console.log('Form submitted:', this.movieForm.value);
      this.snackBar.open('Movie uploaded successfully!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar'],
      });
    } else {
      this.movieForm.markAllAsTouched();
      this.snackBar.open(
        'Please fill all required fields correctly!',
        'Close',
        {
          duration: 3000,
          panelClass: ['error-snackbar'],
        }
      );
    }
  }

  get title() {
    return this.movieForm.get('title');
  }
  get overview() {
    return this.movieForm.get('overview');
  }
  get release_date() {
    return this.movieForm.get('release_date');
  }
  get runtime() {
    return this.movieForm.get('runtime');
  }
  get language() {
    return this.movieForm.get('language');
  }
  get status() {
    return this.movieForm.get('status');
  }
  get poster() {
    return this.movieForm.get('poster');
  }
  get vote_average() {
    return this.movieForm.get('vote_average');
  }
  get vote_count() {
    return this.movieForm.get('vote_count');
  }
}
