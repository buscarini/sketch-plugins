
#import '../buscarini/augment.js'

var com = {}
com.buscarini = {}

#import '../buscarini/objc_code_generation.js'

com.buscarini.utils = {
	uniqueId: 0,
	goldenRatio : 1.61803398875,
	e : 2.7182818284590452353602874,
	increaseColorBrightness: function(color,inc) {
		var red = [color red]
		red += inc
		if (red>1) red=1
		[color setRed:red]

		var green = [color green]
		green += inc
		if (green>1) green=1
		[color setGreen:green]

		var blue = [color blue]
		blue += inc
		if (blue>1) blue=1
		[color setBlue:blue]
	},
	uniqueScriptId: function() {
		this.uniqueId++
		return this.uniqueId
	},
	normalizeName: function(name) {
		name = name.replace(/\s+/g, '')
		return name
	},
	nameForVariable: function(name) {
		name = this.normalizeName(name)
		return name.charAt(0).toLowerCase() + name.slice(1);
	},
	nameForClass: function(name) {
		name = this.normalizeName(name)
		return name.charAt(0).toUpperCase() + name.slice(1);
	},
	appendSuffixOnce: function(name,suffix) {
		if (name.substr(-suffix.length,suffix.length).toLowerCase()!=suffix.toLowerCase()) {
			name += suffix
		}
		return name	
	},
	removeAllFills: function(layer) {
		layerStyle = [layer style]
		fills = [layerStyle fills]
		
		for (var f=0;f<[fills count];f++) {
			fill = fills[f]
			[layer removeStylePart:fill]
		}
	},
	scaleLayerWithPct: function(layer,percent,round) {
		frame = [layer frame]
		width = [frame width]
		height = [frame height]
				
		width = width*percent
		height = height*percent
				
		com.buscarini.scaleLayerToSize(layer,width,height,round)
	},
	findLayerWithName: function(name) {
	
		var page = [doc currentPage]
		return com.buscarini.findLayerWithNameInGroup(name,page)
	},
	findLayerWithNameInGroup: function(name,group) {
		var allLayers = [group layers]
		for (var i=0;i<[allLayers count];i++) {
			var layer = allLayers[i]
			if ([layer name]==name) return layer;
			if (layer.layers!=undefined) {
				/// It's a group
				var found = com.buscarini.findLayerWithNameInGroup(name,layer)
				if (found) return found
			}
		}
		
		return null;
	},
	calculateBounds: function(layers) {
		var minX = Number.MAX_VALUE;
		var minY = Number.MAX_VALUE;
		var maxX = Number.MIN_VALUE;
		var maxY = Number.MIN_VALUE;
		
		for (var i=0;i<[layers count];i++) {
			var layer = layers[i]
			
			var frame = [layer frame]
			
			if ([frame x]<minX) minX = [frame x]
			if ([frame y]<minY) minY = [frame y]
			
			var frameMaxX = [frame x]+[frame width]
			var frameMaxY = [frame y]+[frame height]
			if (frameMaxX>maxX) maxX = frameMaxX
			if (frameMaxY>maxY) maxY = frameMaxY
		}
		
		var rect = [[MSRect alloc] init];
		[rect setX:minX];
		[rect setY:minY];
		[rect setWidth:maxX-minX];
		[rect setHeight:maxY-minY];
		
		return rect;
	},
	addLayerDefaultFillColor: function(layer) {
		return this.addLayerFillColor(layer,0.5,0.5,0.5);
	},
	addLayerFillColor: function(layer,red,green,blue) {
		var color = [[[[layer style] fills] addNewStylePart] color]
		[color setRed:red];
		[color setGreen:green];
		[color setBlue:blue];
	},
	
	scaleLayerToSize: function(layer,width,height,round) {
		
		if (round==undefined) round = true;
		
		if (round) {
			width = Math.round(width)
			height = Math.round(height)
		}
		
		var locked = [layer isLocked];
		if (locked) [layer setIsLocked:false];

		frame = [layer frame];

		oldWidth = [frame width]
		oldHeight = [frame height]
		proportion = width/oldWidth
		hProportion = height/oldHeight
		
		if (proportion==hProportion) {
			var midX=layer.frame().midX();
			var midY=layer.frame().midY();

			layer.multiplyBy(proportion);

			// Translate frame to the original center point.
			layer.frame().midX = midX;
			layer.frame().midY = midY;
			return
		}
		
		// borders = [[layer style] borders];
// 		for (var w=0;w<borders.length();w++) {
// 			border = borders[w];
// 			var thickness = [border thickness];
// 			if (thickness!=undefined) {
// 				thickness = thickness*proportion;
// 				[border setThickness:thickness];				
// 			}
// 		}
		
		shadows = [[layer style] shadows];
		for (var w=0;w<shadows.length();w++) {
			shadow = shadows[w];
			
			var offsetX = [shadow offsetX];
			offsetX = offsetX*proportion;
			[shadow setOffsetX:offsetX];
			
			var offsetY = [shadow offsetY];
			offsetY = offsetY*proportion;
			[shadow setOffsetY:offsetY];
			
			var blurRadius = [shadow blurRadius];
			blurRadius = blurRadius*proportion;
			[shadow setBlurRadius:blurRadius];
			
			var spread = [shadow spread];
			spread = spread*proportion;
			[shadow setSpread:spread];
		}
		
		innerShadows = [[layer style] innerShadows];
		for (var w=0;w<innerShadows.length();w++) {
			innerShadow = innerShadows[w];
			
			var offsetX = [innerShadow offsetX];
			offsetX = offsetX*proportion;
			[innerShadow setOffsetX:offsetX];
			
			var offsetY = [innerShadow offsetY];
			offsetY = offsetY*proportion;
			[innerShadow setOffsetY:offsetY];
			
			var blurRadius = [innerShadow blurRadius];
			blurRadius = blurRadius*proportion;
			[innerShadow setBlurRadius:blurRadius];
			
			var spread = [innerShadow spread];
			spread = spread*proportion;
			[innerShadow setSpread:spread];
		}
		
		[frame setWidth:Math.round(width)];
		[frame setHeight:Math.round(height)];
		
		[layer setIsLocked:locked];
	},
	dump: function(obj){
	  log("######################################")
	  log("## Dumping object " + obj )
	  log("## obj class is: " + [obj className])
	  log("######################################")

	  log("obj.mocha:")
	  log([obj class].mocha())

	  log("obj.properties:")
	  log([obj class].mocha().properties())
	  log("obj.propertiesWithAncestors:")
	  log([obj class].mocha().propertiesWithAncestors())

	  log("obj.classMethods:")
	  log([obj class].mocha().classMethods())
	  log("obj.classMethodsWithAncestors:")
	  log([obj class].mocha().classMethodsWithAncestors())

	  log("obj.instanceMethods:")
	  log([obj class].mocha().instanceMethods())
	  log("obj.instanceMethodsWithAncestors:")
	  log([obj class].mocha().instanceMethodsWithAncestors())

	  log("obj.instanceVariables:")
	  log([obj class].mocha().instanceVariables())


	  log("obj.protocols:")
	  log([obj class].mocha().protocols())
	  log("obj.protocolsWithAncestors:")
	  log([obj class].mocha().protocolsWithAncestors())

	  log("obj.treeAsDictionary():")
	  log(obj.treeAsDictionary())
	},

	isGroup: function(layer) {
	  return [layer isMemberOfClass:[MSLayerGroup class]] || [layer isMemberOfClass:[MSArtboardGroup class]]
	},

	readAnimationParameters: function(layer) {
		var pattern = /(.*)_animation\((.*)\)/gm
		var layerName = layer.name()
		var match = pattern.exec(layerName)
		if (match==null) return null
	
		var animatedLayerName = match[1]
		var parameters = match[2]
		var paramsArray = parameters.split(",")
		
		var info = { layerName: finalLayerNameFromString(animatedLayerName) }

		var animationName = paramsArray.shift()
		var duration = paramsArray.shift()
		var repeatCount = paramsArray.shift()

		if (animationName) info.animationName = animationName
		if (duration) info.duration = duration
		if (repeatCount) info.repeatCount = repeatCount

		return info
	},

	isAnimation: function(layer) {
		var info = this.readAnimationParameters(layer)
		if (info==null) return false
		return true
	},

	firstStylePart: function(parts) {
		if ([parts count]>0) {
			var firstPart = null
			for (var partIndex = 0; partIndex < [parts count]; partIndex++) {
				var part = [parts objectAtIndex:partIndex]
				if ([part isEnabled]) {
					firstPart = part
					break;
				}
			}
			return firstPart
		}
		return null
	},

	isGradientFill: function(fill) {
		return ([fill fillType]==1)
	},

	isGradientLayer: function(layer) {
		var layerStyle = [layer style]

		var firstFill = this.firstStylePart([layerStyle fills])
		
		return this.isGradientFill(firstFill)
	},

	firstLetterUppercase: function(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},

	allValuesEqual: function(array) {
		if (array.length==0) return false
		
		for (var i = array.length - 1; i > 0; i--) {
			if (array[i]!=array[0]) return false
		}
	
		return true
	},

	isVisible: function(layer) {
		if (this.isAnimation(layer)) return true
		return layer.isVisible()
	}
}

var Point2 = augment.defclass({
	constructor: function(x,y) {
		this.x = x
		this.y = y
	},
	x : 0,
	y: 0	
})

var Vec2 = augment.defclass({
	constructor: function(x,y) {
		this.x = x
		this.y = y
	},
	x : 0,
	y: 0,
	normalize: function() {
		var mag = this.magnitude()
		this.x /= mag
		this.y /= mag
	},
	magnitude: function() {
		return sqrt(this.x*this.x+this.y*this.y)
	}
})

var bezierCircleConstant = 0.551915024494
