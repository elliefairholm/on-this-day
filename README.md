# MagicMirror² Module: On-This-Day

`on-this-day` is a module for [MagicMirror²](https://magicmirror.builders/) that displays a random fact of something that happened on this day in history.

This module is based on a personal API that is yet to be published.
The facts are only available in English but are translated according to the language preference of your Magic Mirror.
The fact is updated everyday at midnight.

## Installation

Remote to your MM2-box with your terminal software and go to your MagicMirror's Module folder:
````
cd ~/MagicMirror/modules
````

Clone this repository:
````
git clone https://github.com/elliefairholm/on-this-day.git
````

Go to the modules folder:
````
cd on-this-day
````

Install the dependencies:
````
npm install
````

Add the module to the modules array in the `config/config.js` file by adding the following section. You can change this configuration later when you see this works:
```
{
    module: 'on-this-day',
    position: 'bottom_center',
    config: {
                // See below for configurable options
            }
},
```