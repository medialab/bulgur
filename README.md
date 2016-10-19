WIP app for testing the possible implementations of quinoa framework.

App structure (src) :

```
- main.js // react/redux entrypoint
- main.scss // scss entrypoint
- rootReducer.js // the main reducer of the app
- Application.js // the main application component
- Application.scss // the main application component style
+ components // shared components
+ models // series of models used throughout the app
+ features // separate features of the app
    + ExampleFeature // example of how features are structured
        + components // feature-specific components
        - duck.js // see https://github.com/erikras/ducks-modular-redux
        - image.png // related ui images are inside feature modules
        - style.scss // related styles are inside features folders
    + NewStoryDialog // a feature for creating the basis of a new story from an existing data file
    + DataToVisMapper // mapping data properties to visualisation invariant properties
    + InterfaceManager // manages modals opening and closing, pannels
    + ...
+ lib // temporary dependencies
+ redux // redux logic
    - configureStore.js // store setup
    - promiseMiddleware.js // reducer that processes promises in action handling process
    - rootReducer.js // app's main reducer
+ helpers // modules not related directly to the app logic
    - ...
```

