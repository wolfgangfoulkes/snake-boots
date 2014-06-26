/* default
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
*/

varying mat3 vTBN;
varying vec2 vUV;
varying vec4 vVecPos;

//runtime control uniforms
uniform vec3 mColor;
uniform float mAlpha;
uniform float mAmplitude;
uniform float mBrightness;

//m for MINE
uniform vec3 mLightPosition;

uniform sampler2D mTexture;
uniform sampler2D mTextureN;

//filled by THREE.js
uniform vec3 pointLightColor[MAX_POINT_LIGHTS];
uniform vec3 pointLightPosition[MAX_POINT_LIGHTS];
uniform float pointLightDistance[MAX_POINT_LIGHTS];

void main()
{

    //!I may need to look back at the CINDER shader to displace the normals,
    //this may not be a straight normal-map, it might be a kind of displacement map.
    //I may also need to use the regular position in the vert shader
    vec3 dry = texture2D(mTexture, vUV).rgb;
    
    // Calculate the Vertex-to-Light Vector
    vec4 lightVectorView = viewMatrix * vec4(pointLightPosition[0], 1.0);
    vec3 lightVector = normalize(lightVectorView.xyz - vVecPos.xyz);
    
    // Transform texture coordinate of normal map to a range (-1.0, 1.0)
    vec3 normalCoordinate = texture2D(mTextureN, vUV).xyz * 2.0 - 1.0;

    // Transform the normal vector in the RGB channels to tangent space
    vec3 normal = normalize(vTBN * normalCoordinate.rgb);

    // Intensity calculated as dot of normal and vertex-light vector
    float intensity = max(0.07, dot(normal, lightVector)) * 2.0;
    //darkest parts are at 0.07
    //replace 2.0 with a brightness param

    // Adjustments to alpha and intensity per color channel may be made
    vec4 lighting = vec4(intensity, intensity, intensity, 1.0) * vec4(.5, 1.5, 1.0, 1.0);

    // Final color is calculated with the lighting applied
    gl_FragColor = vec4(dry, mAlpha) * lighting;
}