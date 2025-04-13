# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Docker Setup

This project includes Docker configuration for easy deployment and consistency across environments.

### Prerequisites

- Docker
- Docker Compose (optional, but recommended)

### Building and Running with Docker

#### Using Docker Compose (Recommended)

1. Build and start the container:
   ```bash
   docker-compose up -d
   ```

2. Access the application at http://localhost

3. To stop the container:
   ```bash
   docker-compose down
   ```

#### Using Docker Directly

1. Build the Docker image:
   ```bash
   docker build -t bbs-forum-frontend .
   ```

2. Run the container:
   ```bash
   docker run -p 80:80 -d bbs-forum-frontend
   ```

3. Access the application at http://localhost

4. To stop the container:
   ```bash
   docker stop $(docker ps -q --filter ancestor=bbs-forum-frontend)
   ```

### Docker Configuration

- `Dockerfile`: Multi-stage build that compiles the Angular application and serves it using Nginx
- `nginx.conf`: Nginx configuration optimized for serving Angular applications
- `.dockerignore`: Excludes unnecessary files from the Docker build context
- `docker-compose.yml`: Simplifies running the application with Docker
