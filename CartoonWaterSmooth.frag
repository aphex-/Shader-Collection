const vec3 color1 = vec3(0.0, 0.5,  1.0);
const vec3 color2 = vec3(0.3,  0.7,  1.0);
const vec3 color3 = vec3(0.5,  0.8, 1.0);

const float animationSpeed = 20.0;

float scale = 1.0;

float patternHeight = 80.0 * scale;

float sinus1Amplitude = 15.0 * scale;
float sinus2Amplitude = 10.0 * scale;
float sinus3Amplitude = 10.0 * scale;

float sinus1Lambda = 40.0 * scale;
float sinus2Lambda = 30.0 * scale;
float sinus3Lambda = 33.0 * scale;

float sinus1Y = (patternHeight / 3.0) * 2.0  * scale;
float sinus2Y = (patternHeight / 3.0)  * scale;
float sinus3Y = 0.0;

float sinusYRandomFactor = 0.000002  * scale;

float sinus1Movement = -2.0  * scale;
float sinus2Movement =  2.3  * scale;
float sinus3Movement =  0.2  * scale;

float layer1Distance = 2.0  * scale;
float layer2Distance = 5.0  * scale;
float layer3Distance = 13.0 * scale;
float layer4Distance = 25.0 * scale;
float layer5Distance = 40.0 * scale;


float layerDarkenFactor = 0.1; // good for day night transformations..


/**
 * Drakens the assigned color by the assigned amount.
 */
vec3 darken(vec3 color, float amount) {
    return vec3(color.x - amount, color.y -amount, color.z - amount);
}

float rand(vec2 co){
    float rnd = fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    if(rnd < 0.35) {
        rnd = 0.35;
    }
    return rnd;
}


float getLayerColorFactor(float distance) {
   float factor = 1.0;
   
   factor -= layerDarkenFactor*smoothstep( -1.0, 1.0, distance-layer2Distance );
   factor -= layerDarkenFactor*smoothstep( -1.0, 1.0, distance-layer3Distance );
   factor -= layerDarkenFactor*smoothstep( -1.0, 1.0, distance-layer4Distance );
   factor -= layerDarkenFactor*smoothstep( -1.0, 1.0, distance-layer5Distance );
   factor = mix( factor, 1.3, 1.0-smoothstep( -1.0, 1.0, distance-layer1Distance ) );

   return factor;
}

void main(void)
{

    vec3 appliedColor = vec3(0.0, 0.0, 0.0);
    float tick = iGlobalTime * animationSpeed;
     
    float patternRelativeY  = mod(gl_FragCoord.y, patternHeight);
    float patternNumber = floor(gl_FragCoord.y /  patternHeight);
    bool isOddpattern = mod(gl_FragCoord.y  / patternHeight, 2.0) > 1.0; 
    
    float rnd =  rand(vec2(patternNumber, patternNumber));
    float rnd0 = rand(vec2(patternNumber - 1.0, patternNumber - 1.0));


    sinus1Movement *= tick * rnd;
    sinus2Movement *= tick * rnd;
    sinus3Movement *= tick;

    
    //sinus1Amplitude *= (rnd + 0.3);
    //sinus2Amplitude *= (rnd + 0.3);
    //sinus3Amplitude *= (rnd + 0.3);
    
    float sinus1 = sin( (gl_FragCoord.x + sinus1Movement) / sinus1Lambda) * sinus1Amplitude;
    float sinus2 = sin( (gl_FragCoord.x + sinus2Movement) / sinus2Lambda) * sinus2Amplitude;
    float sinus3 = sin( (gl_FragCoord.x + sinus3Movement) / sinus3Lambda) * sinus3Amplitude;
    

    // shift to pattern relative position
    sinus1 = sinus1 + sinus1Y + sin(tick / 8.0 * rnd) * 5.0 * rnd;
    sinus2 = sinus2 + sinus2Y + sin(tick / 10.0 * rnd) * 5.0 * rnd;
    sinus3 = sinus3 + sinus3Y;
    
    // expect to be in wave 1...
    appliedColor = color2;
    
    float f = patternRelativeY - sinus3-patternHeight;
    f = smoothstep( -1.0, 1.0, f );
    appliedColor = mix( appliedColor, color3*getLayerColorFactor(sinus3 + patternHeight - patternRelativeY), 1.0-f );
    
    f = patternRelativeY - sinus1;
    f = smoothstep( -1.0, 1.0, f );
    appliedColor = mix( appliedColor, color1*getLayerColorFactor(sinus1 - patternRelativeY), 1.0-f );
    
    f = patternRelativeY - sinus2;
    f = smoothstep( -1.0, 1.0, f );
    appliedColor = mix( appliedColor, color2*getLayerColorFactor(sinus2 - patternRelativeY), 1.0-f );

    f = patternRelativeY - sinus3;
    f = smoothstep( -1.0, 1.0, f );
    appliedColor = mix( appliedColor, color3*getLayerColorFactor(sinus3 - patternRelativeY), 1.0-f );
    
    gl_FragColor = vec4( appliedColor, 1.0 );
}




