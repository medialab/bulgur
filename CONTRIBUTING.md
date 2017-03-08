## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for Bulgur. Following these guidelines helps maintainers and the community understand your report :pencil:, reproduce the behavior :computer: :computer:, and find related reports :mag_right:.

#### How Do I Submit A (Good) Bug Report?

Bugs are tracked as [GitHub issues](https://guides.github.com/features/issues/). After you've [searched](https://github.com/medialab/bulgur/issues) if your bug is not dealt with in an existing issue of the project, create an issue on that repository.

Explain the problem and include additional details to help maintainers reproduce the problem:

* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps which reproduce the problem** in as many details as possible. When listing steps, **don't just say what you did, but explain how you did it**. For example, if you moved the cursor to the end of a line, explain if you used the mouse, or a keyboard shortcut.
* **Provide specific examples to demonstrate the steps**. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples. If you're providing snippets in the issue, use [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
* **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
* **Explain which behavior you expected to see instead and why.**
* **Include screenshots and animated GIFs** which show you following the described steps and clearly demonstrate the problem. You can use [this tool](http://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for Bulgur, including completely new features and minor improvements to existing functionality. Following these guidelines helps maintainers and the community understand your suggestion :pencil: and find related suggestions :mag_right:.

Before creating enhancement suggestions, please check in the issues section if there's already an issue addressing this enhancement as you might find out that you don't need to create one. When you are creating an enhancement suggestion, please [include as many details as possible](#how-do-i-submit-a-good-enhancement-suggestion).

#### How Do I Submit A (Good) Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://guides.github.com/features/issues/). Create an issue on that repository and provide the following information:

* **Use a clear and descriptive title** for the issue to identify the suggestion.
* **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
* **Provide specific examples to demonstrate the steps**. Include copy/pasteable snippets which you use in those examples, as [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
* **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
* **Include screenshots and animated GIFs** which help you demonstrate the steps or point out the part of Bulgur which the suggestion is related to. You can use [this tool](http://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux.
* **Explain why this enhancement would be useful** to most Bulgur users.

# Contributing to the code : guidelines & information

## Precommit hook

Bulgur uses a precommit hook that verifies that linting is alright, that the application still builds successfuly and other good things to check before committing. Precommit tests are automatic.

## Unit tests

Please provide relevant unit tests with any new feature proposal. Unit test scripts must be suffixed with `.spec.js` to be handled by the test script.

## JS guidelines / linting

Bulgur uses `eslint` along with a specific config for coding style adopted for the project. Be sure to run `npm run lint` to correct small errors and see what needs to be modified for having a correctly written contribution.

## SCSS guidelines

Each new component *must* be provided with a specific scss file describing this component's styling. All selectors must be namespaced with the class of the root element of the component (which *must* be namespaced with the name of the application, e.g. `bulgur-color-picker`) ; do not forget to use [sass nesting feature](http://sass-lang.com/guide/#topic-3) for a well structured code.

### Code organization

Then, all components' scss *may* be structured in the same following way :

1. first put the root component layout generalities
2. then the global displaying style (backgrounds, font sizes)
3. then the selectors for the components reused along the component
4. then, using sass nesting, the specifics of primary, secondary and detail styling for elements within the app

Example :

```
.bulgur-my-component-class
{
    /*
     * root component layout styling
     */
     /*
     * root component display styling
     */
     font-size: $font-size-1;
    /*
     * specific re-used micro-components
     */
    .my-specific-input
    {

    }
    /*
     * primary layout components
     */
    .my-div-wrapper
    {
         display: flex;
        /*
         * secondary layout components
         */
        .my-div-container
        {

        }
    }
}
```

### Parametric design

Please use, as much as possible, the scss parameters set in the `./src/parameters.scss` file. They are supposed to keep the project easily configurable in terms of UI/graphic design.



