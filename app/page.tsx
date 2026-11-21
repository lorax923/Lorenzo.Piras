"use client";

import GlobalMotion from "./GlobalMotion";
import FinalContact from "./FinalContact";
import WorkstationStory from "./WorkstationStory";
import IntroPresentation from "./IntroPresentation";
import CinematicLayer from "./CinematicLayer";

import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

import { Canvas, useFrame } from "@react-three/fiber";

import {
  Environment,
  Lightformer,
} from "@react-three/drei";

import { motion, useReducedMotion } from "framer-motion";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import * as THREE from "three";

/* =========================================================
   CONTATTI
   ========================================================= */

const CALL = "tel:+393247484896";

const WHATSAPP =
  "https://wa.me/393247484896?text=Ciao%20Lorenzo%2C%20vorrei%20parlare%20del%20mio%20progetto.";

/* =========================================================
   STATO CONDIVISO DELLA SCENA
   Nessun aggiornamento React a ogni frame.
   ========================================================= */

type DevicePose = {
  x: number;
  y: number;
  rx: number;
  ry: number;
  rz: number;
  scale: number;
  explode: number;
  preview: number;
};

const START: DevicePose = {
  x: 0.24,
  y: 0,
  rx: 0.06,
  ry: -0.28,
  rz: -0.09,
  scale: 1,
  explode: 0,
  preview: 0,
};

const STOPS: DevicePose[] = [
  START,

  {
    x: -0.24,
    y: 0,
    rx: -0.06,
    ry: 0.34,
    rz: 0.12,
    scale: 0.96,
    explode: 0,
    preview: 0.34,
  },

  {
    x: 0.24,
    y: 0.02,
    rx: 0.12,
    ry: -0.34,
    rz: -0.12,
    scale: 1.02,
    explode: 0,
    preview: 0.68,
  },

  {
    x: -0.23,
    y: 0,
    rx: -0.12,
    ry: Math.PI - 0.3,
    rz: 0.12,
    scale: 0.95,
    explode: 0,
    preview: 0.85,
  },

  {
    x: 0.23,
    y: 0,
    rx: 0.1,
    ry: Math.PI * 2 - 0.6,
    rz: -0.12,
    scale: 0.86,
    explode: 0.85,
    preview: 1,
  },

  {
    x: -0.24,
    y: 0,
    rx: 0.03,
    ry: Math.PI * 2 + 0.2,
    rz: 0.06,
    scale: 0.9,
    explode: 0,
    preview: 1,
  },
];

/* =========================================================
   FALLBACK GRAFICO
   ========================================================= */

function SceneFallback() {
  return (
    <div className="studio-fallback">
      <div>
        <small>LORENZO PIRAS</small>
        <strong>
          Beyond
          <br />
          ordinary.
        </strong>
      </div>
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

/* =========================================================
   GEOMETRIA ARROTONDATA
   ========================================================= */

function makeShape(
  width: number,
  height: number,
  radius: number
) {
  const s = new THREE.Shape();

  const l = -width / 2;
  const r = width / 2;
  const b = -height / 2;
  const t = height / 2;

  s.moveTo(l + radius, b);
  s.lineTo(r - radius, b);
  s.quadraticCurveTo(r, b, r, b + radius);
  s.lineTo(r, t - radius);
  s.quadraticCurveTo(r, t, r - radius, t);
  s.lineTo(l + radius, t);
  s.quadraticCurveTo(l, t, l, t - radius);
  s.lineTo(l, b + radius);
  s.quadraticCurveTo(l, b, l + radius, b);
  s.closePath();

  return s;
}

function Shell({
  width,
  height,
  depth,
  radius,
  color,
  metalness = 0,
  roughness = 0.3,
  position = [0, 0, 0],
}: {
  width: number;
  height: number;
  depth: number;
  radius: number;
  color: string;
  metalness?: number;
  roughness?: number;
  position?: [number, number, number];
}) {
  const geometry = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(
      makeShape(width, height, radius),
      {
        depth,
        bevelEnabled: true,
        bevelSize: 0.009,
        bevelThickness: 0.009,
        bevelSegments: 3,
        curveSegments: 14,
        steps: 1,
      }
    );

    g.translate(0, 0, -depth / 2);

    return g;
  }, [width, height, depth, radius]);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  return (
    <mesh geometry={geometry} position={position}>
      <meshPhysicalMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
        clearcoat={1}
        clearcoatRoughness={0.1}
        envMapIntensity={1.5}
      />
    </mesh>
  );
}

/* =========================================================
   TRE SITI DIMOSTRATIVI IN UNA TEXTURE VERTICALE

   1. Atelier: editoriale / luxury.
   2. Forma: product design.
   3. Pulse: festival / creative.

   Nessuna immagine o font esterno richiesto.
   ========================================================= */

function useWebsiteAtlas() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");

    canvas.width = 720;
    canvas.height = 4320;

    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    function text(
      value: string,
      x: number,
      y: number,
      size: number,
      color: string,
      weight = "400",
      family = "Arial"
    ) {
      if (!ctx) return;

      ctx.fillStyle = color;
      ctx.font = `${weight} ${size}px ${family}`;
      ctx.fillText(value, x, y);
    }

    /* -----------------------------------------------------
       CONCEPT 01 — ATELIER
       ----------------------------------------------------- */

    ctx.fillStyle = "#e9e2d5";
    ctx.fillRect(0, 0, 720, 1440);

    text("ATELIER / 01", 48, 110, 25, "#26241f", "700");
    text("OBJECTS — SPACES — STORIES", 48, 180, 15, "#68645c");

    text("Quiet", 45, 345, 107, "#24231f", "400", "Georgia");
    text("by design.", 45, 460, 97, "#24231f", "400", "Georgia");

    text("A collection of considered forms.", 48, 535, 23, "#68645c");

    const warm = ctx.createLinearGradient(40, 620, 680, 1120);

    warm.addColorStop(0, "#b6a18b");
    warm.addColorStop(1, "#50453d");

    ctx.fillStyle = warm;
    ctx.fillRect(40, 620, 640, 500);

    ctx.save();
    ctx.translate(360, 890);

    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.ellipse(0, 145, 155, 35, 0, 0, Math.PI * 2);
    ctx.fill();

    const sculpture = ctx.createLinearGradient(-120, -170, 120, 170);

    sculpture.addColorStop(0, "#f3ead8");
    sculpture.addColorStop(0.5, "#bcb09a");
    sculpture.addColorStop(1, "#e6dcc8");

    ctx.fillStyle = sculpture;
    ctx.beginPath();
    ctx.ellipse(0, 0, 120, 170, 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#7a6b59";
    ctx.beginPath();
    ctx.ellipse(0, -5, 44, 90, 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    text("Collection No. 01", 48, 1215, 37, "#26241f", "400", "Georgia");
    text("Explore considered living  ↗", 48, 1290, 22, "#68645c");
    text("CONCEPT BY LORENZO PIRAS", 48, 1380, 14, "#68645c");

    /* -----------------------------------------------------
       CONCEPT 02 — FORMA
       ----------------------------------------------------- */

    ctx.save();
    ctx.translate(0, 1440);

    ctx.fillStyle = "#091e1d";
    ctx.fillRect(0, 0, 720, 1440);

    text("FORMA®", 48, 110, 31, "#b7f7a1", "700");
    text("PRODUCTS FOR WHAT COMES NEXT", 48, 180, 15, "#82a5a0");

    text("Less noise.", 45, 340, 80, "#eff9e9", "700");
    text("More form.", 45, 435, 80, "#b7f7a1", "700");

    text("Designed around your everyday.", 48, 520, 23, "#aac2ba");

    ctx.fillStyle = "#163c36";
    ctx.fillRect(40, 610, 640, 530);

    const green = ctx.createLinearGradient(200, 650, 500, 1100);

    green.addColorStop(0, "#e5f8c7");
    green.addColorStop(0.45, "#9bd870");
    green.addColorStop(1, "#4c7a42");

    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.ellipse(360, 1065, 180, 40, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = green;
    ctx.beginPath();
    ctx.roundRect(225, 710, 270, 350, 90);
    ctx.fill();

    ctx.strokeStyle = "#203e2b";
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.arc(360, 850, 67, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 4;
    ctx.strokeStyle = "#d8f5b6";
    ctx.beginPath();
    ctx.arc(360, 850, 46, 0, Math.PI * 2);
    ctx.stroke();

    text("The everyday object.", 48, 1230, 35, "#eff9e9", "700");
    text("Discover the collection  ↗", 48, 1300, 22, "#b7f7a1");
    text("CONCEPT BY LORENZO PIRAS", 48, 1380, 14, "#82a5a0");

    ctx.restore();

    /* -----------------------------------------------------
       CONCEPT 03 — PULSE
       ----------------------------------------------------- */

    ctx.save();
    ctx.translate(0, 2880);

    ctx.fillStyle = "#170b2a";
    ctx.fillRect(0, 0, 720, 1440);

    text("PULSE / DIGITAL CULTURE", 48, 110, 23, "#f7eaff", "700");

    text("FEEL", 40, 340, 148, "#ee9fff", "700");
    text("THE", 40, 480, 148, "#f7eaff", "700");
    text("SHIFT.", 40, 620, 148, "#b9ff75", "700");

    text("Sound. Light. New perspectives.", 48, 710, 24, "#d1b6df");

    const neon = ctx.createLinearGradient(40, 790, 680, 1190);

    neon.addColorStop(0, "#ff44b7");
    neon.addColorStop(0.5, "#7c3aed");
    neon.addColorStop(1, "#25d6e6");

    ctx.fillStyle = neon;
    ctx.fillRect(40, 790, 640, 400);

    ctx.save();
    ctx.translate(360, 990);

    for (let i = 0; i < 20; i += 1) {
      ctx.strokeStyle = "rgba(255,255,255,0.55)";
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        40 + i * 11,
        150,
        i * 0.14,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }

    ctx.restore();

    text("NOT ANOTHER ORDINARY NIGHT.", 48, 1280, 28, "#f7eaff", "700");
    text("Enter the experience  ↗", 48, 1340, 22, "#b9ff75");
    text("CONCEPT BY LORENZO PIRAS", 48, 1400, 14, "#d1b6df");

    ctx.restore();

    const result = new THREE.CanvasTexture(canvas);

    result.colorSpace = THREE.SRGBColorSpace;

    /*
     * Il display mostra un terzo dell'atlante.
     * L'offset verticale seleziona la porzione visibile.
     */
    result.repeat.set(1, 1 / 3);
    result.offset.set(0, 2 / 3);
    result.anisotropy = 4;

    return result;
  }, []);

  useEffect(() => {
    return () => texture?.dispose();
  }, [texture]);

  return texture;
}

/* =========================================================
   MODELLO IPHONE PRO PROCEDURALE
   ========================================================= */

function Phone({
  pose,
  reduced,
}: {
  pose: RefObject<DevicePose>;
  reduced: boolean;
}) {
  const root = useRef<THREE.Group>(null);
  const screenAssembly = useRef<THREE.Group>(null);

  const texture = useWebsiteAtlas();

  const displayGeometry = useMemo(() => {
    const width = 1.94;
    const height = 4.15;

    const geometry = new THREE.ShapeGeometry(
      makeShape(width, height, 0.22),
      20
    );

    const positions = geometry.getAttribute("position");
    const uv = geometry.getAttribute("uv");

    for (let i = 0; i < positions.count; i += 1) {
      uv.setXY(
        i,
        (positions.getX(i) + width / 2) / width,
        (positions.getY(i) + height / 2) / height
      );
    }

    uv.needsUpdate = true;

    return geometry;
  }, []);

  useEffect(() => {
    return () => displayGeometry.dispose();
  }, [displayGeometry]);

  useFrame((state) => {
    if (!root.current) return;

    const p = pose.current;

    const portraitMobile =
      state.size.width < 768 &&
      state.size.height > state.size.width;

    const smallLandscape =
      state.size.height < 540 &&
      state.size.width > state.size.height;

    const availableHeight = portraitMobile ? 0.43 : 0.75;
    const availableWidth = portraitMobile ? 0.65 : 0.43;

    const fit = Math.min(
      (state.viewport.height * availableHeight) / 4.5,
      (state.viewport.width * availableWidth) / 2.15
    );

    const float = reduced
      ? 0
      : Math.sin(state.clock.elapsedTime * 0.8) * 0.018;

    root.current.position.set(
      portraitMobile
        ? p.x * state.viewport.width * 0.16
        : p.x * state.viewport.width,

      portraitMobile
        ? -state.viewport.height * 0.17 + float
        : p.y * fit + float,

      0
    );

    root.current.rotation.set(p.rx, p.ry, p.rz);

    root.current.scale.setScalar(
      fit * p.scale * (smallLandscape ? 0.93 : 1)
    );

    if (screenAssembly.current) {
      screenAssembly.current.position.z =
        0.15 + p.explode * 0.85;
    }

    if (texture) {
      texture.offset.y =
        (2 / 3) * (1 - THREE.MathUtils.clamp(p.preview, 0, 1));
    }
  });

  return (
    <group ref={root}>
      <Shell
        width={2.14}
        height={4.5}
        depth={0.24}
        radius={0.3}
        color="#8f8a97"
        metalness={1}
        roughness={0.24}
      />

      <Shell
        width={2.06}
        height={4.4}
        depth={0.035}
        radius={0.28}
        color="#322e39"
        metalness={0.5}
        roughness={0.38}
        position={[0, 0, -0.15]}
      />

      {/* Display separabile */}
      <group ref={screenAssembly} position={[0, 0, 0.15]}>
        <Shell
          width={2.055}
          height={4.4}
          depth={0.045}
          radius={0.27}
          color="#030305"
          roughness={0.13}
        />

        {texture && (
          <mesh
            geometry={displayGeometry}
            position={[0, 0, 0.04]}
          >
            <meshBasicMaterial
              map={texture}
              toneMapped={false}
            />
          </mesh>
        )}

        <Shell
          width={0.63}
          height={0.145}
          depth={0.012}
          radius={0.07}
          color="#020203"
          position={[0, 1.9, 0.06]}
        />

        <mesh position={[0.215, 1.9, 0.076]}>
          <circleGeometry args={[0.027, 24]} />
          <meshStandardMaterial
            color="#172f4d"
            metalness={0.8}
            roughness={0.1}
          />
        </mesh>

        <Shell
          width={0.63}
          height={0.022}
          depth={0.004}
          radius={0.01}
          color="#ffffff"
          position={[0, -1.98, 0.057]}
        />
      </group>

      {/* Modulo fotocamere posteriore */}
      <group
        position={[-0.43, 1.43, -0.23]}
        rotation={[0, Math.PI, 0]}
      >
        <Shell
          width={1.08}
          height={1.12}
          depth={0.1}
          radius={0.22}
          color="#57505f"
          metalness={0.8}
        />

        {[
          [-0.25, 0.27],
          [0.25, 0],
          [-0.25, -0.27],
        ].map(([x, y], i) => (
          <group key={i} position={[x, y, 0.09]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry
                args={[0.202, 0.202, 0.075, 40]}
              />
              <meshStandardMaterial
                color="#a6a0ad"
                metalness={1}
                roughness={0.2}
              />
            </mesh>

            <mesh
              rotation={[Math.PI / 2, 0, 0]}
              position={[0, 0, 0.048]}
            >
              <cylinderGeometry
                args={[0.16, 0.16, 0.035, 40]}
              />
              <meshPhysicalMaterial
                color="#0b1426"
                roughness={0.05}
                metalness={0.45}
                clearcoat={1}
                clearcoatRoughness={0.03}
              />
            </mesh>

            <mesh position={[-0.04, 0.04, 0.07]}>
              <circleGeometry args={[0.04, 24]} />
              <meshBasicMaterial color="#536fa8" />
            </mesh>
          </group>
        ))}

        <mesh position={[0.28, 0.36, 0.07]}>
          <circleGeometry args={[0.07, 24]} />
          <meshStandardMaterial color="#f0e5d0" />
        </mesh>
      </group>

      {/* Tasti */}
      <Shell
        width={0.035}
        height={0.48}
        depth={0.09}
        radius={0.015}
        color="#aaa1b0"
        metalness={1}
        position={[1.09, 0.55, 0]}
      />

      {[
        [1.18, 0.15],
        [0.7, 0.3],
        [0.15, 0.3],
      ].map(([y, height], i) => (
        <Shell
          key={i}
          width={0.035}
          height={height}
          depth={0.09}
          radius={0.015}
          color="#aaa1b0"
          metalness={1}
          position={[-1.09, y, 0]}
        />
      ))}
    </group>
  );
}

/* =========================================================
   STUDIO LUCI
   ========================================================= */

function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} />

      <directionalLight
        position={[4, 5, 6]}
        intensity={2.7}
        color="#f2e8ff"
      />

      <pointLight
        position={[-4, 1, 3]}
        intensity={25}
        color="#c94fff"
      />

      <pointLight
        position={[4, -2, 3]}
        intensity={18}
        color="#47dfff"
      />

      <Environment resolution={128} frames={1}>
        <Lightformer
          position={[-4, 1, 4]}
          rotation={[0, Math.PI / 4, 0]}
          scale={[2, 7, 1]}
          intensity={5}
          color="#e9d5ff"
        />

        <Lightformer
          position={[4, 0, 4]}
          rotation={[0, -Math.PI / 4, 0]}
          scale={[2, 6, 1]}
          intensity={4}
          color="#a5f3fc"
        />

        <Lightformer
          position={[0, 4, -3]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[5, 3, 1]}
          intensity={3}
          color="#f9a8d4"
        />
      </Environment>
    </>
  );
}

/* =========================================================
   PAGINA — SCROLL NATURALE
   Nessun pin e nessuna sezione sticky.
   ========================================================= */

export default function Home() {
  const page = useRef<HTMLDivElement>(null);
  const main = useRef<HTMLElement>(null);
  const ambient = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  const pose = useRef<DevicePose>({ ...START });

  const [mounted, setMounted] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    setMounted(true);

    const update = () => setTabVisible(!document.hidden);

    document.addEventListener("visibilitychange", update);

    return () => {
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  useEffect(() => {
    if (!mounted || !page.current || !main.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();

    media.add(
      {
        reduce: "(prefers-reduced-motion: reduce)",
        mobile: "(max-width: 767px)",
        desktop: "(min-width: 768px)",
      },
      (context) => {
        const conditions = context.conditions as {
          reduce: boolean;
          mobile: boolean;
          desktop: boolean;
        };

        Object.assign(pose.current, START);

        if (conditions.reduce) return;

        const sections = gsap.utils.toArray<HTMLElement>(
          "[data-scene]",
          main.current
        );

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: main.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.55,
            invalidateOnRefresh: true,
          },
        });

        /*
         * Durata unitaria per ogni passaggio.
         * Le sezioni hanno la stessa altezza minima.
         * Il documento continua a scorrere normalmente.
         */
        STOPS.slice(1).forEach((stop, i) => {
          timeline.to(
            pose.current,
            {
              ...stop,
              duration: 1,
              ease: "power1.inOut",
            },
            i
          );
        });

        const colors = [
          "#7636df",
          "#b18358",
          "#167060",
          "#af35b8",
          "#265ac8",
          "#8435c9",
        ];

        colors.slice(1).forEach((color, i) => {
          timeline.to(
            ambient.current,
            {
              backgroundColor: color,
              xPercent: i % 2 === 0 ? -15 : 15,
              duration: 1,
            },
            i
          );
        });

        timeline.fromTo(
          progress.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 5,
            ease: "none",
          },
          0
        );

        /*
         * Ingressi e uscite legati alla rotella.
         * Il contenuto non viene bloccato.
         */
        sections.forEach((section) => {
          const copy = section.querySelector("[data-copy]");

          if (!copy) return;

          gsap.fromTo(
            copy,
            {
              y: 45,
              opacity: 0.3,
            },
            {
              y: 0,
              opacity: 1,
              ease: "none",

              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                end: "top 30%",
                scrub: 0.35,
              },
            }
          );

          const word = section.querySelector("[data-word]");

          if (word) {
            gsap.fromTo(
              word,
              { xPercent: 8 },
              {
                xPercent: -12,
                ease: "none",

                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              }
            );
          }
        });
      }
    );

    return () => media.revert();
  }, [mounted]);

  return (
    <div
      ref={page}
      className={`studio-page ${reduced ? "studio-reduced" : ""}`}
    >
      <header className="studio-nav">
        <a href="#home" className="studio-logo">
          Lorenzo Piras<span>®</span>
        </a>

        <nav aria-label="Navigazione principale">
          <a href="#concept">Concept</a>
          <a href="#metodo">Metodo</a>
          <a href="#contatti">Contatti</a>
        </nav>

        <a href={WHATSAPP} className="studio-nav-cta">
          Let’s talk ↗
        </a>
      </header>

      {/* Ambiente fisso, non blocca lo scorrimento del documento */}
      <div className="studio-environment" aria-hidden="true">
        <div ref={ambient} className="studio-ambient" />
        <div className="studio-ambient-blue" />
        <div className="studio-grid" />
      </div>

      {/* Un solo renderer per tutta la pagina */}
      <div className="studio-canvas" aria-hidden="true">
        {mounted && (
          <SceneBoundary>
            <Canvas
              dpr={[1, 1.5]}
              frameloop={
                reduced || !tabVisible ? "demand" : "always"
              }
              camera={{
                position: [0, 0, 9],
                fov: 38,
                near: 0.1,
                far: 50,
              }}
              gl={{
                alpha: true,
                antialias: true,
                powerPreference: "high-performance",
              }}
              fallback={<SceneFallback />}
            >
              <Suspense fallback={null}>
                <Lights />
                <Phone pose={pose} reduced={reduced} />
              </Suspense>
            </Canvas>
          </SceneBoundary>
        )}
      </div>

      <main ref={main} className="studio-main">
        {/* 01 — INTRODUZIONE */}
        <section
          id="home"
          data-scene
          className="studio-section"
        >
          <div data-word className="studio-giant" aria-hidden="true">
            UNCOMMON
          </div>

          <div data-copy className="studio-copy">
            <p className="studio-eyebrow">
              Independent designer / Bespoke developer
            </p>

            <h1>
              Digital
              <br />
              <span className="studio-gradient">Haute</span>
              <br />
              Couture.
            </h1>

            <p className="studio-lead">
              Crafting Unconventional, Bespoke &amp;
              Avant-Garde Web Experiences.
            </p>

            <div className="studio-actions">
              <a href={WHATSAPP} className="studio-primary">
                Inizia un progetto ↗
              </a>

              <a href="#concept" className="studio-text-link">
                Esplora ↓
              </a>
            </div>

            <p className="studio-small">
              Scorri: la pagina si muove, il progetto prende forma.
            </p>
          </div>
        </section>

        {/* 02 — CONCEPT EDITORIALE */}
        <section
          id="concept"
          data-scene
          className="studio-section studio-right"
        >
          <div data-word className="studio-giant" aria-hidden="true">
            ATELIER
          </div>

          <div data-copy className="studio-copy">
            <p className="studio-eyebrow studio-warm">
              01 / Visual direction
            </p>

            <h2>
              Il lusso
              <br />
              <span className="studio-warm">sa respirare.</span>
            </h2>

            <p className="studio-lead">
              Tipografia editoriale, spazio e materia.
              Un linguaggio visivo pensato per lasciare
              un’impressione precisa.
            </p>

            <div className="studio-project-label">
              <span>ATELIER</span>
              <span>Concept dimostrativo</span>
            </div>

            <ul className="studio-list">
              <li>Art direction e identità digitale</li>
              <li>Gerarchie tipografiche</li>
              <li>Composizioni responsive</li>
            </ul>
          </div>
        </section>

        {/* 03 — CONCEPT PRODOTTO */}
        <section
          data-scene
          className="studio-section"
        >
          <div data-word className="studio-giant" aria-hidden="true">
            FORMA
          </div>

          <div data-copy className="studio-copy">
            <p className="studio-eyebrow studio-green">
              02 / Product storytelling
            </p>

            <h2>
              Non mostrare.
              <br />
              <span className="studio-green">Fai desiderare.</span>
            </h2>

            <p className="studio-lead">
              Un prodotto non è soltanto un’immagine.
              È una storia da rendere chiara, interessante
              e facile da esplorare.
            </p>

            <div className="studio-project-label">
              <span>FORMA</span>
              <span>Concept dimostrativo</span>
            </div>

            <div className="studio-tags">
              <span>Product UI</span>
              <span>Micro-interazioni</span>
              <span>Design system</span>
            </div>

            <p className="studio-small">
              Guarda il display: l’anteprima cambia mentre scorri.
            </p>
          </div>
        </section>

        {/* 04 — CARATTERE E MOVIMENTO */}
        <section
          data-scene
          className="studio-section studio-right"
        >
          <div data-word className="studio-giant" aria-hidden="true">
            PULSE
          </div>

          <div data-copy className="studio-copy">
            <p className="studio-eyebrow studio-pink">
              03 / Unconventional experiences
            </p>

            <h2>
              Un altro
              <br />
              <span className="studio-pink">punto di vista.</span>
            </h2>

            <p className="studio-lead">
              Colore, ritmo e contrasti per dare al tuo
              brand una presenza che non sembri già vista.
            </p>

            <div className="studio-project-label">
              <span>PULSE</span>
              <span>Concept dimostrativo</span>
            </div>

            <ul className="studio-list">
              <li>Direzioni creative non convenzionali</li>
              <li>Animazioni collegate alla narrazione</li>
              <li>Esperienze progettate anche per il touch</li>
            </ul>
          </div>
        </section>

        {/* 05 — METODO */}
        <section
          id="metodo"
          data-scene
          className="studio-section"
        >
          <div data-word className="studio-giant" aria-hidden="true">
            INSIDE
          </div>

          <div data-copy className="studio-copy">
            <p className="studio-eyebrow">
              04 / Behind the experience
            </p>

            <h2>
              Ogni livello.
              <br />
              <span className="studio-gradient">
                Una ragione.
              </span>
            </h2>

            <p className="studio-lead">
              Un progetto coerente nasce quando strategia,
              interfaccia e sviluppo vengono pensati insieme.
            </p>

            <div className="studio-method">
              {[
                [
                  "01",
                  "Ascolto",
                  "Obiettivi, pubblico e carattere del brand.",
                ],
                [
                  "02",
                  "Direzione",
                  "Struttura, linguaggio visivo e prototipi.",
                ],
                [
                  "03",
                  "Sviluppo",
                  "Codice, movimento e adattamento responsive.",
                ],
                [
                  "04",
                  "Rifinitura",
                  "Verifiche, contenuti e preparazione al lancio.",
                ],
              ].map(([number, title, description]) => (
                <motion.div
                  key={number}
                  whileHover={
                    reduced ? undefined : { x: 7 }
                  }
                  className="studio-method-row"
                >
                  <span>{number}</span>

                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 06 — CONTATTO */}
        <section
          id="contatti"
          data-scene
          className="studio-section studio-right"
        >
          <div data-word className="studio-giant" aria-hidden="true">
            NEXT
          </div>

          <div data-copy className="studio-copy">
            <p className="studio-eyebrow studio-pink">
              05 / Your next chapter
            </p>

            <h2>
              Ora tocca
              <br />
              <span className="studio-pink">
                alla tua idea.
              </span>
            </h2>

            <p className="studio-lead">
              Sono Lorenzo Piras.
              Progetto siti su misura per chi vuole
              un’identità digitale con un carattere proprio.
            </p>

            <a href={CALL} className="studio-phone">
              +39 3247484896 ↗
            </a>

            <div className="studio-actions">
              <a href={CALL} className="studio-primary">
                Chiama Lorenzo
              </a>

              <a href={WHATSAPP} className="studio-outline">
                WhatsApp ↗
              </a>
            </div>

            <p className="studio-small">
              Raccontami il progetto, il contesto e cosa
              vuoi comunicare.
            </p>
          </div>
        </section>
      </main>
      <WorkstationStory />
      <IntroPresentation />
  <CinematicLayer />
      
            <FinalContact />
            <GlobalMotion />

      <div className="studio-progress-track" aria-hidden="true">
        <div ref={progress} className="studio-progress" />
      </div>

      <style jsx global>{`
        .studio-page {
          position: relative;
          isolation: isolate;
          background: #07050e;
          color: #f7f3ff;
          overflow-x: clip;
        }

        .studio-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 60;
          height: 76px;
          padding-inline: clamp(20px, 4vw, 72px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          background: rgba(7, 5, 14, 0.65);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .studio-logo {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.05em;
          white-space: nowrap;
        }

        .studio-logo span {
          color: #ed9cff;
          margin-left: 3px;
        }

        .studio-nav nav {
          display: flex;
          gap: 30px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.65);
        }

        .studio-nav-cta {
          border-radius: 999px;
          background: #f7f3ff;
          color: #140b20;
          padding: 11px 20px;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }

        .studio-environment {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
          background: #07050e;
        }

        .studio-ambient {
          position: absolute;
          top: 10%;
          left: 10%;
          width: 90vw;
          height: 80vh;
          border-radius: 50%;
          background: #7636df;
          opacity: 0.25;
          filter: blur(110px);
        }

        .studio-ambient-blue {
          position: absolute;
          bottom: -35%;
          left: -20%;
          width: 80vw;
          height: 80vh;
          border-radius: 50%;
          background: #155e75;
          opacity: 0.25;
          filter: blur(100px);
        }

        .studio-grid {
          position: absolute;
          inset: 0;
          opacity: 0.035;
          background-image:
            linear-gradient(#fff 1px, transparent 1px),
            linear-gradient(90deg, #fff 1px, transparent 1px);
          background-size: 90px 90px;
        }

        .studio-canvas {
          position: fixed;
          inset: 0;
          z-index: 2;
          height: 100svh;
          pointer-events: none;
        }

        .studio-main {
          position: relative;
          z-index: 3;
        }

        .studio-section {
          position: relative;
          min-height: 112svh;
          padding:
            max(120px, 13svh)
            clamp(24px, 6vw, 100px);
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: 8vw;
          align-items: center;
          pointer-events: none;
        }

        .studio-copy {
          position: relative;
          width: 100%;
          max-width: 610px;
          grid-column: 1;
          pointer-events: auto;
        }

        .studio-right .studio-copy {
          grid-column: 2;
        }

        .studio-giant {
          position: absolute;
          top: 35%;
          left: -5%;
          z-index: -1;
          font-size: 24vw;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.085em;
          white-space: nowrap;
          color: rgba(255, 255, 255, 0.04);
          user-select: none;
          pointer-events: none;
        }

        .studio-eyebrow {
          margin: 0 0 25px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.19em;
          text-transform: uppercase;
          color: #c7a5ff;
        }

        .studio-copy h1,
        .studio-copy h2 {
          margin: 0;
          font-weight: 700;
          line-height: 0.98;
          letter-spacing: -0.065em;
          text-wrap: balance;
        }

        .studio-copy h1 {
          font-size: clamp(54px, 7.3vw, 116px);
          line-height: 0.9;
        }

        .studio-copy h2 {
          font-size: clamp(44px, 5.3vw, 82px);
        }

        .studio-gradient {
          background: linear-gradient(
            100deg,
            #f0abfc,
            #b4a3ff,
            #67e8f9
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .studio-lead {
          max-width: 410px;
          margin: 28px 0 0;
          color: rgba(255, 255, 255, 0.64);
          font-size: clamp(14px, 1.25vw, 18px);
          line-height: 1.8;
        }

        .studio-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          align-items: center;
          margin-top: 32px;
        }

        .studio-primary,
        .studio-outline {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          min-height: 50px;
          padding: 14px 23px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          transition:
            background-color 200ms ease,
            color 200ms ease;
        }

        .studio-primary {
          background: #f7f3ff;
          color: #140b20;
        }

        .studio-primary:hover {
          background: #c4f4ff;
        }

        .studio-outline {
          border: 1px solid rgba(255, 255, 255, 0.25);
          background: rgba(255, 255, 255, 0.03);
        }

        .studio-text-link {
          padding: 12px 6px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
        }

        .studio-small {
          margin: 25px 0 0;
          max-width: 380px;
          font-size: 11px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.4);
        }

        .studio-project-label {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 10px;
          margin-top: 30px;
          padding-block: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.16);
          border-bottom: 1px solid rgba(255, 255, 255, 0.16);
          font-size: 10px;
          letter-spacing: 0.1em;
        }

        .studio-project-label span:last-child {
          color: rgba(255, 255, 255, 0.45);
        }

        .studio-list {
          display: grid;
          gap: 12px;
          margin: 25px 0 0;
          padding-left: 17px;
          list-style: disc;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }

        .studio-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 25px;
        }

        .studio-tags span {
          padding: 8px 12px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 999px;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.6);
        }

        .studio-method {
          display: grid;
          gap: 0;
          margin-top: 25px;
        }

        .studio-method-row {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          padding: 17px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
        }

        .studio-method-row > span {
          padding-top: 4px;
          font-size: 10px;
          color: #a5dfff;
        }

        .studio-method-row h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .studio-method-row p {
          margin: 5px 0 0;
          font-size: 11px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.5);
        }

        .studio-phone {
          display: inline-block;
          margin-top: 30px;
          font-size: clamp(23px, 3vw, 43px);
          font-weight: 600;
          letter-spacing: -0.05em;
        }

        .studio-warm {
          color: #dfc4a5;
        }

        .studio-green {
          color: #bcf5a8;
        }

        .studio-pink {
          color: #f0abfc;
        }

        .studio-footer {
          position: relative;
          z-index: 4;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 18px;
          padding: 30px clamp(24px, 6vw, 100px);
          background: #090610;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.45);
          font-size: 10px;
        }

        .studio-progress-track {
          position: fixed;
          z-index: 80;
          left: 0;
          right: 0;
          top: 0;
          height: 3px;
          pointer-events: none;
        }

        .studio-progress {
          height: 100%;
          transform-origin: left;
          transform: scaleX(0);
          background: linear-gradient(
            90deg,
            #f0abfc,
            #a78bfa,
            #67e8f9
          );
        }

        .studio-fallback {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          height: 100%;
          padding-right: 15%;
        }

        .studio-fallback > div {
          width: 200px;
          height: 420px;
          padding: 40px 20px;
          border: 6px solid #89818e;
          border-radius: 36px;
          background: linear-gradient(
            145deg,
            #10081c,
            #6929bd,
            #0c6577
          );
        }

        .studio-fallback small {
          font-size: 9px;
        }

        .studio-fallback strong {
          display: block;
          margin-top: 80px;
          font-size: 34px;
          line-height: 1;
          letter-spacing: -0.06em;
        }

        /* MOBILE:
           i testi continuano a scorrere normalmente.
           I pannelli mantengono leggibilità davanti alla scena.
        */
        @media (max-width: 767px) and (orientation: portrait) {
          .studio-nav {
            height: 64px;
            padding-inline: 18px;
          }

          .studio-logo {
            font-size: 16px;
          }

          .studio-nav nav {
            display: none;
          }

          .studio-nav-cta {
            font-size: 10px;
            padding: 10px 14px;
          }

          .studio-section {
            min-height: 120svh;
            display: block;
            padding: 100px 18px 55svh;
          }

          .studio-copy,
          .studio-right .studio-copy {
            max-width: 100%;
            padding: 24px 20px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 24px;
            background: rgba(12, 7, 21, 0.9);
            box-shadow: 0 20px 70px rgba(0, 0, 0, 0.12);
          }

          .studio-copy h1 {
            font-size: clamp(48px, 14vw, 72px);
          }

          .studio-copy h2 {
            font-size: clamp(36px, 10vw, 56px);
          }

          .studio-eyebrow {
            font-size: 8px;
            letter-spacing: 0.11em;
            margin-bottom: 18px;
          }

          .studio-lead {
            font-size: 12px;
            line-height: 1.7;
            margin-top: 18px;
          }

          .studio-actions {
            margin-top: 22px;
            gap: 10px;
          }

          .studio-primary,
          .studio-outline {
            font-size: 11px;
            min-height: 46px;
            padding: 12px 17px;
          }

          .studio-small {
            margin-top: 18px;
            font-size: 10px;
          }

          .studio-giant {
            top: 64%;
            font-size: 28vw;
          }

          .studio-method-row {
            padding: 12px 0;
          }

          .studio-phone {
            font-size: clamp(21px, 6.8vw, 32px);
          }

          .studio-ambient,
          .studio-ambient-blue {
            filter: blur(70px);
          }

          .studio-fallback {
            padding: 0 0 50px;
            justify-content: center;
            align-items: flex-end;
          }

          .studio-fallback > div {
            width: 150px;
            height: 300px;
          }

          .studio-fallback strong {
            font-size: 25px;
            margin-top: 40px;
          }
        }

        /* LANDSCAPE: mantiene due colonne anche sui telefoni. */
        @media (max-height: 540px) and (orientation: landscape) {
          .studio-nav {
            height: 54px;
          }

          .studio-nav nav {
            display: none;
          }

          .studio-section {
            min-height: 140svh;
            padding: 90px 25px 70px;
            gap: 35px;
          }

          .studio-copy h1 {
            font-size: 58px;
          }

          .studio-copy h2 {
            font-size: 38px;
          }

          .studio-lead {
            font-size: 12px;
          }
        }

        /* RIDUZIONE DEL MOVIMENTO:
           contenuti subito visibili, scena statica. */
        .studio-reduced .studio-copy {
          opacity: 1 !important;
          transform: none !important;
        }

        .studio-reduced .studio-giant {
          transform: none !important;
        }
      `}</style>
    </div>
  );
}