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
            
            after enabling lights on the material:
            vec3[MAX_POINT_LIGHTS] pointLightColor
            vec3[MAX_POINT_LIGHTS] pointLightPosition: light position, in world coordinates
            float[MAX_POINT_LIGHTS] pointLightDistance: used for attenuation purposes.
*/

attribute vec4 tangent;

varying mat3 vTBN;
varying vec2 vUV;
varying vec4 vVecPos;

uniform sampler2D mTextureD;
uniform float mAmplitudeD;

//m for MINE
uniform vec3 mLightPosition;

//filled by THREE.js
uniform vec3 pointLightColor[MAX_POINT_LIGHTS];
uniform vec3 pointLightPosition[MAX_POINT_LIGHTS];
uniform float pointLightDistance[MAX_POINT_LIGHTS];

void main() {

    // Create the Tangent-Binormal-Normal Matrix used for transforming
    // coordinates from object space to tangent space
    vec3 aNormal = normalize(normalMatrix * normal);
    vec3 aTangent = normalize(normalMatrix * tangent.xyz);
    vec3 aBinormal = normalize(cross(aNormal, aTangent) * tangent.w);
    vTBN = mat3(aTangent, aBinormal, aNormal);

    // lookup displacement in map
	float displacement = texture2D( mTextureD, uv ).r; //not accounting for amplitude, doe
    displacement -= 0.5;
    displacement *= mAmplitudeD;

    // now take the vertex and displace it along its normal
	vec3 V = position; //use to displace gl_position (position + (normal * displacement))
    //position is different from gl_Vertex in the C++ implementation
    //range of position is -0.5 - 0.5
	V.x += normal.x * displacement;
	V.y += normal.y * displacement;
	V.z += normal.z * displacement;
    
    vVecPos = modelViewMatrix * vec4(position, 1.0); //!might needa use V!
    
    vUV = uv; //pass the texture coordinate to the frag shader
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(V, 1.0);
    
    
}
