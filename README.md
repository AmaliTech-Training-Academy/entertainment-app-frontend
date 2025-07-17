# CineVerse Entertainment App Frontend

This is the frontend repository for the CineVerse App, built with Angular 19 using standalone components and SCSS styling.

## Live Demo

The app is deployed and accessible at: [https://d101mapcha7bof.cloudfront.net/](https://d101mapcha7bof.cloudfront.net/)

---

## Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Sample Data](#sample-data)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- Modern Angular 19 app with standalone components
- Responsive UI with Angular Material and SCSS
- Movie browsing, advanced search, recommendations, and reviews
- Admin dashboard and user management
- Sample data for comments, reviews, cast, and screenshots

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)

### Installation
```bash
cd frontend
npm install
```

### Running Locally
```bash
npm start
# or
ng serve
```
Visit [http://localhost:4200](http://localhost:4200) in your browser.

### Building for Production
```bash
npm run build
```
The build output will be in `dist/entertainment-app-frontend/`.

## Available Scripts
- `npm start` / `ng serve` — Run the app in development mode
- `npm run build` — Build the app for production
- `npm test` — Run unit tests

## Project Structure
- `src/app/` — Main application code (components, features, pages, shared modules)
- `src/assets/` — Static assets (images, icons)
- `public/` — Sample data (JSON files for comments, reviews, cast, screenshots)
- `src/environments/` — Environment configs (dev, prod, staging)

## Sample Data
Sample JSON files are provided in the `public/` directory for development and testing:
- `comments.json` — User comments
- `reviews.json` — Movie reviews
- `top-cast.json` — Cast information
- `screenshots.json` — Screenshot URLs

## Tech Stack
- [Angular 19](https://angular.io/)
- [Angular Material](https://material.angular.io/)
- [SCSS](https://sass-lang.com/)
- [RxJS](https://rxjs.dev/)

## Deployment
The app is deployed to AWS CloudFront:
- [https://d101mapcha7bof.cloudfront.net/](https://d101mapcha7bof.cloudfront.net/)

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](../LICENSE) 