# Wordpress Theme Development with Gulp

## What's inside

1. BrowserSync - Sync file changes and interactions across many devices.
2. Babel - convert ECMAScript 2015+ code into a backwards compatible version of JavaScript in current and older browsers or environments.
3. Sass - Convert Sass/Scss files to css with sourcemaps and compress files using cssnano for modern compression.
4. Autoprefixer - No need to add vendor prefixers, Autoprefixer does that for you(Autoprefixer will use the data based on current browser popularity and property support to apply prefixes for you.)
5. Compressor/Optimizer - Optimize and compress images(Jpeg, pngs, gifs, svg).
6. vinyl-ftp - Automatically upload file(s) to ftp.
7. Semi 7-1 architecture
8. Uglify - Minify js code.

## Installation

1. Clone my git repo

```bash
> git clone https://github.com/renzpulvira/wordpress-dev-with-gulp.git
```

2. Install packages using npm

```bash
> npm install
```

3. Initialize gulp

```
> gulp
```

## Usage

### Default file structure

```bash
.
├── gulpfile.js
├── gulp-js // All js files
│   └── script.js
├── gulp-scss // All Scss files
│   ├── base
│   │   ├── _base.scss
│   │   └── _mixins.scss
│   ├── components
│   │   ├── _banner.scss
│   │   └── _buttons.scss
│   ├── layout
│   │   ├── _footer.scss
│   │   └── _header.scss
│   ├── main.scss
│   ├── pages
│   │   └── _home.scss
│   └── style-main.scss
├── package.json
```

### Configuration

Configure the ftpConfig object to your own configuration.

```javascript
const ftpConfig = {
  host: "myHost",
  user: "myUsername",
  pass: "myPassword",
  remoteFolder: "/wp-content/themes/sampleTheme"
};
```

Configure the globs array to match your project workspace.

- `!` point means exclude/ignore this file/folder. read more about globs [here](https://gulpjs.com/docs/en/getting-started/explaining-globs)

```javascript
var globs = [
  "assets/**",
  "gulp-js/**",
  "gulp-scss/**",
  "inc/**",
  "js/**",
  "languages/**",
  "template-parts/**",
  "*",
  "!/gulpfile.js",
  "!node_modules/**"
];
```

### Available Tasks

- To run most of the tasks

```bash
> gulp
```

- To optimize images

```bash
> gulp optimize
```

## FAQ

- gulp not found error
  follow the front page of [gulpjs](https://gulpjs.com/)
