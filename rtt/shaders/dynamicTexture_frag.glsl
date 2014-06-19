varying vec3 vNormal;
varying mat3 vNormalMatrix;
varying vec2 vUV;
 
uniform vec3 mColor;
uniform float mAlpha;
uniform float mAmplitude;

uniform sampler2D mTexture;
uniform sampler2D mTextureD;
uniform sampler2D mTextureN;
 
void main(void) {
    //dry texture
    vec3 dry = texture2D(mTexture, vUV.xy).rgb; //wonder if I modulated by transformed vector?
    
    //get normal from texture
    vec3 Nmap = texture2D( mTextureN, vUV ).rgb;
    
    //modify with original surface normal
    const vec3 Ndirection = vec3(0.0, 1.0, 0.0);
    vec3 Nfinal = vNormalMatrix * normalize(vNormal + Nmap - Ndirection);
    
    //falloff
    float falloff = sin( max( dot( Nfinal, vec3(0.25, 1.0, 0.25) ), 0.0) * 2.25);
    float alphaFO = 0.01 + (0.3 * pow(falloff, 25.0));
    float alpha = mix(alphaFO, 1.0, mAlpha);
    //alpha = (alphaFO > 0.0) ? alpha : 1.0; alpha is not zero
    
    gl_FragColor = vec4(dry * mColor, alpha);
}