varying vec2 vUv;
varying vec3 vecPos;
varying vec3 vecNormal;
 
uniform vec3 mColor;
uniform sampler2D mTexture;
 
void main(void) {

    gl_FragColor = vec4((texture2D(mTexture, vUv).rgb * mColor), 1.0);
}