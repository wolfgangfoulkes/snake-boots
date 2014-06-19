#extension GL_OES_standard_derivatives : enable

varying vec2 vUV;

uniform sampler2D mTexture;
uniform float mAmplitude;

float getDisplacement(float dx, float dy)
{
    return texture2D( mTexture, vUV.xy + vec2( dFdx(vUV.s) * dx, dFdy(vUV.t) * dy ) ).r;
    //applying dFdx to a position on a surface returns the tangent to that surface
}

void main()
{
    vec3 fragNormal;
    fragNormal.x = -0.5 * ( getDisplacement(1.0, 0.0) - getDisplacement(-1.0, 0.0) );
	fragNormal.z = -0.5 * ( getDisplacement(0.0, 1.0) - getDisplacement(0.0, -1.0) );
	fragNormal.y = 1.0 / mAmplitude;
	fragNormal = normalize(fragNormal);
    
    gl_FragColor = vec4( fragNormal, 1.0 );
}