# Joyslider

A lightweight input widget featuring a Joystick and a Circular range slider built with Javascript for web applications. This can be used on touch-enabled or mouse-enabled devices. Suitable applications include games, 3D space navigation, remote control, etc.

![Untitled](https://noblee.000webhostapp.com/joyslider/Untitled.png)

**Demo**

​	See demo  [here](https://noblee.000webhostapp.com/joyslider/)

**Constructor**
	`container`
			DOMElement to hold rendering canvas. Canvas will always automatically adjust to fit this container.

​	`background`
​			CSS style color. Default value is `white`.

​	`foreground`
​			CSS style color. Default value is `black`.

​	`valueX`
​			Initialization and reset value for X control; for this to work, its value must lie within the specified rangeX while autoReturnX must be false. Default value is `0`.

​	`valueY`
​			Initialization and reset value for X control; for this to work, its value must lie within the specified rangeY while autoReturnY must be false. Default value is `[0,0]`.

​	`rangeX`
​			Custom range for X control. Default value is `[0,360]`.

​	`rangeY`
​			Custom range for Y control. Default value is `[0,360,0,100]`.

​	`autoReturnX`
​			Set to true to return X control to origin on release. Default value is `false`.

​	`autoReturnY`
​			Set to true to return X control to origin on release. Default value is `true`.

​	`callback`
​			Function called with a Joyslider Event as argument. Default value is `false`.

​	`disabled`
​			Can be true, 'X' and 'Y' or false. Default value is `false`.

**Methods**
	`getX`
		Returns value of control X.

​	`getY`
​		Returns value of control Y.

​	`setX`
​		Sets value of control X. For this to work, `autoReturnX` must be false.

​	`setY`
​		Sets value of control Y. For this to work, `autoReturnY` must be false.

​	`reset`
​		Reset Joyslider to initial values.

​	`dispose`
​		Remove Joyslider.

**Example**

```javascript
const jysldr = new Joyslider({ container: document.getElementById('my-container') });
```

