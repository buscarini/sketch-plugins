
var com = {};

com.buscarini = {
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
			var layer = [allLayers objectAtIndex:i]
			if ([layer name]==name) return layer;
			if (layer.layers!=undefined) {
				/// It's a group
				var found = com.buscarini.findLayerWithNameInGroup(name,layer)
				if (found) return found
			}
		}
		
		return null;
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
		
		borders = [[layer style] borders];
		for (var w=0; w < [borders count]; w++) {
			border = [borders objectAtIndex:w];
			var thickness = [border thickness];
			thickness = thickness*proportion;
			[border setThickness:thickness];
		}
		
		shadows = [[layer style] shadows];
		for (var w=0; w < [shadows count];w++) {
			shadow = [shadows objectAtIndex:w];
			
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
		for (var w=0; w < [innerShadows count]; w++) {
			innerShadow = [innerShadows objectAtIndex:w];
			
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
	}
}
