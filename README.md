# sketch-plugins

Plugins for Bohemian Coding Sketch

## Export Selection as Objc view

This plugin takes the current selection and exports an Objective-C view from it. It creates shape layers to represent the same graphics as in Sketch. Also supports animations.

### What works

- Opacity
- First solid color fill
- First border solid color
- First drop shadow (Except spread)
- Shapes
- Animate shape, fill color, layer opacity, shadow color, shadow blur radius, shadow position, border width, border color

### Limitations

- When animating, the layer is not scaled to the view size (in works)
- Gradients are not working (Might in the future)
- Doesn't animate layer position
- All layer names must be unique

## Duplicate to All Artboards

This plugin takes the selected layers and makes a copy for each artboard in the page, scaling them in the process:

![Duplicate to artboards example video](https://github.com/buscarini/sketch-plugins/raw/master/images/duplicateToArtboards.gif)

<!---
[![Alt text for your video](http://img.youtube.com/vi/spAv6a0kPsc/0.jpg)](http://youtu.be/spAv6a0kPsc)
-->

The selected layers have to be inside an artboard.

## Golden Ratio

Make a bigger or smaller copy of the selection using the golden ratio. Here's an example of using it to recreate the iCloud icon (I know it's not correct, it's just a quick example):

![Golden Ratio collection example video](https://github.com/buscarini/sketch-plugins/raw/master/images/gr_collection.gif)

## Installation

1. [Download the ZIP file with the plugin](https://github.com/buscarini/sketch-plugins/archive/master.zip)
2. Copy the contents of the ZIP to the Plugins Folder (You can get access to that folder by opening the Plugins menu, choosing `Custom Script...` and then clicking in the gear icon and choosing `Open Plugins Folder`). You don't need to copy the `images` folder, the `README.md` nor the `LICENSE` files.

How-to
------

Select 1 or more layers inside an artboard, then open the Plugins menu and choose 'Duplicate to All Artboards'
