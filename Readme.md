# Forecast API

# Pre-requisites
- Install [Node.js](https://nodejs.org/en/) version >=16.18.0


# Getting started
- Clone the repository
```
git clone  https://github.com/correalm/node_api.git
```
- Install dependencies
```
cd node_api
npm install
```
- Build and run the project
```
npm start
```
  Navigate to `http://localhost:3000`

- API Document endpoints
  TODO



## Project Structure
The folder structure of this app is explained below:
TODO...

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **dist**                 | Contains the distributable (or output) from your TypeScript build.  |
| **node_modules**         | Contains all  npm dependencies                                                            |
| **src**                  | Contains  source code that will be compiled to the dist dir                               |
| **configuration**        | Application configuration including environment-specific configs 
| **src/controllers**      | Controllers define functions to serve various express routes. 
| **src/lib**              | Common libraries to be used across your app.  
| **src/middlewares**      | Express middlewares which process the incoming requests before handling them down to the routes
| **src/routes**           | Contain all express routes, separated by module/area of application                       
| **src/models**           | Models define schemas that will be used in storing and retrieving data from Application database  |
| **src/monitoring**      | Prometheus metrics |
| **src**/index.ts         | Entry point to express app                                                               |
| package.json             | Contains npm dependencies as well as [build scripts](#what-if-a-library-isnt-on-definitelytyped)   | tsconfig.json            | Config settings for compiling source code only written in TypeScript    
| tslint.json              | Config settings for TSLint code style checking                                                |

## Building the project
### Configuring TypeScript compilation
```json
{
    "compilerOptions": {
      "target": "es5",
      "module": "commonjs",
      "outDir": "dist",
      "sourceMap": true
    },
    
    "include": [
      "src/**/*.ts"
      

    ],
    "exclude": [
      "src/**/*.spec.ts",
      "test",
      "node_modules"
    
    ]
  }

```

### Running the build
All the different build steps are orchestrated via [npm scripts](https://docs.npmjs.com/misc/scripts).
Npm scripts basically allow us to call (and chain) terminal commands via npm.

| Npm Script | Description |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `start`                   | Runs full build and runs node on dist/index.js. Can be invoked with `npm start`                  |
| `build:copy`                   | copy the *.yaml file to dist/ folder      |
| `build:live`                   | Full build. Runs ALL build tasks       |
| `build:dev`                   | Full build. Runs ALL build tasks with all watch tasks        |
| `dev`                   | Runs full build before starting all watch tasks. Can be invoked with `npm dev`                                         |
| `test`                    | Runs build and run tests using mocha        |
| `lint`                    | Runs TSLint on project files       |

### Using the debugger in VS Code
Node.js debugging in VS Code is easy to setup and even easier to use. 
Press `F5` in VS Code, it looks for a top level `.vscode` folder with a `launch.json` file.

```json
{
        "version": "0.2.0",
        "configurations": [
            {
                "type": "node",
                "request": "launch",
                "name": "Launch Program",
                "program": "${workspaceFolder}/dist/index.js",
                "preLaunchTask": "tsc: build - tsconfig.json",
               
                "outFiles": [
                    "${workspaceFolder}/dist/*js"
                ]
            },
           
            {
                // Name of configuration; appears in the launch configuration drop down menu.
                "name": "Run mocha",
                "request":"launch",
                // Type of configuration. Possible values: "node", "mono".
                "type": "node",
                // Workspace relative or absolute path to the program.
                "program": "${workspaceRoot}/node_modules/mocha/bin/_mocha",
                
                // Automatically stop program after launch.
                "stopOnEntry": false,
                // Command line arguments passed to the program.
                "args": ["--no-timeouts", "--compilers", "ts:ts-node/register", "${workspaceRoot}/test/*"],
                
                // Workspace relative or absolute path to the working directory of the program being debugged. Default is the current workspace.
               
                // Workspace relative or absolute path to the runtime executable to be used. Default is the runtime executable on the PATH.
                "runtimeExecutable": null,
                // Environment variables passed to the program.
                "env": { "NODE_ENV": "test"}
            }
        ]
    }
```

## Testing
The tests are  written in Jest and supertest

```
"jest": "^29.5.0"
"supertest": "^6.3.3"
"ts-jest": "^29.0.5"

```

### Running tests using NPM Scripts
````
npm run test:unit
npm run test:functional

````
Functional tests to be in src/test.

# TSLint
TSLint is a code linter that helps catch minor code quality and style issues.

## ESLint rules
All rules are configured through `.eslintrc`.


## Running ESLint
To run ESLint you can call the main build script or just the ESLint task.
```
npm run lint   // runs lint to all files
npm run lint:fix  // runs lint to all files with --fix command
```
