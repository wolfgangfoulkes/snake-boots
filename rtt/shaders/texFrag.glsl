varying vec2 vUv;
 
uniform vec3 mColor;
uniform float mAlpha;
uniform sampler2D mTexture;
 
void main(void) {

    //dry texture
    vec3 dry = texture2D(mTexture, vUv.xy).rgb;
    
    gl_FragColor = vec4(dry * mColor, mAlpha);
}