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
  }
}
```

- `title` : the page title
- `description` : the page description
- `script` : script configuration object
    - `main` : the main javascript file
    - `static` : the static javascript files to include
- `style` : style configuration object
    - `main` : the main style file
    - `static` : the static css files to include

You can set a default configuration for all pages with the `default.conf.json` file :
```json

{
  "build": {
    "minifyHtml": true,
    "minifyJs": true,
    "destination": "dist"
  },
  "platform": [
    {
      "os": "ios",
      "files": ["./views/_ios/ios.js", "./views/_ios/ios.css"],
      "destination": "ios"
    }
  ]
}
```

- `build` : build configuration object (not required)
    - `minifyHtml` : set to true to enable html minification
    - `minifyJs` : set to true to enable javascript minification
- `platform` : platform configuration array (not required)
    - `os` : os targeted
    - `files` : files to include for this os
    - `destination` : the destination folder for generated pages

Then, run your page in the browser using :
`gulp serve --view myNewView`

To build all your pages, run :
`gulp build` or `gulp build --os ios` for a specific platform.

Your pages will be generated in the `build.destination` folder (or `platform.destination` folder for specific platform).
