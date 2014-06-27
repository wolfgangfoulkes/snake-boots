#extension GL_OES_standard_derivatives : enable

varying vec2 vUV;

uniform sampler2D mTexture;
uniform float mAmplitudeN;

float getDisplacement(float dx, float dy)
{
    float displacement = texture2D( mTexture, vUV.xy + vec2( dFdx(vUV.s) * dx, dFdy(vUV.t) * dy ) ).r;
    //applying dFdx to a position on a surface returns the tangent to that surface
    displacement *= 2.0;
    displacement -= 1.0;
    
    return displacement;
}

void main()
{
    vec3 fragNormal;
    fragNormal.x = -0.5 * ( getDisplacement(1.0, 0.0) - getDisplacement(-1.0, 0.0) );
	fragNormal.z = -0.5 * ( getDisplacement(0.0, 1.0) - getDisplacement(0.0, -1.0) );
	fragNormal.y = 1.0 / mAmplitudeN;
	fragNormal = normalize(fragNormal); //might wanna put this stuff in 0-1
    
    fragNormal.x = (fragNormal.x + 1.0) / 2.0;
    fragNormal.z = (fragNormal.z + 1.0) / 2.0;
    fragNormal.y = (fragNormal.y + 1.0) / 2.0;
    
    gl_FragColor = vec4( fragNormal, 1.0 );
}