import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ============================================================
// WAVE HEIGHT-FIELD SIMULATION (ping-pong FBO)
// Solves the 2D wave PDE: h(t+1) = 2h(t) - h(t-1) + c²·∇²h
// R = current height, G = previous height, B = cursor trail glow
// ============================================================
const simVertexShader = `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const simFragmentShader = `
  precision highp float;
  uniform sampler2D uPrev;
  uniform vec2  uRes;
  uniform vec2  uMouse;
  uniform float uMouseRadius;
  uniform float uMouseStrength;
  uniform float uClickActive;
  uniform vec2  uClickPos;
  uniform float uClickStrength;
  uniform float uDamping;
  // droplet sources (up to 6)
  uniform vec2  uDroplets[6];
  uniform float uDropletActive;
  varying vec2 vUv;

  void main() {
    vec2 px = 1.0 / uRes;

    // Sample 5-point stencil for Laplacian
    float hC  = texture2D(uPrev, vUv                       ).r;
    float hN  = texture2D(uPrev, vUv + vec2(0.0,  px.y)   ).r;
    float hS  = texture2D(uPrev, vUv - vec2(0.0,  px.y)   ).r;
    float hE  = texture2D(uPrev, vUv + vec2(px.x,  0.0)   ).r;
    float hW  = texture2D(uPrev, vUv - vec2(px.x,  0.0)   ).r;
    float hPrev = texture2D(uPrev, vUv).g;

    // Wave equation step
    float laplacian = hN + hS + hE + hW - 4.0 * hC;
    float hNext = (2.0 * hC - hPrev + 0.42 * laplacian) * uDamping;

    // Trail channel
    float trail = texture2D(uPrev, vUv).b * 0.968;

    // Mouse creates a dimple / surface disturbance
    if (uMouse.x > 0.0) {
      float d = distance(vUv, uMouse);
      if (d < uMouseRadius) {
        float f = smoothstep(uMouseRadius, 0.0, d);
        hNext  += f * uMouseStrength;
        trail  += f * 0.35;
      }
    }

    // Click expanding ripple splash
    if (uClickActive > 0.5) {
      float d = distance(vUv, uClickPos);
      if (d < 0.12) {
        float f = smoothstep(0.12, 0.0, d);
        hNext += f * uClickStrength;
        trail += f * 0.6;
      }
    }

    // Droplet point sources
    if (uDropletActive > 0.5) {
      for (int i = 0; i < 6; i++) {
        if (uDroplets[i].x < 0.0) continue;
        float d = distance(vUv, uDroplets[i]);
        if (d < 0.018) {
          float f = smoothstep(0.018, 0.0, d);
          hNext += f * 0.22;
        }
      }
    }

    hNext = clamp(hNext, -3.5, 3.5);
    trail = clamp(trail, 0.0, 1.0);
    gl_FragColor = vec4(hNext, hC, trail, 1.0);
  }
`;

// ============================================================
// WATER NORMAL MAP (reads height field, outputs normals)
// ============================================================
const normalVertexShader = `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const normalFragmentShader = `
  precision highp float;
  uniform sampler2D uHeight;
  uniform vec2 uRes;
  uniform float uNormalStrength;
  varying vec2 vUv;

  void main() {
    vec2 px = 1.0 / uRes;
    float hL = texture2D(uHeight, vUv - vec2(px.x, 0.0)).r;
    float hR = texture2D(uHeight, vUv + vec2(px.x, 0.0)).r;
    float hD = texture2D(uHeight, vUv - vec2(0.0, px.y)).r;
    float hU = texture2D(uHeight, vUv + vec2(0.0, px.y)).r;
    // Surface normal from finite differences
    vec3 N = normalize(vec3((hL - hR) * uNormalStrength, (hD - hU) * uNormalStrength, 1.0));
    // Pack to [0,1]
    gl_FragColor = vec4(N * 0.5 + 0.5, 1.0);
  }
`;

// ============================================================
// FINAL WATER RENDER SHADER
// Implements: refraction + specular + Fresnel + caustics + glow
// ============================================================
const waterVertexShader = `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const waterFragmentShader = `
  precision highp float;
  uniform float uTime;
  uniform vec2  uResolution;
  uniform sampler2D uNormal;
  uniform sampler2D uHeight;
  uniform vec2  uSmoothMouse;
  uniform float uMouseVelocity;
  varying vec2 vUv;

  // Ocean water colour gradient — deep dark blue theme
  vec3 waterColor(vec2 uv, float depth) {
    // Dark navy → midnight blue → deep teal → hint of cyan at crests only
    vec3 abyss   = vec3(0.004, 0.012, 0.055); // near-black deep blue
    vec3 deep    = vec3(0.006, 0.030, 0.115); // dark navy
    vec3 mid     = vec3(0.008, 0.065, 0.180); // deep ocean blue
    vec3 shallow = vec3(0.010, 0.120, 0.240); // mid ocean
    vec3 crest   = vec3(0.020, 0.220, 0.360); // crests: lighter blue-teal

    // Slow horizontal colour drift
    float drift  = sin(uv.x * 2.8 + uTime * 0.12) * 0.5 + 0.5;
    float drift2 = cos(uv.y * 1.9 - uTime * 0.09) * 0.5 + 0.5;

    vec3 col = mix(abyss, deep, clamp(drift * 0.5, 0.0, 1.0));
    col = mix(col, mid,     clamp(drift * 0.6  + depth * 0.55, 0.0, 1.0));
    col = mix(col, shallow, clamp(drift2 * 0.4 + depth * 0.40, 0.0, 1.0));
    col = mix(col, crest,   clamp(depth * 0.25, 0.0, 0.25));
    // Very subtle indigo tint in deep zones
    vec3 indigo = vec3(0.035, 0.018, 0.130);
    col = mix(col, indigo, clamp((1.0 - depth) * 0.22 * (1.0 - drift), 0.0, 0.22));
    return col;
  }

  // Caustic-like light pattern from height field
  float caustics(vec2 uv, vec3 N) {
    vec2 refUv = uv + N.xy * 0.07;
    float c1 = sin(refUv.x * 42.0 + uTime * 1.4) * cos(refUv.y * 35.0 - uTime * 1.0);
    float c2 = sin(refUv.x * 18.0 - uTime * 0.7) * cos(refUv.y * 22.0 + uTime * 0.8);
    float c = pow(max(c1, 0.0), 3.2) * 0.55 + pow(max(c2, 0.0), 3.0) * 0.30;
    return c;
  }

  // Glitter sparkle on wave peaks
  float sparkle(vec2 uv, vec3 N) {
    // Sharp micro-highlights from tiny facets
    float s = sin(uv.x * 120.0 + N.x * 8.0 + uTime * 2.5) *
              cos(uv.y * 95.0  + N.y * 8.0 - uTime * 2.0);
    return pow(max(s, 0.0), 6.0) * 0.5;
  }

  void main() {
    // Unpack normal from [0,1] to [-1,1]
    vec3 N = texture2D(uNormal, vUv).xyz * 2.0 - 1.0;
    float height = texture2D(uHeight, vUv).r; // wave amplitude
    float trail  = texture2D(uHeight, vUv).b; // cursor trail

    // --- Refraction ---
    // Offset the UV to simulate looking through a bent water surface
    float refrStr = 0.032 + abs(height) * 0.008;
    vec2 refrUv = vUv + N.xy * refrStr;
    refrUv = clamp(refrUv, 0.001, 0.999);

    // Depth approximation (thicker-looking near wave troughs)
    float depth = clamp(0.5 + height * 0.25, 0.0, 1.0);

    // Base water colour at refracted UV
    vec3 col = waterColor(refrUv, depth);

    // ============================================================
    // REFLECTIONS — multi-source lighting for vivid water shimmer
    // ============================================================
    vec3 viewDir = vec3(0.0, 0.0, 1.0);

    // --- Primary sun specular (top-centre, warm-white) ---
    vec3 sunDir  = normalize(vec3(0.10, 0.70, 1.0));
    vec3 halfSun = normalize(sunDir + viewDir);
    float specSun  = pow(max(dot(N, halfSun), 0.0), 42.0);
    float specSunS = pow(max(dot(N, halfSun), 0.0), 200.0); // razor highlight
    col += vec3(0.90, 0.96, 1.00) * (specSun * 0.28 + specSunS * 0.95);

    // --- Secondary fill light (left, blue sky reflection) ---
    vec3 skyDir  = normalize(vec3(-0.50, 0.40, 0.90));
    vec3 halfSky = normalize(skyDir + viewDir);
    float specSky = pow(max(dot(N, halfSky), 0.0), 28.0);
    col += vec3(0.25, 0.65, 1.00) * specSky * 0.42;

    // --- Third accent light (right-low, cyan shimmer) ---
    vec3 accDir  = normalize(vec3(0.55, -0.20, 0.85));
    vec3 halfAcc = normalize(accDir + viewDir);
    float specAcc = pow(max(dot(N, halfAcc), 0.0), 50.0);
    col += vec3(0.05, 0.75, 1.00) * specAcc * 0.30;

    // --- Fresnel rim: strong glowing rim along steep wave faces ---
    float NdotV  = max(dot(N, viewDir), 0.0);
    float fresnel = pow(1.0 - NdotV, 2.5);
    // Broad soft shimmer
    col += vec3(0.30, 0.72, 1.00) * fresnel * 0.55;
    // Razor-thin bright rim
    float fresnelEdge = pow(1.0 - NdotV, 6.0);
    col += vec3(0.70, 0.92, 1.00) * fresnelEdge * 0.90;

    // --- Sky reflection band: horizontal bright streak across mid-water ---
    float skyBand = smoothstep(0.38, 0.50, vUv.y) * smoothstep(0.70, 0.55, vUv.y);
    // Wobble with waves
    float skyWobble = skyBand * (0.5 + N.x * 0.5) * (0.5 + N.y * 0.5);
    col += vec3(0.35, 0.70, 1.00) * skyWobble * 0.55;
    // Sharp glare on the band peak
    float skyGlare = pow(skyBand, 3.0) * specSun * 1.8;
    col += vec3(0.80, 0.95, 1.00) * skyGlare;

    // --- Caustics — brighter, wider ---
    float caust = caustics(vUv, N);
    col += vec3(0.20, 0.65, 1.00) * caust * 0.55 * (0.5 + abs(height) * 0.8);

    // --- Micro-sparkle glitter on wave peaks ---
    float spark = sparkle(vUv, N);
    col += vec3(0.80, 0.95, 1.00) * spark * 0.70 * clamp(abs(height) * 0.8, 0.0, 1.0);

    // --- Cursor trail glow — bright blue-white ---
    col += vec3(0.40, 0.78, 1.00) * trail * 0.65;

    // --- Pointer proximity glow ---
    float aspect  = uResolution.x / uResolution.y;
    vec2 mouseUvc = (uSmoothMouse - 0.5) * vec2(aspect, 1.0);
    vec2 fragUvc  = (vUv - 0.5) * vec2(aspect, 1.0);
    float mdist = length(fragUvc - mouseUvc);
    float mglow = smoothstep(0.45, 0.0, mdist) * 0.20 * (1.0 + uMouseVelocity * 0.45);
    col += vec3(0.30, 0.75, 1.00) * mglow;

    // Vignette — dark edges, bright centre
    float vignette = smoothstep(1.0, 0.20, length((vUv - 0.5) * 1.7));
    col *= 0.30 + vignette * 0.70;

    // Dark floor minimum
    col = max(col, vec3(0.004, 0.012, 0.050));

    // Dark overlay for readability (slightly reduced so reflections show through)
    col = mix(col, col * 0.60, 0.30);

    gl_FragColor = vec4(col, 1.0);
  }
`;

// ============================================================
// REACT COMPONENT
// ============================================================
export function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Wave simulation FBO resolution: higher = more detail
    const SIM_RES = isMobile ? 256 : 512;

    let renderer: THREE.WebGLRenderer | null = null;
    let clock: THREE.Clock | null = null;
    let raf: number | null = null;

    // FBO ping-pong pair for wave height field
    let simA: THREE.WebGLRenderTarget | null = null;
    let simB: THREE.WebGLRenderTarget | null = null;
    // Normal map FBO
    let normalTarget: THREE.WebGLRenderTarget | null = null;

    // Shared scenes / cameras
    let simScene: THREE.Scene | null = null;
    let simCam: THREE.OrthographicCamera | null = null;
    let simMat: THREE.ShaderMaterial | null = null;

    let normalScene: THREE.Scene | null = null;
    let normalCam: THREE.OrthographicCamera | null = null;
    let normalMat: THREE.ShaderMaterial | null = null;

    let waterScene: THREE.Scene | null = null;
    let waterCam: THREE.OrthographicCamera | null = null;
    let waterMat: THREE.ShaderMaterial | null = null;

    const quad = new THREE.PlaneGeometry(2, 2);

    // Pointer state
    let tgtX = -1.0, tgtY = -1.0;
    let mX = -1.0, mY = -1.0;
    let smX = 0.5, smY = 0.5;
    let lastX = -1.0, lastY = -1.0;
    let vel = 0.0;
    let clickPending = false, cX = 0.5, cY = 0.5;
    let isTabActive = true;

    // Droplet spawning state
    const MAX_DROPLETS = 6;
    const dropletPos: number[] = new Array(MAX_DROPLETS * 2).fill(-1.0);
    let dropletTimer = 0.0;
    let dropletActive = false;

    try {
      // ---- Renderer ----
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(dpr);
      renderer.setSize(window.innerWidth, window.innerHeight, true);
      renderer.setClearColor(0x010612, 1);

      const canvas = renderer.domElement;
      canvas.style.cssText =
        "position:absolute;top:0;left:0;width:100%;height:100%;display:block;pointer-events:none;";
      if (!containerRef.current) throw new Error("No container");
      containerRef.current.appendChild(canvas);

      // ---- FBO factory ----
      const makeTarget = (w: number, h: number, fp: boolean = false) =>
        new THREE.WebGLRenderTarget(w, h, {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          format: THREE.RGBAFormat,
          type: fp ? THREE.HalfFloatType : THREE.UnsignedByteType,
          depthBuffer: false,
        });

      simA = makeTarget(SIM_RES, SIM_RES, true);
      simB = makeTarget(SIM_RES, SIM_RES, true);
      normalTarget = makeTarget(SIM_RES, SIM_RES, false);
      renderer.setRenderTarget(simA); renderer.clear();
      renderer.setRenderTarget(simB); renderer.clear();
      renderer.setRenderTarget(null);

      // ---- Simulation scene ----
      simScene = new THREE.Scene();
      simCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      simMat = new THREE.ShaderMaterial({
        vertexShader: simVertexShader,
        fragmentShader: simFragmentShader,
        uniforms: {
          uPrev: { value: null },
          uRes: { value: new THREE.Vector2(SIM_RES, SIM_RES) },
          uMouse: { value: new THREE.Vector2(-1, -1) },
          uMouseRadius: { value: isMobile ? 0.09 : 0.055 },
          uMouseStrength: { value: 0.20 },
          uClickActive: { value: 0 },
          uClickPos: { value: new THREE.Vector2(0.5, 0.5) },
          uClickStrength: { value: 0.85 },
          uDamping: { value: 0.984 },
          uDroplets: { value: dropletPos },
          uDropletActive: { value: 0 },
        },
        depthTest: false, depthWrite: false,
      });
      simScene.add(new THREE.Mesh(quad, simMat));

      // ---- Normal map scene ----
      normalScene = new THREE.Scene();
      normalCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      normalMat = new THREE.ShaderMaterial({
        vertexShader: normalVertexShader,
        fragmentShader: normalFragmentShader,
        uniforms: {
          uHeight: { value: null },
          uRes: { value: new THREE.Vector2(SIM_RES, SIM_RES) },
          uNormalStrength: { value: isMobile ? 2.8 : 4.5 },
        },
        depthTest: false, depthWrite: false,
      });
      normalScene.add(new THREE.Mesh(quad, normalMat));

      // ---- Water render scene ----
      waterScene = new THREE.Scene();
      waterCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      waterMat = new THREE.ShaderMaterial({
        vertexShader: waterVertexShader,
        fragmentShader: waterFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          uNormal: { value: null },
          uHeight: { value: null },
          uSmoothMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uMouseVelocity: { value: 0 },
        },
        depthTest: false, depthWrite: false,
      });
      waterScene.add(new THREE.Mesh(quad, waterMat));

      clock = new THREE.Clock();

      // ---- Event listeners ----
      const onMove = (e: PointerEvent) => {
        tgtX = e.clientX / window.innerWidth;
        tgtY = 1.0 - e.clientY / window.innerHeight;
      };
      const onLeave = () => { tgtX = -1; tgtY = -1; };
      const onDown = (e: PointerEvent) => {
        cX = e.clientX / window.innerWidth;
        cY = 1.0 - e.clientY / window.innerHeight;
        clickPending = true;
      };
      const onVisibility = () => { isTabActive = !document.hidden; };
      const onResize = () => {
        if (!renderer || !waterMat) return;
        renderer.setSize(window.innerWidth, window.innerHeight, true);
        waterMat.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
      document.addEventListener("pointerleave", onLeave);
      window.addEventListener("pointerdown", onDown, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      window.addEventListener("resize", onResize);

      // ---- Animation loop ----
      let curSim = simA!;
      let prevSim = simB!;

      const animate = () => {
        raf = requestAnimationFrame(animate);
        if (!isTabActive || !renderer || !clock) return;

        const dt = Math.min(clock.getDelta(), 0.05);
        const T = prefersReduced ? dt * 0.12 : dt;
        waterMat!.uniforms.uTime.value += T;
        dropletTimer -= dt;

        // ---- Smooth mouse interpolation ----
        if (tgtX >= 0) {
          if (mX < 0) {
            mX = tgtX; mY = tgtY;
            smX = tgtX; smY = tgtY;
            lastX = tgtX; lastY = tgtY;
          } else {
            lastX = mX; lastY = mY;
            mX = THREE.MathUtils.lerp(mX, tgtX, 0.20);
            mY = THREE.MathUtils.lerp(mY, tgtY, 0.20);
            smX = THREE.MathUtils.lerp(smX, tgtX, 0.055);
            smY = THREE.MathUtils.lerp(smY, tgtY, 0.055);
            const dx = mX - lastX, dy = mY - lastY;
            const d = Math.sqrt(dx * dx + dy * dy);
            vel = vel * 0.82 + d * 0.18;
          }

          // Spawn droplets around fast-moving cursor
          if (vel > 0.004 && dropletTimer <= 0) {
            dropletTimer = 0.08 + Math.random() * 0.12;
            const spread = 0.04 + vel * 0.5;
            for (let i = 0; i < MAX_DROPLETS; i++) {
              const angle = Math.random() * Math.PI * 2;
              const r = spread * (0.3 + Math.random() * 0.7);
              dropletPos[i * 2] = mX + Math.cos(angle) * r;
              dropletPos[i * 2 + 1] = mY + Math.sin(angle) * r;
            }
            dropletActive = true;
          } else if (dropletTimer > 0) {
            dropletActive = false;
          }
        } else {
          mX = -1; mY = -1;
          vel *= 0.88;
          smX = THREE.MathUtils.lerp(smX, 0.5, 0.022);
          smY = THREE.MathUtils.lerp(smY, 0.5, 0.022);
          dropletActive = false;
        }

        // ---- Sim step ----
        simMat!.uniforms.uPrev.value = prevSim.texture;
        simMat!.uniforms.uMouse.value.set(mX, mY);
        simMat!.uniforms.uMouseStrength.value = 0.14 + vel * 0.8;
        simMat!.uniforms.uDroplets.value = dropletPos;
        simMat!.uniforms.uDropletActive.value = dropletActive ? 1 : 0;
        if (clickPending) {
          simMat!.uniforms.uClickActive.value = 1;
          simMat!.uniforms.uClickPos.value.set(cX, cY);
          clickPending = false;
        } else {
          simMat!.uniforms.uClickActive.value = 0;
        }
        renderer.setRenderTarget(curSim);
        renderer.render(simScene!, simCam!);

        // ---- Normal pass ----
        normalMat!.uniforms.uHeight.value = curSim.texture;
        renderer.setRenderTarget(normalTarget!);
        renderer.render(normalScene!, normalCam!);

        // ---- Water render ----
        waterMat!.uniforms.uNormal.value = normalTarget!.texture;
        waterMat!.uniforms.uHeight.value = curSim.texture;
        waterMat!.uniforms.uSmoothMouse.value.set(smX, smY);
        waterMat!.uniforms.uMouseVelocity.value = Math.min(vel * 22, 3.0);
        renderer.setRenderTarget(null);
        renderer.render(waterScene!, waterCam!);

        // Ping-pong swap
        const tmp = curSim; curSim = prevSim; prevSim = tmp;
      };

      animate();

      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerleave", onLeave);
        document.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("pointerdown", onDown);
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("resize", onResize);
        if (raf) cancelAnimationFrame(raf);
        quad.dispose();
        simMat?.dispose();
        normalMat?.dispose();
        waterMat?.dispose();
        simA?.dispose();
        simB?.dispose();
        normalTarget?.dispose();
        if (renderer) {
          renderer.dispose();
          canvas.parentNode?.removeChild(canvas);
        }
      };
    } catch (err) {
      console.warn("WebGL unavailable, using CSS fallback:", err);
      setWebglSupported(false);
    }
  }, []);

  if (!webglSupported) {
    return (
      <div
        className="fixed inset-0 -z-10 overflow-hidden"
        style={{ pointerEvents: "none", background: "#010612" }}
      >
        <div
          style={{
            position: "absolute",
            inset: "-20%",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at 30% 40%, #004e6e 0%, transparent 55%), " +
              "radial-gradient(ellipse at 75% 65%, #003058 0%, transparent 55%)",
            filter: "blur(80px)",
            opacity: 0.8,
            animation: "pulse 14s ease-in-out infinite alternate",
            pointerEvents: "none",
          }}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ pointerEvents: "none", background: "#010612" }}
    />
  );
}
