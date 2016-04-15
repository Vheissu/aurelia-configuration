### 1.0.7 (2016-04-15)


#### Bug Fixes

* **all:**
  * rely on path for loading config files to allow overrides and use path helper ([608d1476](http://github.com/Vheissu/Aurelia-Configuration/commit/608d147664babba85753bc8e6844e500129a3f58))
  * instantiate class properties from within constructor ([798e4104](http://github.com/Vheissu/Aurelia-Configuration/commit/798e41047c18882588b753905e258b7d4c3d781d))
  * changed build process to generate TypeScript definition files and more. ([f4db5f9e](http://github.com/Vheissu/Aurelia-Configuration/commit/f4db5f9efbfb75dc0c5614d9429fa67b4162342c))
  * removing core-js dependency ([ccb31f76](http://github.com/Vheissu/Aurelia-Configuration/commit/ccb31f760cafffb9b177878f68fb90e975c66e7e))
* **build:** Build src for update to environment selectors ([4388dac6](http://github.com/Vheissu/Aurelia-Configuration/commit/4388dac6c4e6aefe12ff4edab04fbdee414f1845))
* **configure:**
  * remove weakmaps so we can have a polyfill free class ([346faf92](http://github.com/Vheissu/Aurelia-Configuration/commit/346faf92147cedd0d23634c8769283a4b8036d14))
  * parse data response as JSON ([e2a9a834](http://github.com/Vheissu/Aurelia-Configuration/commit/e2a9a834bee38099f83368b199ecfd0413209344))
* **dependencies:**
  * updating and fixing out-of-date dependencies ([75583c6d](http://github.com/Vheissu/Aurelia-Configuration/commit/75583c6d6e2257611e355757a5dd8bc6c7170959))
  * updating Aurelia dependencies again and fixing config.js file ([b5a33032](http://github.com/Vheissu/Aurelia-Configuration/commit/b5a33032b0b8732e2feb0fa787453e7e4bb4e7e6))
  * updating dependencies to beta versions for Aurelia and other dev deps ([5dd4eda0](http://github.com/Vheissu/Aurelia-Configuration/commit/5dd4eda009a64495a2ea33dede4f3ccd912ba4c7))
* **environment-selection:** Update environment selection ([ac2c5c33](http://github.com/Vheissu/Aurelia-Configuration/commit/ac2c5c332b0c0c676fc3667390447eb8b00643d2))
* **jspm:** dependency was removed from Jspm section when Webpack fixes were applied. ([2a785d3d](http://github.com/Vheissu/Aurelia-Configuration/commit/2a785d3dbfd4163a1b5b38b795bba1b6d86e693f))
* **npm:** update npm main ([694cf6f0](http://github.com/Vheissu/Aurelia-Configuration/commit/694cf6f004b25a41452ba98b58c7284c06dfeeef))
* **package:** change JSPM registry format to Github ([4e54b748](http://github.com/Vheissu/Aurelia-Configuration/commit/4e54b748a93c9619d8bd76b9c885c3a87d332dad))
* **syntax:** simplifying ternary and removing redundant assignments. ([caaf7d56](http://github.com/Vheissu/Aurelia-Configuration/commit/caaf7d564926a75714bec6c83c73d1200869a6d9))
* **tasks:** remove linting from prepare release task ([75356786](http://github.com/Vheissu/Aurelia-Configuration/commit/75356786a3801cb44ec3728af9fe56d3a2164bdd))


#### Features

* **configure:** use the Aurelia loader dependency to load configuration files instead of HTTP ([2b9a8144](http://github.com/Vheissu/Aurelia-Configuration/commit/2b9a81449f22f5a04b554ef61584fca42fbd44f7))


### 1.0.4 (2016-03-03)


#### Bug Fixes

* **all:**
  * rely on path for loading config files to allow overrides and use path helper ([608d1476](http://github.com/Vheissu/Aurelia-Configuration/commit/608d147664babba85753bc8e6844e500129a3f58))
  * instantiate class properties from within constructor ([798e4104](http://github.com/Vheissu/Aurelia-Configuration/commit/798e41047c18882588b753905e258b7d4c3d781d))
  * changed build process to generate TypeScript definition files and more. ([f4db5f9e](http://github.com/Vheissu/Aurelia-Configuration/commit/f4db5f9efbfb75dc0c5614d9429fa67b4162342c))
  * removing core-js dependency ([ccb31f76](http://github.com/Vheissu/Aurelia-Configuration/commit/ccb31f760cafffb9b177878f68fb90e975c66e7e))
* **configure:**
  * remove weakmaps so we can have a polyfill free class ([346faf92](http://github.com/Vheissu/Aurelia-Configuration/commit/346faf92147cedd0d23634c8769283a4b8036d14))
  * parse data response as JSON ([e2a9a834](http://github.com/Vheissu/Aurelia-Configuration/commit/e2a9a834bee38099f83368b199ecfd0413209344))
* **dependencies:**
  * updating and fixing out-of-date dependencies ([75583c6d](http://github.com/Vheissu/Aurelia-Configuration/commit/75583c6d6e2257611e355757a5dd8bc6c7170959))
  * updating Aurelia dependencies again and fixing config.js file ([b5a33032](http://github.com/Vheissu/Aurelia-Configuration/commit/b5a33032b0b8732e2feb0fa787453e7e4bb4e7e6))
  * updating dependencies to beta versions for Aurelia and other dev deps ([5dd4eda0](http://github.com/Vheissu/Aurelia-Configuration/commit/5dd4eda009a64495a2ea33dede4f3ccd912ba4c7))
* **package:** change JSPM registry format to Github ([4e54b748](http://github.com/Vheissu/Aurelia-Configuration/commit/4e54b748a93c9619d8bd76b9c885c3a87d332dad))


#### Features

* **configure:** use the Aurelia loader dependency to load configuration files instead of HTTP ([2b9a8144](http://github.com/Vheissu/Aurelia-Configuration/commit/2b9a81449f22f5a04b554ef61584fca42fbd44f7))


### 1.0.3 (04-09-2015)
* Added in new setEnvironments method for dynamic environments
* New is method for checking the current environment
* Better documentation
* Minor bugfixes and improvements

### 1.0.2 (03-09-2015)
* A tonne of bug fixes...
* Get config method now has support for default values
* Cascading configuration support
* Configurable during bootstrap phase
* Improvements to JSON config file loading
* Documentation (methods and usage examples)

### 0.1.0 (02-09-2015)
Initial commit and changes of the configuration plugin.
