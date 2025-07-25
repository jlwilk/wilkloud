# .

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### WebOs

Make sure your are connected to your tv

```sh
ares-setup-device --list
```

```sh
pnpm run build
```

Copy icon.png into the dist folder.

Copy the appingo.json into the dist folder.

You'll need to fix the index.html:


```sh
Remove <link href="/src/style.css" rel="stylesheet">
```
```sh
Remove the forward slashes before all of the paths.
```
```sh
ares-package dist/
```
```sh
 ares-install --device TV .\com.wilkloud.playarr_1.0.0_all.ipk
```
You can launch the app from the terminal too
```sh
ares-launch com.wilkloud.playarr
```