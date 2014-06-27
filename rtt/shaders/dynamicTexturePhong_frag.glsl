/* default
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
*/


varying vec2 vUV;

//params for lighting
varying mat3 vTBN;
varying vec3 lightVec;
varying vec3 eyeVec;

//runtime control uniforms
uniform vec3 mColor;
uniform float mAlpha;
uniform float mAmplitude;
uniform float mBrightness;

//m for MINE
uniform vec3 uLightPosition;

uniform sampler2D mTexture;
uniform sampler2D mTextureN;

//filled by THREE.js
//uniform vec3 pointLightColor[MAX_POINT_LIGHTS];
//uniform vec3 pointLightPosition[MAX_POINT_LIGHTS];
//uniform float pointLightDistance[MAX_POINT_LIGHTS];

void main()
{


    vec3 dry = texture2D(mTexture, vUV).rgb;
    
    // Transform texture coordinate of normal map to a range (-1.0, 1.0)
    vec3 mapNormal = normalize(texture2D(mTextureN, vUV).xyz * 2.0 - 1.0);

    float lambertFactor = max(dot(lightVec, mapNormal), 0.07);
    vec3 reflection = reflect(-lightVec, mapNormal);

    //these three would be done using an iterator for multiple lights and summed together for "lighting
    float ambient = 1.0;
    float diffuse = lambertFactor * 1.0; //1.0 will be diffuse amount
    float specular = pow(max(dot(reflection, eyeVec), 0.0), 2.0) * 1.0; //2.0 is shininess, 1.0 is amount
    //specular is fucked?
    
    vec3 lit = (dry * ambient) + (dry * diffuse) + vec3(specular);
    //in GL we would multiply each by the colors of material and light

    gl_FragColor = vec4(lit * mColor, mAlpha);
}