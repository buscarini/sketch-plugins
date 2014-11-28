#import "augment.js"

var ClassInfo = augment.defclass({
	constructor: function(name) {
		this.name = name
	},
	name : null,
	parentClass: "NSObject",
	protocols: [],
	privateProtocols : [],
	imports: {},
	properties : {},
	methods : {},
	designable: false
})

var Import = augment.defclass({
	constructor: function(name){
		this.name = name
	},
	name: null,
	relative: false,
	public: true
}

var Property = augment.defclass({
	constructor: function(type,name){
		this.type = type
		this.name = name
	},
	name: null,
	type: null,
	atomic: false,
	storage: "strong",
	inspectable: false,
	public: false
}

var Method = augment.defclass({
	constructor: function(returnType,name){
		this.name = name
	},
	name: null,
	returnType: "void",
	parameters: {},
	body: null,
	public: false
}

var Parameter = augment.defclass({
	constructor: function(type,name){
		this.name = name
	},
	name: null,
	type: null,
	externalName: null
}

com.buscarini.objc = {
	generateImports: function(classInfo,public) {
		var results = []
		for (var property in classInfo.imports) {
		    if (object.hasOwnProperty(property)) {
				if (property.public!=public) continue
				if (property.relative) {
					results.push("#import \""+ property.name +"\"")
				}
				else {
					results.push("#import <"+ property.name +">")
				}
		    }
		}
		return results
	},
	generateProperties: function(classInfo,public) {
		var results = []
		for (var property in classInfo.properties) {
		    if (object.hasOwnProperty(property)) {
				if (property.public!=public) continue
					
				var atomicString = "nonatomic"
				if (property.atomic) atomicString = "atomic"
				results.push("@property (" + atomicString + "," + property.storage + ") " + property.type + " " + property.name +";")
			}
		}
		return results
	},
	generateMethods: function(classInfo,public) {
		var results = []
		for (var property in classInfo.methods) {
		    if (object.hasOwnProperty(property)) {
				if (property.public!=public) continue
					
				var methodString = "- (" + property.returnType + ") " + property.name
				
				var i = 0;
				for (var parameter in property.parameters) {
				    if (property.hasOwnProperty(parameter)) {
						if (i>0) {
							methodString += " "
							methodString += parameter.externalName
						}
						
						methodString += ":(" + parameter.type  +")" + parameter.name
						i++
					}
				}
				
				methodString += ";"
				
				results.push(methodString)
			}
		}
		return results
	},
	generateMethodsBody: function(classInfo) {
		var results = []
		for (var property in classInfo.methods) {
		    if (object.hasOwnProperty(property)) {
				
			}
		}
		return results
	},
	generateDeclaration: function(classInfo, public) {
		var resultLines = [""]
		
		// Imports
		resultLines.push.apply(resultLines,this.generateImports(classInfo,public))
		resultLines.push("")
	
		if (public && classInfo.designable) {
			resultLines.push("IB_DESIGNABLE")
		}
		
		// Interface
		var protocolsString = classInfo.protocols.join(",")
		var interfaceString = "@interface " + classInfo.name
			
		if (public) {
			interfaceString += " : " + classInfo.parentClass	
		} 
		else {
			interfaceString += "()"
		}
		
		if (protocolsString.length>0) {
			interfaceString += "<" + protocolsString + ">"
		}
		
		resultLines.push(interfaceString)
		resultLines.push("")
		resultLines.push.apply(resultLines,this.generateProperties(classInfo,public))
		resultLines.push("")
		
		resultLines.push.apply(resultLines,this.generateHeaderMethods(classInfo,public))
		
		resultLines.push("","@end","")
		
		return resultLines
	},
	generateHeader : function(classInfo) {
		var resultLines = this.generateDeclaration(classInfo,true)
		return resultLines.join("\n")
	},
	generateImplementation: function(classInfo) {
		var resultLines = this.generateDeclaration(classInfo,false)
			
		resultLines.push("@implementation " + classInfo.name,"")
		
		resultLines.push.apply(resultLines,this.generateMethodsBody(classInfo))
		
		resultLines.push("")
			
		return resultLines.join("\n")
	}
}	


