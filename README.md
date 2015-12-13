# build-pages

**Multi web pages builder based on gulp and browserify.**

To create a new page, create a new folder `myNewView` within the `views` folder.

Then, configure your page with the `conf.json` file :
```json
{
  "title": "Main View",
  "description": "Main page description",
  "script": {
    "main": "main.js"
  },
  "style": {
    "main": "main.scss"
  }
}
```

- `title` : the page title
- `description` : the page description
- `script` -> `main` : the main javascript file
- `style` -> `main` : the main style file

Then, run your page in the browser using :
`gulp serve --view myNewView`

To build all your pages, run :
`gulp build`

Your pages will be generated in the `build` folder.
