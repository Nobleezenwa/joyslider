class Joyslider {
	constructor({	container, //DOMElement to hold rendering canvas; canvas will always automatically adjust to fit this container
					background = 'white', //CSS style color
					foreground = 'black', //CSS style color
					valueX = 0, //initialization and reset value for X control; for this to work, its value must lie within the specified rangeX and autoReturnX must be false
					valueY = [0,0], //initialization and reset value for Y control; for this to work its value must lie within the specified rangeY and autoReturnY must be false
					rangeX = [0,360], //set custom range for X control
					rangeY = [0,360,0,100], //set custom range for Y control
					autoReturnX = false, //return X control to origin on release
					autoReturnY = true, //return Y control to origin on release
					callback = false, //called with Joyslider Event as argument; if false, event is dispatched to the window
					disabled = false //other values include true, 'X' and 'Y'; true(bool) disables both X and Y controls
		}){
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');
		container.appendChild(this.canvas);
		this.container = container;
		this.background = background;
		this.foreground = foreground;
		this.valueX = this.origValueX = valueX;
		this.valueY = this.origValueY = valueY;
		this.rangeX = rangeX;
		this.rangeY = rangeY;
		this.autoReturnX = autoReturnX;
		this.autoReturnY = autoReturnY;
		this.callback = (typeof callback === 'function')? callback : (ev) => { window.dispatchEvent(ev); };
		this.disabled = (typeof disabled === 'string')? disabled.toUpperCase() : disabled;
		this.response = new CustomEvent('Joyslider', {});
		this.eventRespond = false;
		if ('ontouchstart' in  document.documentElement) {
			this.container.addEventListener('touchstart', this.__onEvent.bind(this));
			document.addEventListener('touchend', this.__onEvent.bind(this));
			document.addEventListener('touchmove', this.__onEvent.bind(this));
		}
		else if ('onmousedown' in  document.documentElement) {
			this.container.addEventListener('mousedown', this.__onEvent.bind(this));
			document.addEventListener('mouseup', this.__onEvent.bind(this));
			document.addEventListener('mousemove', this.__onEvent.bind(this));
		}
		window.addEventListener('resize', this.__render.bind(this));
		this.__render();
	}
	getX() { return this.valueX; }
	getY() { return this.valueY; }
	setX(a) { this.__setX(a); this.__render(false); }
	setY(a,d) { this.__setY(a,d); this.__render(false); }
	reset() {
		this.valueX = this.origValueX;
		this.valueY = this.origValueY;
		this.__render();
	}
	dispose() {
		if ('ontouchstart' in  document.documentElement) {
			this.container.removeEventListener('touchstart', this.__onEvent.bind(this));
			document.removeEventListener('touchend', this.__onEvent.bind(this));
			document.removeEventListener('touchmove', this.__onEvent.bind(this));
		}
		else if ('onmousedown' in  document.documentElement) {
			this.container.removeEventListener('mousedown', this.__onEvent.bind(this));
			document.removeEventListener('mouseup', this.__onEvent.bind(this));
			document.removeEventListener('mousemove', this.__onEvent.bind(this));
		}
		window.removeEventListener('resize', this.__render.bind(this));
		this.canvas.parentNode.removeChild(this.canvas);
		this.callback=()=>{};
	}
	__setX(a) {
		var xa = this.rangeX[0], r = this.control.r;
		if (!this.autoReturnX) {
			xa = this.__convertRange(a, this.rangeX, [0, 5.654866776]);
			this.valueX = a;
		}
		this.controlTwo = {r:Math.round(r / 6), a:(xa-(Math.PI / 2))};
	}
	__setY(a,d) {
		var x = this.control.x; var y = this.control.y; var r = this.control.r;
		if (!this.autoReturnY) {
			var X2 = (x+Math.round(r / 2)) - x; 
			var Y2 = -(y+Math.round(r / 2)) + y; 
			var dmax = ((X2 ** 2) + (Y2 ** 2)) ** 0.5;
			var ya = this.__convertRange(a, [this.rangeY[0], this.rangeY[1]], [0, 6.283185307]);
			ya -= Math.PI;
			var yd = this.__convertRange(d, [this.rangeY[2], this.rangeY[3]], [0, dmax]);
			x = (Math.cos(ya) * yd) + x;
			y = (Math.sin(ya) * yd) + y;
			var minX = this.control.x-this.control.r+Math.round(r / 2);
			var minY = this.control.y-this.control.r+Math.round(r / 2);
			var maxX = this.control.x+this.control.r-Math.round(r / 2);
			var maxY = this.control.y+this.control.r-Math.round(r / 2);
			this.valueY = [a, d];
		}
		this.controlOne = {x:x, y:y, r:Math.round(r / 2)};
	}
	__render(mod) {
		mod = typeof mod === 'undefined'? true : mod;
		var box = this.ctx.canvas.getBoundingClientRect();
		this.ctx.canvas.offset = {left: box.left, top: box.top};
		this.ctx.canvas.width = this.container.clientWidth; this.ctx.canvas.height = this.container.clientHeight;
		this.ctx.fillStyle = this.background; this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.width);
		var x = Math.floor(this.ctx.canvas.width / 2); var y = Math.floor(this.ctx.canvas.height / 2); var r = Math.min(x-10,y-10);
		this.control = {x:x, y:y, r:r};
		this.ctx.beginPath();
		this.ctx.arc(this.control.x,this.control.y,this.control.r,0,2*Math.PI);
		this.ctx.strokeStyle = this.foreground; this.ctx.lineWidth = 5;
		this.ctx.stroke();
		if (mod) {
			this.__setY(this.valueY[0], this.valueY[1]);
			this.__setX(this.valueX);
		}
		this.__drawControlOne();
	}
	__drawControlOne() {
		this.ctx.beginPath();
		if (this.disabled != true && this.disabled != 'X') { 
			this.ctx.arc(this.controlOne.x,this.controlOne.y,this.controlOne.r,Math.PI,Math.PI*0.8);
			this.ctx.strokeStyle = this.foreground; this.ctx.lineWidth = 5;
			this.ctx.stroke();
		} else {
			this.ctx.arc(this.controlOne.x,this.controlOne.y,this.controlOne.r,0,2*Math.PI);
			const grd = this.ctx.createRadialGradient(this.controlOne.x,this.controlOne.y,this.controlOne.r,this.controlOne.x,this.controlOne.y,0);
			grd.addColorStop(0, this.foreground); grd.addColorStop(1, this.background);
			this.ctx.fillStyle = grd;
			//this.ctx.fillStyle = this.foreground; //or use plain color instead
			this.ctx.fill();
		}
		if (this.disabled != true && this.disabled != 'X') { this.__drawControlTwo(); }
	}
	__drawControlTwo() {
		this.controlTwo.x = this.controlOne.x + Math.round(this.controlOne.r * Math.sin(this.controlTwo.a));
		this.controlTwo.y = this.controlOne.y - Math.round(this.controlOne.r * Math.cos(this.controlTwo.a));
		this.ctx.beginPath();
		this.ctx.arc(this.controlTwo.x,this.controlTwo.y,this.controlTwo.r,0,2*Math.PI);
		const grd = this.ctx.createRadialGradient(this.controlTwo.x,this.controlTwo.y,this.controlTwo.r,this.controlTwo.x,this.controlTwo.y,0);
		grd.addColorStop(0, this.foreground); grd.addColorStop(1, this.background);
		this.ctx.fillStyle = grd;
		//this.ctx.fillStyle = this.foreground; //or use plain color instead
		this.ctx.fill();
	}
	__onEvent(ev) {
		if (ev.type == 'mousedown') { var e = { type: 'start', x: ev.clientX, y: ev.clientY }; }
		else if (ev.type == 'mousemove') { var e = { type: 'move', x: ev.clientX, y: ev.clientY }; }
		else if (ev.type == 'mouseup') { var e = { type: 'stop', x: ev.clientX, y: ev.clientY }; }
		else if (ev.type == 'touchstart') {
			var touch = ev.touches[0] || ev.changedTouches[0];
			var e = { type: 'start', x: touch.pageX, y: touch.pageY };
		}
		else if (ev.type == 'touchmove') {
			var touch = ev.touches[0] || ev.changedTouches[0];
			var e = { type: 'move', x: touch.pageX, y: touch.pageY };
		}
		else if (ev.type == 'touchend') {
			var touch = ev.touches[0] || ev.changedTouches[0];
			var e = { type: 'stop', x: touch.pageX, y: touch.pageY };
		}
		this.__eventHandler(e);
	}
	__eventHandler(e) {
		if (e.type == 'start' || e.type == 'move') {
			var box1 = {ix:this.ctx.canvas.offset.left+(this.controlOne.x - this.controlOne.r), iy:this.ctx.canvas.offset.top+(this.controlOne.y - this.controlOne.r), ax:this.ctx.canvas.offset.left+(this.controlOne.x + this.controlOne.r), ay:this.ctx.canvas.offset.top+(this.controlOne.y + this.controlOne.r)};
			var box2 = {ix:this.ctx.canvas.offset.left+(this.controlTwo.x - this.controlTwo.r), iy:this.ctx.canvas.offset.top+(this.controlTwo.y - this.controlTwo.r), ax:this.ctx.canvas.offset.left+(this.controlTwo.x + this.controlTwo.r), ay:this.ctx.canvas.offset.top+(this.controlTwo.y + this.controlTwo.r)};
			if ((this.disabled != true && this.disabled != 'X') && box2.ix <= e.x && e.x <= box2.ax && box2.iy <= e.y && e.y <= box2.ay) {
				if (e.type == 'start') { this.__eventRespond = 'controlTwo'; }
				this.ctx.canvas.style.cursor = 'pointer';
				this.ctx.canvas.title = this.valueX;
			}
			else if ((this.disabled != true && this.disabled != 'Y') && box1.ix <= e.x && e.x <= box1.ax && box1.iy <= e.y && e.y <= box1.ay) {
				if (e.type == 'start') { this.__eventRespond = 'controlOne'; }
				this.ctx.canvas.style.cursor = 'pointer';
				this.ctx.canvas.title = this.valueY.toString();
			}
			else {
				this.ctx.canvas.style.cursor = 'default';
				this.ctx.canvas.title = '';
			}
		}
		else if (e.type == 'stop') {
			if (this.autoReturnX && this.__eventRespond == 'controlTwo') {
				this.valueX = this.rangeX[0];
				this.controlTwo.a = -(Math.PI / 2);
				this.response.range = 'X';
				this.response.value = this.valueX;
				this.callback(this.response);
			}
			if (this.autoReturnY && this.__eventRespond == 'controlOne') {
				this.valueY = [this.rangeY[0], this.rangeY[2]];
				this.controlOne.x = this.control.x;
				this.controlOne.y = this.control.y;
				this.response.range = 'Y';
				this.response.value = this.valueY;
				this.callback(this.response);
			}
			this.__eventRespond = false;
			this.__render(false);
		}
		if ((this.disabled != true && this.disabled != 'Y') && this.__eventRespond == 'controlOne') {
			var minX = this.control.x-this.control.r+this.controlOne.r;
			var minY = this.control.y-this.control.r+this.controlOne.r;
			var maxX = this.control.x+this.control.r-this.controlOne.r;
			var maxY = this.control.y+this.control.r-this.controlOne.r;
			this.controlOne.x = Math.min(Math.max((e.x - this.ctx.canvas.offset.left), minX), maxX);
			this.controlOne.y = Math.min(Math.max((e.y - this.ctx.canvas.offset.top), minY), maxY);
			this.__render(false);
			var X2 = (this.ctx.canvas.offset.left+this.controlOne.x) - (this.ctx.canvas.offset.left+this.control.x);
			var Y2 = (this.ctx.canvas.offset.top+this.controlOne.y) - (this.ctx.canvas.offset.top+this.control.y);
			var s = Math.atan2((0 - Y2),  (0 - X2));
			if (s < 0) { s += Math.PI*2; }
			var d = ((X2 ** 2) + (Y2 ** 2)) ** 0.5;
			X2 = (this.ctx.canvas.offset.left+(this.control.x+this.control.r-this.controlOne.r)) - (this.ctx.canvas.offset.left+this.control.x);
			Y2 = (this.ctx.canvas.offset.top+(this.control.y+this.control.r-this.controlOne.r)) - (this.ctx.canvas.offset.top+this.control.y);
			var dmax = ((X2 ** 2) + (Y2 ** 2)) ** 0.5;
			this.response.range = 'Y';
			this.response.value = this.valueY = [
									this.__convertRange(s, [0, 6.283185307], [this.rangeY[0], this.rangeY[1]]),
									this.__convertRange(d, [0, dmax], [this.rangeY[2], this.rangeY[3]])
								  ];
			this.callback(this.response);
		}
		else if ((this.disabled != true && this.disabled != 'X') && this.__eventRespond == 'controlTwo') {
			var X2 = e.x - (this.ctx.canvas.offset.left+this.controlOne.x);
			var Y2 = e.y - (this.ctx.canvas.offset.top+this.controlOne.y);
			var s = Math.atan2((0 - Y2),  (0 - X2));
			if (s < 0) { s += Math.PI*2; }
			if (s > 5.654866776 || Math.abs(this.controlTwo.a - s) > 2.356) { return; }
			this.controlTwo.a = s - (Math.PI / 2);
			this.__render(false);
			this.response.range = 'X';
			this.response.value = this.valueX = this.__convertRange(s, [0, 5.654866776], this.rangeX);
			this.callback(this.response);
		}
	}
	__convertRange(value, r1, r2) {
		return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
	}
}