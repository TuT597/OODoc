# OODoc - Documentation visualizer
[OODoc github page](https://github.com/markov2/perl5-OODoc/).

## Overview
A new coat of paint for the [OODoc perl module](https://perl.overmeer.net/oodoc/html/index.html).

This app takes parsed output generated with OODoc and uses it to generate a modern one-page documentation website.
It does this by crawling through the output and generating HTML content from it.

## Usage
To use this app yourself:
1. Pull the required files (The index, stylesheet and scripts folder).
2. You then replace the fetch target at the top of `main.js` with your own generated OODoc output.
3. Finally you simply host `index.html` as a website, or you can rename it and add it to your own website. Everything should then automatically fall into place.

## Customization
As this is a first release there is not much in the form of individual use-case customization, however it is planned in the future.
  
You can however relatively easily change or add your own main navigation buttons like Introduction, Methods, etc. in the following way:
1. First rename or create a span element inside of the index `navList` element.
2. Give it the `mainSelection` class and add text. Make sure this is only one word as I have not yet added support for white-space.
3. Create a new file in the scripts folder with the naming convention `generate...Page.js`(camel-case).
4. Add this script to the .html file.
5. Assuming you correctly named everything this newly created button on the webpage will automatically call the new script file when clicked.
6. As i have not yet added dynamic style support for customization like this expect to fiddle with some css selectors to make it look nice.

## How this project came to be
As a recent graduate and unfortunate victim of the current entry function apocalypse, i was sitting at home with nothing to do for a long time. My recently acquired knowledge and skills were quickly fading away,
so i went to [Mark](https://github.com/markov2). To see if he was willing to teach me a thing or two, or had anything i could work on.  
Luckily he was in need of a modernized version of his documentation parser. Together we worked on this project with him making an updated parser and me a front-end framework to plug it into.

As this was my first project in a while i just started working to see where i would end-up and face challenges as they came. This is the result of that endaevor. 
