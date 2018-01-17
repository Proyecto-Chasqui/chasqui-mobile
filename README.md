# Chasqui mobile

Frontend móvil para Chasqui

### Documentacion
- [Ionic Material API & Demo](http://ionicmaterial.com/demo/) 
(Usar el ☰ menu para ver las secciones de documentación)

- [Ionicons](http://ionicons.com/)

- [Ionic Documentation](http://ionicframework.com/docs/) 


# Entorno de desarrollo
**Nota:** Orientado a Android. Para plataformas iOS/Windows, seguir las guías oficiales.
### Instalar Ionic Framework, basado en el [Getting Started](http://ionicframework.com/getting-started/) 

Install Node.js
```shell
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
```
Install the latest Cordova and Ionic [(Más información)](https://www.npmjs.com/package/ionic)
```shell
sudo npm install -g cordova ionic
```

### Android Platform Guide [(Más información)](http://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html)
#### Install the Android SDK -> [Descargar](https://developer.android.com/studio/index.html):

* Unpack the downloaded ZIP file into an appropriate location for your applications.
* To launch Android Studio, navigate to the android-studio/bin/ directory in a terminal and execute studio.sh
* After execute studio.sh, choose “Standard Installation” and continue the wizard. 

You may want to add android-studio/bin/ to your PATH environmental variable so that you can start Android Studio from any directory.
```shell
sudo apt-get install lib32z1 lib32ncurses5 lib32bz2-1.0 lib32stdc++6
```

#### Para 64-bit Ubuntu
¿How to solve “Unable to run mksdcard SDK tool” when installing Android Studio?:

If you are running the 64-bit Ubuntu, the following fix should solve your problem:

```shell
sudo apt-get install lib32z1 lib32ncurses5 lib32bz2-1.0 lib32stdc++6
```

**using Sass?** instructions for [raibutera/robotodraft](https://github.com/raibutera/robotodraft) + scss:

```scss
$RobotoDraftFontPath: "../fonts"; // REMINDER: edit as appropriate!
$RobotoDraftFontName: "RobotoDraft";
$RobotoDraftFontVersion: "1.0.0";

@import "/PATH/TO/YOUR/PROJECT/bower_components/robotodraft/sass/robotodraft.scss";    // REMINDER: edit as appropriate!
```
**NB**: the above assumes you are using [Bower](http://bower.io)

### Step 3: Add Ionic Material stylesheets and scripts
Add `ionic.material.min.css` and `ionic.material.min.js` to your `index.html`

```html 
    <link href="lib/ionic/css/ionic.css" rel="stylesheet">
    <link href="lib/ionic-material/dist/ionic.material.min.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">

    <script src="lib/ionic/js/ionic.bundle.js"></script>
    <script src="lib/ionic-material/dist/ionic.material.min.js"></script>
```

### Step 4: Inject Ionic & Ionic Material into your Ionic App 

```javascript
    var app = angular.module('YOUR_APP_NAME', ['ionic', 'ionic-material']);
```

### Step 5: Where appropriate, inject *ionicMaterialInk* and/or *ionicMaterialMotion*

The angular services `ionicMaterialInk` and `ionicMaterialMotion` are used to activate animations.

**You are all set to go!** :thumbsup:

### Activating Animations

**NB:** Make sure the relevant services are injected into your controllers.

In your controllers: 
- `ionicMaterialInk.displayEffect()` (will need to happen once on controller activation and then repeat every time the objects update)
- `ionicMaterialMotion.ripple()` (etc.)

## Sample App
Ionic demo app "Thronester" is found within './demo' - You can also run 'index.html' locally to view in a webkit browser on a computer.

## Builds
Instructions:
- `npm install`
- `gulp build` (or `gulp style` for just the stylesheets)

Look at `gulpfile.js` for how the process works.

## Development 
This project uses [Webpack](http://webpack.github.io/)

## Website
[http://ionicmaterial.com/](http://ionicmaterial.com/)

## FAQ [en desarrollo]
### What is Ionic Material?
Ionic material is aimed at being an extension library for the Ionic Framework, meaning you won't change the way you develop your Ionic hybrid apps to have them materialized. Ionic Material aims to integrate the best representations of Material Design into a single add-on library for Ionic Developers. With the Polymer Project, ngMaterial, and other open source projects arising, we aim to be actively engaged and aligned with these, and other, related projects.

As a 100% free open-source project, **developer participation is encouraged**, as much or little as possible.

### Can I use Ionic and Angular Material together?
*Ionic* and *Angular Material* are fairly incompatible (you can add them to the same project, but the styling will be extremely inconsistent and none of the UI components will work cross-framework, eg. an ionic side menu with material tabs). Ionic is 1.0 and angular material is still pre-1.0. 

**Ionic Material** is best explained as a "material extension" to Ionic, rather than to Angular as a whole. The difference isn't just semantics - Ionic Material extends the actual ionic framework namespace (in JS), renders material styles on the ionic elements (following ionic's conventions), and will aim to follow the releases of Ionic, and support material theming, ink, and motion for any new Ionic release.

Ionic Material will pull in the best ideas of Angular Material, Paper/Polymer, etc. and by the same tune, Ionic Material will also abstract the parts of the framework that would be beneficial outside of ionic apps (like animations, motions) into their standalone git projects so they can be adopted for use in -any- web project that uses material design.
