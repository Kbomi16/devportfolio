export const DISTORT_VERTEX = /* glsl */ `
  uniform float uVelocity;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 p = position;
    p.y += sin(uv.x * 3.14159) * uVelocity * 18.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

export const DISTORT_FRAGMENT = /* glsl */ `
  uniform sampler2D uTex;
  uniform vec2 uPlane;
  uniform vec2 uImage;
  uniform float uFit;
  uniform vec3 uBg;
  uniform float uHover;
  uniform float uVelocity;
  uniform float uTime;
  uniform float uRadius;
  varying vec2 vUv;

  vec2 fitUv(vec2 uv) {
    float planeAspect = uPlane.x / uPlane.y;
    float imageAspect = uImage.x / uImage.y;
    vec2 scale = uFit < 0.5
      ? (planeAspect > imageAspect ? vec2(1.0, imageAspect / planeAspect) : vec2(planeAspect / imageAspect, 1.0))
      : (planeAspect > imageAspect ? vec2(planeAspect / imageAspect, 1.0) : vec2(1.0, imageAspect / planeAspect));
    return (uv - 0.5) * scale + 0.5;
  }

  // 카드의 둥근 윗모서리. Canvas는 DOM의 overflow 클립을 따르지 않는다
  float topCornerMask(vec2 uv) {
    vec2 p = (uv - 0.5) * uPlane;
    if (p.y < 0.0) return 1.0;
    vec2 q = abs(p) - uPlane * 0.5 + uRadius;
    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadius;
    return 1.0 - smoothstep(-1.0, 0.0, d);
  }

  void main() {
    vec2 uv = vUv;
    float amp = 0.012 * uHover + 0.02 * abs(uVelocity);
    uv.x += sin(uv.y * 12.0 + uTime * 2.0) * amp;
    uv.y += cos(uv.x * 10.0 + uTime * 1.6) * amp * 0.6;
    vec2 tuv = fitUv(uv);
    bool outside = any(lessThan(tuv, vec2(0.0))) || any(greaterThan(tuv, vec2(1.0)));
    vec4 color = outside ? vec4(uBg, 1.0) : texture2D(uTex, tuv);
    gl_FragColor = vec4(color.rgb, color.a * topCornerMask(vUv));
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`
