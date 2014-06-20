#extension GL_OES_standard_derivatives : enable

/* default
            "uniform mat4 modelMatrix;",
            "uniform mat4 modelViewMatrix;",
            "uniform mat4 projectionMatrix;",
            "uniform mat4 viewMatrix;",
            "uniform mat3 normalMatrix;",
            "uniform vec3 cameraPosition;",

            "attribute vec3 position;", //like gl_Vertex?
            "attribute vec3 normal;", //like gl_Normal?
            "attribute vec2 uv;", //like gl_TexCoord[0]?
            "attribute vec2 uv2; //like gl_TexCoord[1]?
            
            attribute vec3 color;
*/

varying vec2 vUV;

void main()
{
	//pass position and texture coordinate on to the fragment shader
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	vUV = uv;
}