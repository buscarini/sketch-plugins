
var com = {};

com.buscarini = {
	goldenRatio : 1.61803398875,
	scaleLayerWithPct: function(layer,percent,round) {
		frame = [layer frame]
		width = [frame width]
		height = [frame height]
		
		log("size: " + width + " " + height)
		
		width = width*percent
		height = height*percent
		
		log("scaled size: " + width + " " + height)
		
		com.buscarini.scaleLayerToSize(layer,width,height,round)
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
		for (var w=0;w<borders.length();w++) {
			border = borders[w];
			var thickness = [border thickness];
			thickness = thickness*proportion;
			[border setThickness:thickness];
		}
		
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
	}
}