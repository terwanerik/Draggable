# Draggable
[![License](http://img.shields.io/:license-mit-blue.svg)](https://github.com/terwanerik/Draggable/blob/master/LICENSE)
[![Issues](https://img.shields.io/github/issues/terwanerik/Draggable.svg)](https://github.com/terwanerik/Draggable/issues)
[![GitHub release](https://img.shields.io/github/release/terwanerik/Draggable.svg?maxAge=2592000)](https://github.com/terwanerik/Draggable/releases)
[![Bower](https://img.shields.io/bower/v/draggable-elements.svg?maxAge=2592000)](https://github.com/terwanerik/Draggable/)
[![npm version](https://badge.fury.io/js/draggable-elements.svg)](https://www.npmjs.com/package/draggable-elements)
[![Package Quality](http://npm.packagequality.com/shield/draggable-elements.svg)](http://packagequality.com/#?package=draggable-elements)

Using the HTML5 draggable api should not be difficult. This makes it simple to swap elements by dragging.

## How to use?
It's quite simple, just add the `draggable.min.js` file to your HTML page. Then construct a new Draggable instance when the page has loaded. Like so:

```html
<script src="draggable.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function(){
	var elements = document.querySelectorAll('[data-drag]');
	var draggable = new Draggable(elements);
});
</script>
```

The construct can take a set of (or a single) HTMLElements, they will be draggable on init. You can also add HTMLElements with the `.add()` method, or clear all draggables by calling the `.clear()` method. Check out the example for a use case.

### HTML
If a `data-drag` attribute is added to the html element you can specify certain groups that the element should be swappable with. Aka setting `data-drag='group1'` on a couple of elements, and `data-drag='group2'` to some other elements, you'll be only able to drag elements with `group1` on other elements with `group1`.

## Contributing
Fork, check out `Draggable.js` and enjoy! If you have improvements, start a new branch & create a pull request when you're all done :)

#### Found an issue?
Ooh snap, well, bugs happen. Please create a new issue and mention the OS and browser (including version) that the issue is occurring on. If you are really kind, make a [minimal, complete and verifiable example](http://stackoverflow.com/help/mcve) and upload that to [codepen](http://codepen.io).