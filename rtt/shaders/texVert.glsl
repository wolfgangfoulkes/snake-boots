/* default
            "uniform mat4 modelMatrix;",
            "uniform mat4 modelViewMatrix;",
            "uniform mat4 projectionMatrix;",
            "uniform mat4 viewMatrix;",
            "uniform mat3 normalMatrix;",
            "uniform vec3 cameraPosition;",

            "attribute vec3 position;",
            "attribute vec3 normal;",
            "attribute vec2 uv;",
            "attribute vec2 uv2;
            
            attribute vec3 color;
*/

varying vec2 vUv;

uniform vec3 mColor;
uniform float mAlpha;
 
void main() {
    vUv = uv;

    gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0);
}
