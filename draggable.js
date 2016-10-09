/**
 * Written by Erik Terwan on 06/10/16.
 *
 * Erik Terwan - development + design
 * https://erikterwan.com
 * https://github.com/terwanerik
 *
 * MIT license.
 */

(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	} else if (typeof module === 'object' && module.exports) {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory();
	} else {
		// Browser globals (root is window)
		root.Draggable = factory();
	}
}(this, function () {

	'use strict';

	return function(_elements) {

		/**
		 * The DraggableObject, represents a single HTMLElement
		 *
		 * @param _parent The parent object, aka 'this' in the perspective of the Draggable object
		 * @param _element The HTML element to drag
		 * @constructor DraggableObject
		 */
		var DraggableObject = function(_parent, _element) {
			// Retain 'this'
			var self = this;

			/**
			 * @var Draggable The parent object
			 * @type Draggable
			 */
			self.parent = null;

			/**
			 * @var HTMLElement The html element
			 * @type HTMLElement
			 */
			self.element = null;

			/**
			 * The dragGroup this Draggable belongs to, DraggableObject can only be dragged within the same group
			 * @type {string|null}
			 */
			self.dragGroup = null;

			/**
			 * If the element is currently draggable
			 * @type {boolean}
			 */
			self.active = false;

			/**
			 * Initializer
			 */
			var init = function(_this) {
				return function(_parent, _element) {
					_this.parent = _parent;
					_this.element = _element;

					// Return 'this' for chaining
					return _this;
				};
			}(self);

			/**
			 * Makes the element draggable
			 */
			self.start = function(_this) {
				return function() {
					// Add listeners
					_this.element.addEventListener('dragstart', dragStartHandle, false);
					_this.element.addEventListener('dragenter', dragEnterHandle, false);
					_this.element.addEventListener('dragover', dragOverHandle, false);
					_this.element.addEventListener('dragleave', dragLeaveHandle, false);
					_this.element.addEventListener('drop', dragEndHandle, false);
					//_this.element.addEventListener('mouseup', dragEndHandle, false);

					// Start HTML dragging
					_this.element.setAttribute('draggable', true);

					// Set the dragGroup, if any
					var group = _this.element.getAttribute('data-drag');

					if (group && group.length > 0) {
						_this.dragGroup = group;
					}

					// Set the active boolean
					_this.active = true;

					// Return 'this' for chaining
					return _this;
				};
			}(self);

			/**
			 * The drag started
			 */
			self.dragStarted = function(_this) {
				return function() {
					if (!_this.element.hasAttribute('data-dragStarted')) {
						_this.element.setAttribute('data-dragStarted', '');
					}

					// Return 'this' for chaining
					return _this;
				};
			}(self);

			/**
			 * The element got dragged over another viable DraggableObject
			 */
			self.dragOver = function(_this) {
				return function() {
					if (!_this.element.hasAttribute('data-dragOver')) {
						_this.element.setAttribute('data-dragOver', '');
					}

					// Return 'this' for chaining
					return _this;
				};
			}(self);

			/**
			 * Another viable DraggableObject was dragged over this object
			 */
			self.dragLeave = function(_this) {
				return function() {
					if (_this.element.hasAttribute('data-dragOver')) {
						_this.element.removeAttribute('data-dragOver');
					}

					// Return 'this' for chaining
					return _this;
				};
			}(self);

			/**
			 * The element got dragged over
			 */
			self.dragDone = function(_this) {
				return function() {
					if (_this.element.hasAttribute('data-dragStarted')) {
						_this.element.removeAttribute('data-dragStarted');
					}

					if (_this.element.hasAttribute('data-dragOver')) {
						_this.element.removeAttribute('data-dragOver');
					}

					// Return 'this' for chaining
					return _this;
				};
			}(self);

			/**
			 * Swaps the entire element with another one
			 */
			self.swapWith = function(_this) {
				return function (other) {
					var thisStoredElement = _this.element;
					var otherStoredElement = other.element;
					
					// Save all attributes to 
					var thisStoredAttributes = attributesToKeyValue(_this.element.attributes);
					var otherStoredAttributes = attributesToKeyValue(other.element.attributes);

					removeAttributes(_this.element, thisStoredAttributes);
					removeAttributes(other.element, otherStoredAttributes);

					var thisStoredContents = _this.element.innerHTML;
					var otherStoredContents = other.element.innerHTML;

					setAttributes(_this.element, otherStoredAttributes);
					setAttributes(other.element, thisStoredAttributes);

					thisStoredElement.innerHTML = otherStoredContents;
					otherStoredElement.innerHTML = thisStoredContents;

					// Return 'this' for chaining
					return _this;
				};
			}(self);

			/**
			 * Takes a .attributes NamedNodeMap and returns a simple key => value array.
			 *
			 * @param {NamedNodeMap} attributes
			 * @returns {Array}
			 */
			function attributesToKeyValue(attributes) {
				var returnArray = [];

				for (var attr, i = 0; i < attributes.length; i++){
					attr = attributes[i];

					returnArray[attr.nodeName] = attr.nodeValue;
				}

				return returnArray;
			}

			/**
			 * Remove all attributes in the key => value array from the element.
			 *
			 * @param {HTMLElement} element
			 * @param {Array} attributes
			 */
			function removeAttributes(element, attributes) {
				for (var key in attributes){
					if (attributes.hasOwnProperty(key)) {
						if (element.hasAttribute(key)) {
							element.removeAttribute(key);
						}
					}
				}
			}

			/**
			 * Replaces the attributes of an element with the given attribute set
			 *
			 * @param {HTMLElement} element The element to replace the attributes from
			 * @param {Array} attributes The attributes to swap
			 */
			function setAttributes(element, attributes) {
				for (var key in attributes){
					if (attributes.hasOwnProperty(key)) {
						element.setAttribute(key, attributes[key]);
					}
				}
			}

			/**
			 * Stops the element from being draggable
			 */
			self.stop = function(_this) {
				return function() {
					if (_this.active) {
						// Remove listeners
						_this.element.removeEventListener('dragstart', dragStartHandle, false);
						_this.element.removeEventListener('dragenter', dragEnterHandle, false);
						_this.element.removeEventListener('dragover', dragOverHandle, false);
						_this.element.removeEventListener('dragleave', dragLeaveHandle, false);
						_this.element.removeEventListener('mouseup', dragEndHandle, false);

						// Stop HTML dragging
						_this.element.setAttribute('draggable', false);

						// Unset the active boolean
						_this.active = false;
					}

					// Return 'this' for chaining
					return _this;
				};
			}(self);

			/**
			 * Destroys the draggable
			 */
			self.destroy = function(_this) {
				return function() {
					_this.stop();

					self = null;
					_this = null;
				};
			}(self);

			// Start off
			return init(_parent, _element);
		};

		/**
		 * The callback function or null
		 *
		 * @type {Function}
		 */
		this.callback = null;

		/**
		 * The DraggableObjects
		 *
		 * @type {DraggableObject[]}
		 */
		var objects = [];

		/**
		 * The DraggableObject that is currently being dragged, or null if none.
		 *
		 * @type {DraggableObject}
		 */
		var currentDrag = null;

		/**
		 * The DraggableObject that is currently being dragged over, or null if none.
		 *
		 * @type {DraggableObject}
		 */
		var dropPlace = null;

		/**
		 * Initializes Draggable
		 */
		var init = function(_this) {
			return function(_elements) {
				_this.add(_elements);

				// Return 'this' for chaining
				return _this;
			};
		}(this);

		/**
		 * Adds a element or an array of elements as a DraggableObject
		 */
		this.add = function(_this) {
			return function (_elementOrArray) {
				if (!_elementOrArray) {
					return _this;
				}

				var elements = _elementOrArray;

				if (_elementOrArray instanceof HTMLElement) {
					elements = [_elementOrArray];
				}

				[].forEach.call(elements, function(element){
					var obj = new DraggableObject(_this, element);
					obj.start();

					objects.push(obj);
				});

				// Return 'this' for chaining
				return _this;
			};
		}(this);
		
		/**
		 * Listen to the drag finished event
		 */
		this.listen = function (_this) {
			return function (callback) {
				_this.callback = callback;
			};
		}(this);
		
		/**
		 * Clears all the draggables
		 */
		this.clear = function (_this) {
			return function () {
				objects.forEach(function(obj){
					obj.destroy();
				});
				
				objects = [];
			};
		}(this);

		function objectForHtmlElement(element) {
			return objects.find(function(obj){
				if (obj.element == this) {
					return obj;
				}
			}, element);
		}

		var dragStartHandle = function (_this) {
			return function (e) {
				//e.dataTransfer.effectAllowed = 'move';
				//e.dataTransfer.setData('text/html', this.innerHTML);

				currentDrag = objectForHtmlElement(this);
				currentDrag.dragStarted();
			};
		}(this);

		var dragEnterHandle = function (_this) {
			return function (e) {
				if (e.preventDefault) {
					e.preventDefault();
				}

				//e.dataTransfer.dropEffect = 'move';

				dropPlace = objectForHtmlElement(this);
			};
		}(this);

		var dragOverHandle = function (_this) {
			return function (e) {
				if (e.preventDefault) {
					e.preventDefault();
				}

				dropPlace = objectForHtmlElement(this);

				if (dropPlace != currentDrag) {
					if (dropPlace.dragGroup == currentDrag.dragGroup) {
						dropPlace.dragOver();
					}
				}
			};
		}(this);

		var dragLeaveHandle = function (_this) {
			return function (e) {
				if (e.preventDefault) {
					e.preventDefault();
				}

				if (dropPlace != currentDrag) {
					if (dropPlace.dragGroup == currentDrag.dragGroup) {
						dropPlace.dragLeave();
					}
				}
			};
		}(this);

		var dragEndHandle = function (_this) {
			return function (e) {
				if (e.stopPropagation) {
					e.stopPropagation(); // Stops some browsers from redirecting.
				}

				if (currentDrag) {
					currentDrag.dragDone();
				}

				if (dropPlace) {
					dropPlace.dragDone();
				}

				if (dropPlace != currentDrag && dropPlace != null && currentDrag != null) {
					if (dropPlace.dragGroup == currentDrag.dragGroup) {
						currentDrag.swapWith(dropPlace);

						if (_this.callback instanceof Function) {
							_this.callback.call(_this, currentDrag.element, dropPlace.element);
						}
					}
				}
			};
		}(this);

		return init(_elements);
	};
}));