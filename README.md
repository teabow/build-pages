# build-pages

**Multi web pages builder based on gulp and browserify.**

To create a new page, create a new folder `myNewView` within the `views` folder.

It's important to implement the following files :
- `main.js` (main javascript file)
- `main.scss` (main css styles file)
- `main.html` (main html template)

Then, run your page in the browser using :
`gulp serve --view myNewView`

To build all your pages, run :
`gulp build`

Your pages will be generated in the `build` folder.
