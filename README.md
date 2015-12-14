# Web pages builder based on gulp and browserify

To create a new page, create a new folder `myNewView` within the `views` folder.

Then, configure your page with the `conf.json` file :
```json
{
  "title": "Main View",
  "description": "Main page description",
  "script": {
    "main": "main.js",
    "static": [
      "views/_common/common.js"
    ]
  },
  "style": {
    "main": "main.scss",
    "static": [
      "views/_common/styles/normalize.min.css",
      "views/_common/styles/simplegrid.css"
    ]
  },
  "build": {
    "minifyHtml": true,
    "minifyJs": true
  }
}
```

- `title` : the page title
- `description` : the page description
- `script` -> `main` : the main javascript file
- `script` -> `static` : the static javascript files to include
- `style` -> `main` : the main sass file
- `style` -> `static` : the static css files to include
- `build` : build configuration object (not required)
- `build` -> `minifyHtml` : set to true to enable html minification
- `build` -> `minifyJs` : set to true to enable javascript minification

Then, run your page in the browser using :
`gulp serve --view myNewView`

To build all your pages, run :
`gulp build`

Your pages will be generated in the `build` folder.

You can find examples in the `views` folder project.
