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

varying vec3 vNormal;
varying mat3 vNormalMatrix;
varying vec2 vUV;

uniform sampler2D mTextureD;
 
void main() {


    // lookup displacement in map
	float displacement = texture2D( mTextureD, uv ).r;

    // now take the vertex and displace it along its normal
	vec3 V = position; //use to displace gl_position (position + (normal * displacement))
	V.x += normal.x * displacement;
	V.y += normal.y * displacement;
	V.z += normal.z * displacement;

    vUV = uv; //pass the texture coordinate to the frag shader
    vNormal = normal; //pass surface normal to frag shader.
    vNormalMatrix = normalMatrix; //pass normal matrix along (better way than this? do all in Vert?)
 
    gl_Position = projectionMatrix * modelViewMatrix * vec4(V, 1.0);
    
    //gl_TexCoord[0] = gl_MultiTexCoord0; can we use reg'lar vars?
}
