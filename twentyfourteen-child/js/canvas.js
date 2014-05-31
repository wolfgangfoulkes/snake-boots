/** Hold a reference to the WebGLContext */
var gl = null;

/** Hold a reference to the canvas DOM object. */
var canvas = null;

/**
 * Store the model matrix. This matrix is used to move models from object space (where each model can be thought
 * of being located at the center of the universe) to world space.
 */
var modelMatrix = mat4.create();

/**
 * Store the view matrix. This can be thought of as our camera. This matrix transforms world space to eye space;
 * it positions things relative to our eye.
 */
var viewMatrix = mat4.create();

/** Store the projection matrix. This is used to project the scene onto a 2D viewport. */
var projectionMatrix = mat4.create();

/** Allocate storage for the final combined matrix. This will be passed into the shader program. */
var mvpMatrix = mat4.create();

/** Store references to the vertex buffer objects (VBOs) that will be created. */
var canvasVertexBufferObject;
var canvasColorBufferObject;
var canvasTextureBufferObject;

var aspect;

// Helper function to load a shader
function loadShader(sourceScriptId, type)
{
	var shaderHandle = gl.createShader(type);
	var error;
	
	if (shaderHandle != 0)
	{
		// Read the embedded shader from the document.
		var shaderSource = document.getElementById(sourceScriptId);
		
		if (!shaderSource)
		{
			throw("Error: shader script '" + sourceScriptId + "' not found");
		}
		
		// Pass in the shader source.
		gl.shaderSource(shaderHandle, shaderSource.text);
		
		// Compile the shader.
		gl.compileShader(shaderHandle);
        
		// Get the compilation status.
		var compiled = gl.getShaderParameter(shaderHandle, gl.COMPILE_STATUS);
        
		// If the compilation failed, delete the shader.
		if (!compiled)
		{
			error = gl.getShaderInfoLog(shaderHandle);
			gl.deleteShader(shaderHandle);
			shaderHandle = 0;
		}
	}
    
	if (shaderHandle == 0)
	{
		throw("Error creating shader " + sourceScriptId + ": " + error);
	}
	
	return shaderHandle;
}

// Helper function to link a program
function linkProgram(vertexShader, fragmentShader)
{
	// Create a program object and store the handle to it.
	var programHandle = gl.createProgram();
	
	if (programHandle != 0)
	{
		// Bind the vertex shader to the program.
		gl.attachShader(programHandle, vertexShader);
        
		// Bind the fragment shader to the program.
		gl.attachShader(programHandle, fragmentShader);
		
		// Bind attributes
		gl.bindAttribLocation(programHandle, 0, "a_Position");
		gl.bindAttribLocation(programHandle, 1, "a_Color");
		
		// Link the two shaders together into a program.
		gl.linkProgram(programHandle);
        
		// Get the link status.
		var linked = gl.getProgramParameter(programHandle, gl.LINK_STATUS);
        
		// If the link failed, delete the program.
		if (!linked)
		{
			gl.deleteProgram(programHandle);
			programHandle = 0;
		}
	}
	
	if (programHandle == 0)
	{
		throw("Error creating program.");
	}
	
	return programHandle;
}

// Called when we have the context
function startRendering()
{
	//----- Configure viewport
	
	// Set the OpenGL viewport to the same size as the canvas.
	gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
	
	// Create a new perspective projection matrix. The height will stay the same
	// while the width will vary as per aspect ratio.
	aspect = canvas.clientWidth / canvas.clientHeight;
	var left = -aspect;
	var right = aspect;
	var bottom = -1.0;
	var top = 1.0;
	var near = 1.0;
	var far = 10.0;
    
	mat4.frustum(left, right, bottom, top, near, far, projectionMatrix);
	
	// Set the background clear color to gray.
	gl.clearColor(0.5, 0.5, 0.5, 1.0);
	
	/* Configure camera */
	// Position the eye behind the origin.
	var eyeX = 0.0;
	var eyeY = 0.0;
	var eyeZ = 1.5;
    
	// We are looking toward the distance
	var lookX = 0.0;
	var lookY = 0.0;
	var lookZ = -5.0;
    
	// Set our up vector. This is where our head would be pointing were we holding the camera.
	var upX = 0.0;
	var upY = 1.0;
	var upZ = 0.0;
	
	// Set the view matrix. This matrix can be said to represent the camera position.
	var eye = vec3.create();
	eye[0] = eyeX; eye[1] = eyeY; eye[2] = eyeZ;
	
	var center = vec3.create();
	center[0] = lookX; center[1] = lookY; center[2] = lookZ;
	
	var up = vec3.create();
	up[0] = upX; up[1] = upY; up[2] = upZ;
	
	mat4.lookAt(eye, center, up, viewMatrix);
	
	//----- Configure shaders
	
	var vertexShaderHandle = loadShader("vertex_shader", gl.VERTEX_SHADER);
	var fragmentShaderHandle = loadShader("fragment_shader", gl.FRAGMENT_SHADER);
	
	// Create a program object and store the handle to it.
	var programHandle = linkProgram(vertexShaderHandle, fragmentShaderHandle);
    
    // Set program handles. These will later be used to pass in values to the program.
	mvpMatrixHandle = gl.getUniformLocation(programHandle, "u_MVPMatrix");
    positionHandle = gl.getAttribLocation(programHandle, "a_Position");
    colorHandle = gl.getAttribLocation(programHandle, "a_Color");
    
    // Tell OpenGL to use this program when rendering.
    gl.useProgram(programHandle);
    
    //----- BUFFER VERTICES
    
    // Create buffers in OpenGL's working memory.
    canvasVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, canvasVertexBufferObject);
    var vertices = [
                     1.0,  1.0,  0.0,
                    -1.0,  1.0,  0.0,
                     1.0, -1.0,  0.0,
                    -1.0, -1.0,  0.0 ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    canvasColorBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, canvasColorBufferObject);
    var colors = [
                    // R, G, B, A
                    1.0, 0.0, 0.0, 1.0,
                    0.0, 0.0, 1.0, 1.0,
                    0.0, 1.0, 0.0, 1.0,
                    1.0, 0.0, 1.0, 1.0 ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	
	// Tell the browser we want render() to be called whenever it's time to draw another frame.
	window.requestAnimFrame(render, canvas);
}

function render(time)
{
    // Clear the canvas
	gl.clear(gl.COLOR_BUFFER_BIT);
    
    var scale = vec3.create;
    scale[0] = aspect * 1.0; scale[1] = 1; scale[2] = 0.0;
    
    mat4.identity(modelMatrix);
    mat4.scale(modelMatrix, scale);
    drawRect();
    
    // Send the commands to WebGL
	gl.flush();
	
	// Request another frame
	window.requestAnimFrame(render, canvas);
}

function checkError()
{
	var error = gl.getError();
	
	if (error)
	{
		throw("error: " + error);
	}
}

function drawRect()
{
      // Pass in the position information
      gl.enableVertexAttribArray(positionHandle);
      gl.bindBuffer(gl.ARRAY_BUFFER, canvasVertexBufferObject);
      gl.vertexAttribPointer(positionHandle, 3, gl.FLOAT, false, 0, 0);
        //3: item size (xyz)
      
      // Pass in the color information
      gl.enableVertexAttribArray(colorHandle);
      gl.bindBuffer(gl.ARRAY_BUFFER, canvasColorBufferObject);
      gl.vertexAttribPointer(colorHandle, 4, gl.FLOAT, false, 0, 0);
        //4: item size (rgba)
      
      // This multiplies the view matrix by the model matrix, and stores the result in the modelview matrix
      // (which currently contains model * view).
      mat4.multiply(viewMatrix, modelMatrix, mvpMatrix);
      
      // This multiplies the modelview matrix by the projection matrix, and stores the result in the MVP matrix
      // (which now contains model * view * projection).
      mat4.multiply(projectionMatrix, mvpMatrix, mvpMatrix);
      
      gl.uniformMatrix4fv(mvpMatrixHandle, false, mvpMatrix);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function main()
{
    // Try to get a WebGL context
    canvas = document.getElementById("canvas");
    
    // We don't need a depth buffer.
    // See https://www.khronos.org/registry/webgl/specs/1.0/ Section 5.2 for more info on parameters and defaults.
    gl = WebGLUtils.setupWebGL(canvas, { depth: false });
    
    if (gl != null)
    {
        startRendering();
    }
}

/*
var shaderProgram;
function initShaders() {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");
    
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
    
    gl.useProgram(shaderProgram);
*/