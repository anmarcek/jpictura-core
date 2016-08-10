# jPictura Core

:warning: **This package is intended for internal usage by other jPictura libraries only. You should not mention this in your dependencies/devDependencies.**

jPictura Core is the mathematical/algorithmic core for responsive alignment of images. It is silently used by the
following UI specific JavaScript libraries:

* [jpictura](https://github.com/anmarcek/jpictura) (jQuery)
* angular-jpictura (AngularJS 1) - Coming soon
* angular2-jpictura (Angular 2) - Coming soon

**It is NOT required to include this package together with the mentioned libraries as it is used by those libraries internally. You will need to use this package ONLY if you are developing another jPictura library. In such case, list this package within devDependencies and make sure that jpictura-core is built into your package.**