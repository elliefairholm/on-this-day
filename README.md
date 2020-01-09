# on-this-day

Module to get a random fact of what happened on this day in history.

This module is based on a personal API that is yet to be published.
The facts are only available in English but are translated according to the language preference of your Magic Mirror.
The fact is updated everyday at midnight.

![quote-of-the-day_english](images/quote-of-the-day_english_example.png)

## Installation

Clone this repo into `~/MagicMirror/modules` directory. Then move in the folder and install required libraries:

```
cd on-this-day
npm install
```

Configure your `~/MagicMirror/config/config.js`:

```js
{
    module: "on-this-day",
    position: "lower_third"
}
```
