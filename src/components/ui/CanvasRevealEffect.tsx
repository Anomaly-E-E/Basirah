import { useEffect, useMemo, useRef, useState, forwardRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export interface Uniforms {
  u_time: { value: number };
  u_resolution: { value: THREE.Vector2 };
  u_reverse: { value: number };
}

export interface ShaderProps {
  uniforms: Uniforms;
}

export interface DotMatrixProps {
  reverse?: boolean;
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform int u_reverse;

  const float PHI = 1.61803398875;

  float random(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233 * PHI))) * 43758.5453123);
  }

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    float aspect = u_resolution.x / u_resolution.y;
    st.x *= aspect;

    float gridSize = 80.0;
    vec2 grid = fract(st * gridSize);
    vec2 gridId = floor(st * gridSize);

    float dist = length(grid - 0.5);
    float dot = smoothstep(0.14, 0.09, dist);

    vec2 center = vec2(aspect * 0.5, 0.5);
    vec2 gridCenter = gridId / gridSize;
    float distFromCenter = length(gridCenter - center) / length(vec2(aspect, 1.0));

    float rnd = random(gridId) * 0.5;
    float timeOffset = rnd * 1.5;

    // Random brightness flicker per dot
    float flicker = 0.5 + 0.5 * sin(u_time * (1.5 + random(gridId * 3.7) * 4.0) + random(gridId * 2.1) * 6.28);

    float reveal;
    if (u_reverse == 1) {
      float revT = u_time * 0.8;
      reveal = smoothstep(distFromCenter + timeOffset + 0.3, distFromCenter + timeOffset, revT);
      reveal = 1.0 - reveal;
    } else {
      // Quick reveal then stay fully visible so flicker runs forever
      float fwdT = u_time * 1.2;
      reveal = smoothstep(distFromCenter + timeOffset + 0.2, distFromCenter + timeOffset, fwdT);
      reveal = max(reveal, step(3.0, u_time));
    }

    float alpha = dot * reveal * flicker * 0.45;
    gl_FragColor = vec4(vec3(0.7), alpha);
  }
`;

const ShaderMaterial = forwardRef<THREE.Mesh, ShaderProps>(function ShaderMaterial(
  { uniforms },
  ref,
) {
  const { viewport } = useThree();

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
        depthWrite: false,
      }),
    [uniforms],
  );

  return (
    <mesh ref={ref} material={material} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
});

const Shader = forwardRef<THREE.Mesh, ShaderProps>(function Shader(props, ref) {
  return <ShaderMaterial ref={ref} {...props} />;
});

function DotMatrix({ reverse = false }: DotMatrixProps) {
  const uniformsRef = useRef<Uniforms>({
    u_time: { value: 0 },
    u_resolution: { value: new THREE.Vector2(1, 1) },
    u_reverse: { value: 0 },
  });

  useEffect(() => {
    uniformsRef.current.u_reverse.value = reverse ? 1 : 0;
    uniformsRef.current.u_time.value = 0;
  }, [reverse]);

  useFrame(({ gl }, delta) => {
    const size = gl.getSize(new THREE.Vector2());
    uniformsRef.current.u_resolution.value.set(
      size.x * gl.getPixelRatio(),
      size.y * gl.getPixelRatio(),
    );
    uniformsRef.current.u_time.value += delta;
  });

  return <Shader uniforms={uniformsRef.current} />;
}

export function CanvasRevealEffect({ reverse = false }: DotMatrixProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setRevealed(!reverse);
    });

    return () => cancelAnimationFrame(frame);
  }, [reverse]);

  return (
    <div className="absolute inset-0 z-0 h-full w-full overflow-hidden" style={{ minHeight: "100vh" }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "#000",
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.18) 1.2px, transparent 1.2px)",
          backgroundSize: "10px 10px",
          backgroundPosition: "center center",
          clipPath: revealed ? "circle(110vmax at 50% 50%)" : "circle(0vmax at 50% 50%)",
          transition: "clip-path 1800ms cubic-bezier(0.22, 1, 0.36, 1)",
          opacity: 0.4,
        }}
      />

      <Canvas
        orthographic
        camera={{ zoom: 1, position: [0, 0, 1] }}
        dpr={[1, 2]}
        style={{ background: "transparent", width: "100%", height: "100%" }}
        gl={{ alpha: true, antialias: true }}
      >
        <DotMatrix reverse={reverse} />
      </Canvas>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.28) 42%, rgba(0,0,0,0.12) 72%, transparent 100%)",
        }}
      />
    </div>
  );
}

export default CanvasRevealEffect;
