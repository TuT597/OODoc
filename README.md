# OODoc - Documentation visualizer
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

OODoc is a documentation system for the Perl programming language, which
extends the standard `perldoc` system with object oriented features.
[OODoc github page](https://github.com/markov2/perl5-OODoc/).

OODoc merges the documentation from multiple Perl distributions
together into one coherent structure. The manual pages will also be
visible in the usual Perl way: as locally installed manuals and via
[MetaCPAN](https://metacpan.org). However, OODoc also produces a much
improved HTML output: with far more useful links.

Some examples:

- small: [OODoc itself](https://perl.overmeer.net/oodoc/html3/).
- modest: [Log::Report](https://perl.overmeer.net/log-report/html1/).
- huge: [Mail::Box](https://perl.overmeer.net/mail-box/html4/).

## Overview

OODoc can produce good HTML, but the output uses static templates and
the design dates from 2004. This GitHUB project is a new coat of paint.

This website app uses the documentation export which can be produced
by the `oodist` script of OODoc, and plays that dynamically via a
single page, client-side generated, interface.

The data is collected via

```bash
cd My-Perl-Package
oodist --exports
```

(Of course, your package must be configured to use oodist and OODoc markup)
This will result in a `json` file with the documentation tree.

## Usage

To use this app for your OODoc generated documentation tree:

1. get all files from this repo (`git clone git@github.com:TuT597/OODoc.git`)
2. Inside of `index.html` replace the target link in the config div with your own .json file. This can be a local file or any valid URL (HTTP or HTTPS).
3. Finally you host `index.html` as a website, or you can rename it and link to it on your own website. Everything should then automatically generate.

## Customization

As this is a first release, there is little individual use-case customization. However, this is planned in the future.

You can however relatively easily change or add your own main navigation buttons like Introduction, Methods, etc. in the following way:

1. First rename or create a span element inside of the index `navList` element.
2. Give it the `mainSelection` class and add text. Make sure this is only one word as I have not yet added support for white-space.
3. Create a new file in the scripts folder with the naming convention `generate...Page.js`(camel-case).
4. Add this script to the `.html` file.
5. Assuming you correctly named everything this newly created button on the webpage will automatically call the new script file when clicked.
6. As i have not yet added dynamic style support for customization like this expect to fiddle with some css selectors to make it look nice.

## How this project came to be

As a recent graduate and unfortunate victim of the current entry function
draught, I was sitting at home with nothing to do for a long time. My
recently acquired knowledge and skills were quickly fading away,

So, I went to [Mark](https://github.com/markov2) to see if he was
willing to teach me a thing or two, or had anything I could work on.
Luckily he was in need of a modernized version of his documentation
parser. Together we worked on this project with him making an updated
parser and me a front-end framework to plug it's output into.

As this was my first project in a while, I just started working to see
where I would end-up and face challenges as they came. This is the result
of that endaevor.

-Tuyan Tatliparmak [linkedIn](https://www.linkedin.com/in/tuyan-tatliparmak-7545a6267/)

## Copyright and License

This project is licensed under the [GNU General Public License v3.0](LICENSE) - see the [LICENSE](LICENSE) file for details.

