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
varying vec3 lightVec; //with multiple lights this is an array
varying vec3 eyeVec;

uniform sampler2D mTextureD;
uniform float mAmplitudeD;

uniform vec3 uLightPosition;

//filled by THREE.js
//uniform vec3 pointLightColor[MAX_POINT_LIGHTS];
//uniform vec3 pointLightPosition[MAX_POINT_LIGHTS];
//uniform float pointLightDistance[MAX_POINT_LIGHTS];

void main() {

    /*****LIGHTING PARAMS*****/
    // Create the Tangent-Binormal-Normal Matrix used for transforming
    // coordinates from object space to tangent space
    vec3 aNormal = normalize(normalMatrix * normal);
    vec3 aTangent = normalize(normalMatrix * tangent.xyz);
    vec3 aBinormal = normalize(cross(aNormal, aTangent));
    vTBN = mat3(aTangent, aBinormal, aNormal);
    
    vec4 tmpVecPos = modelViewMatrix * vec4(position, 1.0); //!might needa use V!
    vec3 tmpL = uLightPosition - tmpVecPos.xyz; //calculate this in a loop.
    vec3 tmpE = -tmpVecPos.xyz;
    
    //transform light and eye vectors into tangent space?
    //could this just be multiplication by vTBN? pretty sure that was the same.
    lightVec.x = dot(tmpL, aTangent);
    lightVec.y = dot(tmpL, aBinormal);
    lightVec.z = dot(tmpL, aNormal);
    lightVec = normalize(lightVec);
    
    eyeVec.x = dot(tmpE, aTangent);
    eyeVec.y = dot(tmpE, aBinormal);
    eyeVec.z = dot(tmpE, aNormal);
    eyeVec = normalize(eyeVec);

    /*****VERTEX DISPLACEMENT*****/
    // lookup displacement in map
	float displacement = texture2D( mTextureD, uv ).r; //not accounting for amplitude, doe
    //convert to -1-1
    displacement -= 0.5;
    displacement *= 2.0;
    displacement *= mAmplitudeD;

    // now take the vertex and displace it along its normal
	vec3 V = position; //use to displace gl_position (position + (normal * displacement))
    //position is different from gl_Vertex in the C++ implementation
    //range of position is -0.5 - 0.5
	V.x += normal.x * displacement;
	V.y += normal.y * displacement;
	V.z += normal.z * displacement;
    
    vUV = uv; //pass the texture coordinate to the frag shader
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(V, 1.0);
    
}
