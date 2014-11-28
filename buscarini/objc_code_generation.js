
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
})

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
})

var Method = augment.defclass({
	constructor: function(returnType,name) {
		this.returnType = returnType
		this.name = name
	},
	name: null,
	returnType: "void",
	parameters: [],
	body: [],
	public: false
})

var IBActionMethod = augment.defclass({
	constructor: function(name) {
		this.name = name
		this.parameters.push(new Parameter(null,"id","sender"))
	},
	name: null,
	returnType: "IBAction",
	parameters: [],
	body: [],
	public: true
})

var Parameter = augment.defclass({
	constructor: function(externalName,type,name){
		this.externalName = externalName
		this.type = type
		this.name = name
	},
	name: null,
	type: null,
	externalName: null
})

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
	generateMethodDeclaration: function(method) {
		var methodString = "- (" + method.returnType + ") " + method.name
		
		for (var i = 0; i < method.parameters.length; i++) {
			var parameter = method.parameters[i]
			if (i>0) {
				methodString += " "
				methodString += parameter.externalName
			}
			
			methodString += ":(" + parameter.type  +")" + parameter.name
		}
		
		return methodString
	},
	generateMethods: function(classInfo,public) {
		var results = []
		for (var property in classInfo.methods) {
		    if (object.hasOwnProperty(property)) {
				if (property.public!=public) continue
					
				var methodString = this.generateMethodDeclaration(property)
				
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
				var methodString = this.generateMethodDeclaration(property)
				methodString += " {"
				results.push(methodString,"")
				results.push.apply(results,property.body)
				results.push("}","")
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


