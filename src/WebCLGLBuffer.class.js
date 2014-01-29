/** 
* WebCLGLBuffer Object 
* @class
* @constructor
* @property {WebGLTexture} textureData
* @property {Array<Float>} inData Original array
* @property {Int} [offset=0] offset of buffer
*/
WebCLGLBuffer = function(gl, length, linear) { 
	this.gl = gl;
	if(length instanceof Object) { 
		this.W = length[0];
		this.H = length[1];
	} else {
		this.W = Math.sqrt(length);
		this.H = this.W;
	}
	this.type = 'FLOAT'; // FLOAT OR FLOAT4
	this.offset = 0;
	this.linear = linear;
	this.utils = new WebCLGLUtils(this.gl);
	
	this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);
	this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
	
	this.textureData = this.gl.createTexture();
	this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureData);  
	if(this.linear != undefined && this.linear) {
		this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.W,this.H, 0, this.gl.RGBA, this.gl.FLOAT, null); 
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST); 
		this.gl.generateMipmap(this.gl.TEXTURE_2D);
	} else {
		this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.W,this.H, 0, this.gl.RGBA, this.gl.FLOAT, null);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);  
	} 
	
	this.inData;
	this.outArray4Uint8Array = new Uint8Array((this.W*this.H)*4); 
	this.outArrayFloat32ArrayX = [];
	this.outArrayFloat32ArrayY = [];
	this.outArrayFloat32ArrayZ = [];
	this.outArrayFloat32ArrayW = [];
	this.outArray4Float32Array = [];
	
	// FRAMEBUFFER FOR enqueueNDRangeKernel
	this.rBuffer = this.gl.createRenderbuffer();
	this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.rBuffer);
	this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, this.W, this.H);
	this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
	
	this.fBuffer = this.gl.createFramebuffer();
	this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fBuffer);
	this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.rBuffer);
}; 