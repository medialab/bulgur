Hi.

App structure :

```
- main.js // react/redux entrypoint
- main.scss // scss entrypoint
- rootReducer.js // the main reducer of the app
- Application.js // the main application component
- index.html // html entrypoint
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
+ helpers // modules not related directly to the app logic
    - validateFileFormat.js // consume vistype model against file extension
    - guessFieldType.js // guess whether a field is composed of dates, strings, numbers, ...
```

