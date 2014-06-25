varying vec3 vNormal; //this is not nothing
varying mat3 vNormalMatrix; //this is not nothing
varying vec2 vUV; //can't be nothing because dry texture works
 
uniform vec3 mColor;
uniform float mAlpha;
uniform float mAmplitude;

uniform sampler2D mTexture;
uniform sampler2D mTextureN;
 
void main(void) {
    //dry texture
    vec3 dry = texture2D(mTexture, vUV.xy).rgb; //wonder if I modulated by transformed vector?
    
    //get normal from texture
    vec3 Nmap = texture2D( mTextureN, vUV.xy ).rgb; //this is not nothing
    
    //modify with original surface normal
    const vec3 Ndirection = vec3(0.0, 1.0, 0.0);
    vec3 Nfinal = vNormalMatrix * normalize(vNormal + Nmap - Ndirection); //this is not nothing
    
    //falloff
    float falloff = sin( max( dot( Nfinal, vec3(0.25, 1.0, 0.25) ), 0.0) * 2.25);
    //falloff varies with both amplitudes and with angle. never > 0.023
    float alphaFO = 0.01 + (0.3 * pow(falloff, 5.0)); //* pow(falloff, 25.0));
    float alpha = mix(alphaFO, 1.0, mAlpha);
    
    
    
    gl_FragColor = vec4(dry * mColor, alpha);
    //if (pow(falloff, 1.0) > 0.05) gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
}