"use client";

import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  OrbitControls,
  RoundedBox,
} from "@react-three/drei";

import * as THREE from "three";

/* Messaggio alternativo in caso di problemi con il renderer. */
function SceneFallback() {
  return (
    <div className="flex h-full items-center justify-center p-8 text-center text-sm text-white/50">
      Anteprima 3D non disponibile su questo dispositivo.
      Il resto del sito rimane accessibile.
    </div>
  );
}

class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? <SceneFallback /> : this.props.children;
  }
}

/* Anteprima grafica disegnata localmente:
   non richiede immagini o modelli da scaricare. */
function useScreenTexture() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");

    canvas.width = 720;
    canvas.height = 1440;

    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    ctx.fillStyle = "#07070c";
    ctx.fillRect(0, 0, 720, 1440);

    const glow = ctx.createRadialGradient(
      580,
      450,
      0,
      580,
      450,
      600
    );

    glow.addColorStop(0, "rgba(124,58,237,0.6)");
    glow.addColorStop(1, "rgba(124,58,237,0)");

    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 720, 1440);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px Arial";
    ctx.fillText("LORENZO PIRAS.", 48, 140);

    ctx.fillStyle = "#9da0b3";
    ctx.font = "18px Arial";
    ctx.fillText("INDEPENDENT WEB DESIGNER", 48, 205);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 90px Arial";
    ctx.fillText("Beyond", 48, 400);
    ctx.fillText("ordinary.", 48, 505);

    ctx.fillStyle = "#bca3ff";
    ctx.font = "26px Arial";
    ctx.fillText("Bespoke digital experiences.", 48, 585);

    const cardGradient = ctx.createLinearGradient(
      48,
      700,
      672,
      1100
    );

    cardGradient.addColorStop(0, "#7c3aed");
    cardGradient.addColorStop(1, "#0c324f");

    ctx.fillStyle = cardGradient;
    ctx.fillRect(48, 700, 624, 400);

    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 2;

    for (let index = 0; index < 9; index += 1) {
      ctx.beginPath();
      ctx.ellipse(
        360,
        900,
        65 + index * 20,
        135,
        index * 0.15,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 38px Arial";
    ctx.fillText("Designed to be different.", 48, 1200);

    ctx.fillStyle = "#a1a1ad";
    ctx.font = "22px Arial";
    ctx.fillText("Design. Development. Motion.", 48, 1260);

    const result = new THREE.CanvasTexture(canvas);

    result.colorSpace = THREE.SRGBColorSpace;
    result.anisotropy = 4;

    return result;
  }, []);

  useEffect(() => {
    return () => {
      texture?.dispose();
    };
  }, [texture]);

  return texture;
}

function Phone({ reducedMotion }: { reducedMotion: boolean }) {
  const phone = useRef<THREE.Group>(null);
  const texture = useScreenTexture();

  useFrame((state, delta) => {
    if (!phone.current || reducedMotion) return;

    const time = state.clock.elapsedTime;
    const smoothing = 1 - Math.exp(-3 * Math.min(delta, 0.05));

    phone.current.position.y = Math.sin(time * 0.85) * 0.1;

    const targetY = -0.22 + state.pointer.x * 0.18;
    const targetX = 0.06 - state.pointer.y * 0.09;

    phone.current.rotation.y = THREE.MathUtils.lerp(
      phone.current.rotation.y,
      targetY,
      smoothing
    );

    phone.current.rotation.x = THREE.MathUtils.lerp(
      phone.current.rotation.x,
      targetX,
      smoothing
    );
  });

  return (
    <group ref={phone} rotation={[0.06, -0.22, -0.06]}>
      {/* Telaio metallico */}
      <RoundedBox
        args={[2.12, 4.38, 0.24]}
        radius={0.1}
        smoothness={6}
      >
        <meshPhysicalMaterial
          color="#777987"
          metalness={1}
          roughness={0.24}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1.5}
        />
      </RoundedBox>

      {/* Superficie frontale */}
      <RoundedBox
        args={[2.01, 4.26, 0.05]}
        radius={0.02}
        smoothness={6}
        position={[0, 0, 0.135]}
      >
        <meshPhysicalMaterial
          color="#050508"
          roughness={0.17}
          clearcoat={1}
        />
      </RoundedBox>

      {/* Anteprima simulata, non un sito navigabile */}
      {texture && (
        <mesh position={[0, 0, 0.164]}>
          <planeGeometry args={[1.88, 3.98]} />

          <meshBasicMaterial
            map={texture}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* Dynamic island */}
      <RoundedBox
        args={[0.61, 0.15, 0.025]}
        radius={0.01}
        smoothness={4}
        position={[0, 1.87, 0.19]}
      >
        <meshBasicMaterial color="#020203" />
      </RoundedBox>

      {/* Fotocamera frontale */}
      <mesh position={[0.2, 1.87, 0.207]}>
        <circleGeometry args={[0.035, 24]} />

        <meshStandardMaterial
          color="#102440"
          metalness={0.75}
          roughness={0.1}
        />
      </mesh>

      {/* Tasto di accensione */}
      <RoundedBox
        args={[0.05, 0.5, 0.1]}
        radius={0.02}
        position={[1.075, 0.5, 0]}
      >
        <meshStandardMaterial
          color="#8c8d97"
          metalness={1}
          roughness={0.25}
        />
      </RoundedBox>

      {/* Tasti volume */}
      {[0.7, 0.15].map((y) => (
        <RoundedBox
          key={y}
          args={[0.05, 0.32, 0.1]}
          radius={0.02}
          position={[-1.075, y, 0]}
        >
          <meshStandardMaterial
            color="#8c8d97"
            metalness={1}
            roughness={0.25}
          />
        </RoundedBox>
      ))}

      {/* Pannello posteriore */}
      <RoundedBox
        args={[1.99, 4.25, 0.04]}
        radius={0.018}
        position={[0, 0, -0.13]}
      >
        <meshPhysicalMaterial
          color="#22232b"
          metalness={0.45}
          roughness={0.38}
          clearcoat={1}
        />
      </RoundedBox>
    </group>
  );
}

export default function PhoneScene() {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const preference = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const update = () => setReducedMotion(preference.matches);

    update();
    setMounted(true);

    preference.addEventListener("change", update);

    return () => {
      preference.removeEventListener("change", update);
    };
  }, []);

  return (
    <div className="relative mt-14">
      <div
        role="img"
        aria-label="Telefono 3D con anteprima grafica di un sito Lorenzo Piras"
        className="relative h-[480px] overflow-hidden rounded-[32px] border border-white/10 bg-[#07070c] sm:h-[600px]"
      >
        {mounted ? (
          <SceneBoundary>
            <Canvas
              dpr={[1, 2]}
              frameloop={reducedMotion ? "demand" : "always"}
              camera={{
                position: [0, 0, 8.5],
                fov: 38,
                near: 0.1,
                far: 50,
              }}
              gl={{
                antialias: true,
                alpha: true,
                powerPreference: "high-performance",
              }}
              fallback={<SceneFallback />}
            >
              <ambientLight intensity={0.7} />

              <directionalLight
                position={[3, 4, 5]}
                intensity={3}
                color="#e9e5ff"
              />

              <pointLight
                position={[-3, 0, 3]}
                intensity={18}
                color="#8b5cf6"
              />

              <Suspense fallback={null}>
                {/* Studio locale: nessun HDRI esterno da caricare. */}
                <Environment resolution={128} frames={1}>
                  <Lightformer
                    position={[-3, 1, 3]}
                    rotation={[0, Math.PI / 4, 0]}
                    scale={[2, 6, 1]}
                    intensity={4}
                    color="#c4b5fd"
                  />

                  <Lightformer
                    position={[3, 0, 2]}
                    rotation={[0, -Math.PI / 4, 0]}
                    scale={[2, 5, 1]}
                    intensity={3}
                    color="#7dd3fc"
                  />
                </Environment>

                <Phone reducedMotion={reducedMotion} />
              </Suspense>

              <OrbitControls
                enableZoom={false}
                enablePan={false}
                enableDamping
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={(Math.PI * 2) / 3}
              />
            </Canvas>
          </SceneBoundary>
        ) : (
          <div className="grid h-full place-items-center text-sm text-white/40">
            Preparazione anteprima…
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-xs tracking-wide text-white/40">
        Trascina per esplorare il modello · Anteprima grafica dimostrativa
      </p>
    </div>
  );
}