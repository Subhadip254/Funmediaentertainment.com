import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// ─── Neutral Premium Lights for correct GLB material rendering ────────────────
function SceneLights() {
  return (
    <>
      {/* Soft fill ambient lighting */}
      <ambientLight intensity={1.2} color="#f0f6ff" />

      {/* Main key directional light with shadows */}
      <directionalLight
        position={[8, 12, 10]}
        intensity={2.8}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* Subtle fill directional light from front-left */}
      <directionalLight
        position={[-10, 5, 5]}
        intensity={1.0}
        color="#e0f2fe"
      />

      {/* Cyan accent rim light at the back-left */}
      <pointLight
        position={[-6, 4, -4]}
        intensity={3.0}
        distance={20}
        color="#38cfff"
      />

      {/* Purple accent rim light at the back-right */}
      <pointLight
        position={[6, -4, -4]}
        intensity={2.5}
        distance={20}
        color="#d946ef"
      />

      {/* Warm soft light at the front-bottom */}
      <pointLight
        position={[0, -5, 5]}
        intensity={1.2}
        distance={15}
        color="#ffedd5"
      />
    </>
  );
}

interface MouseState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  isOutside: boolean;
}

// ─── GLB Star Model Component ──────────────────────────────────────────────────
function StarModel({ mouseRef }: { mouseRef: React.RefObject<MouseState> }) {
  const { scene } = useGLTF("/cute_little_star.glb");
  const modelRef = useRef<THREE.Group>(null);
  
  // Ref to accumulate continuous idle rotation over time
  const idleRotY = useRef(0);

  // Auto-calculate bounding box, pivot offset and scale
  const { center, scale, clonedScene } = useMemo(() => {
    // Clone scene to prevent mutating the original cache asset
    const cloned = scene.clone();
    
    const box = new THREE.Box3().setFromObject(cloned);
    const centerVec = new THREE.Vector3();
    box.getCenter(centerVec);
    const sizeVec = new THREE.Vector3();
    box.getSize(sizeVec);
    
    // Scale model proportionally to a target size of 2.2 units
    const maxDim = Math.max(sizeVec.x, sizeVec.y, sizeVec.z);
    const targetSize = 2.2;
    const scaleVal = targetSize / (maxDim || 1);
    
    // Enable shadows for all mesh children
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Ensure standard materials look smooth and correct
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          mesh.material.side = THREE.DoubleSide;
        }
      }
    });

    return { center: centerVec, scale: scaleVal, clonedScene: cloned };
  }, [scene]);

  // Read viewport size for responsive layout positioning
  const { width: viewportWidth, height: viewportHeight } = useThree((state) => state.viewport);
  const { size } = useThree();
  
  // Responsive design breakpoints
  const isMobile = size.width < 768;
  const isTablet = size.width >= 768 && size.width < 1024;

  useFrame((state, delta) => {
    if (!modelRef.current) return;

    const t = state.clock.elapsedTime;
    const mouse = mouseRef.current;

    // 1. Damped interpolation for coordinates (lerp)
    // Low factor gives elegant delayed inertia (delayed cursor reaction)
    mouse.x += (mouse.targetX - mouse.x) * 0.04;
    mouse.y += (mouse.targetY - mouse.y) * 0.04;

    // 2. Idle animations: slow floating and subtle rocking
    const idleY = Math.sin(t * 0.8) * 0.12;      // slow float vertical
    const idleX = Math.cos(t * 0.6) * 0.05;      // slow float horizontal
    const idleZ = Math.sin(t * 0.5) * 0.08;      // slow float depth
    
    const idleRotX = Math.sin(t * 0.4) * 0.06;   // rocking X
    const idleRotZ = Math.cos(t * 0.3) * 0.04;   // rocking Z
    
    // Smooth cumulative rotation (360 degrees spin)
    idleRotY.current += delta * 0.12;

    // 3. Responsive Positioning
    // Desktop: aligns with the right column (approx 22% of viewport width)
    // Tablet: aligns with the right column (approx 18% of viewport width)
    // Mobile: centers horizontally, positioned below the hero text/buttons
    let defaultX = viewportWidth * 0.22;
    let defaultY = 0;
    let baseScale = scale;

    if (isMobile) {
      defaultX = 0;
      defaultY = -viewportHeight * 0.18;
      baseScale = scale * 0.72; // scale down on mobile to prevent clipping
    } else if (isTablet) {
      defaultX = viewportWidth * 0.18;
      defaultY = 0;
      baseScale = scale * 0.88; // scale down slightly on tablet
    }

    // 4. Combine Idle and Cursor follow (parallax translation)
    // X cursor -> Y rotation + subtle X position translation
    // Y cursor -> X rotation + subtle Y position translation
    const targetPosX = defaultX + idleX + mouse.x * 0.35;
    const targetPosY = defaultY + idleY + mouse.y * 0.25;
    const targetPosZ = idleZ;

    const targetRotX = idleRotX - mouse.y * 0.45;
    const targetRotY = idleRotY.current + mouse.x * 0.6;
    const targetRotZ = idleRotZ - mouse.x * 0.15; // subtle tilt on Y-axis spin

    // 5. Apply smooth damping (lerping) to the model group
    const g = modelRef.current;
    g.position.x += (targetPosX - g.position.x) * 0.05;
    g.position.y += (targetPosY - g.position.y) * 0.05;
    g.position.z += (targetPosZ - g.position.z) * 0.05;

    g.rotation.x += (targetRotX - g.rotation.x) * 0.05;
    g.rotation.y += (targetRotY - g.rotation.y) * 0.05;
    g.rotation.z += (targetRotZ - g.rotation.z) * 0.05;

    g.scale.x += (baseScale - g.scale.x) * 0.05;
    g.scale.y += (baseScale - g.scale.y) * 0.05;
    g.scale.z += (baseScale - g.scale.z) * 0.05;
  });

  return (
    <group ref={modelRef}>
      {/* Primitive is offset by its bounding box center to align the pivot point */}
      <primitive object={clonedScene} position={[-center.x, -center.y, -center.z]} />
    </group>
  );
}

export default function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track cursor position ref
  const mouseRef = useRef<MouseState>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    isOutside: true,
  });

  // Track cursor movements over the Hero section (Home section)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // The Canvas parent absolute container is inside the hero <section>
    const section = container.closest("section");
    if (!section) return;

    const handlePointerMove = (e: PointerEvent) => {
      // Use pointerType check to gracefully ignore touch/stylus inputs if desired,
      // or track all pointers. The instructions allow supporting devices without mouse inputs
      // by retaining the subtle idle floating animation without breaking.
      const rect = section.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      mouseRef.current.targetX = Math.max(-1, Math.min(1, x));
      mouseRef.current.targetY = Math.max(-1, Math.min(1, y));
      mouseRef.current.isOutside = false;
    };

    const handlePointerLeave = () => {
      // Smoothly return target to default center on leave
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
      mouseRef.current.isOutside = true;
    };

    section.addEventListener("pointermove", handlePointerMove);
    section.addEventListener("pointerleave", handlePointerLeave);

    // Track window focus/exit to reset position
    window.addEventListener("pointerout", (e) => {
      if (e.target === document || e.target === document.documentElement) {
        handlePointerLeave();
      }
    });

    return () => {
      section.removeEventListener("pointermove", handlePointerMove);
      section.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4.5], fov: 40 }}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          premultipliedAlpha: false,
        }}
        style={{ pointerEvents: "none" }}
      >
        <SceneLights />
        <StarModel mouseRef={mouseRef} />
      </Canvas>
    </div>
  );
}

// Preload the model file
useGLTF.preload("/cute_little_star.glb");
