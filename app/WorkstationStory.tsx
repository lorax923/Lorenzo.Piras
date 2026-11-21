"use client";

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
  RoundedBox,
} from "@react-three/drei";

import { useReducedMotion } from "framer-motion";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import * as THREE from "three";

import { SceneActivity } from "./FluidEngine";

/* =========================================================
   CONTENUTI
   ========================================================= */

const CHAPTERS = [
  {
    number: "01",
    label: "DALL’IDEA ALLA STRUTTURA",
    title: "La parte invisibile",
    accent: "fa la differenza.",
    description:
      "Un sito efficace non nasce da una schermata vuota. Nasce da domande precise: chi deve raggiungere, cosa deve comunicare e quale azione deve rendere semplice.",
    services: [
      [
        "Analisi e obiettivi",
        "Definiamo pubblico, priorità e contenuti prima di scegliere colori e animazioni.",
      ],
      [
        "Architettura dei contenuti",
        "Organizziamo le informazioni per costruire un percorso chiaro, non una raccolta di sezioni scollegate.",
      ],
    ],
    note: "Scorri per aprire la struttura del progetto.",
  },
  {
    number: "02",
    label: "IL PROGETTO SI APRE",
    title: "Ogni elemento",
    accent: "trova il suo posto.",
    description:
      "La direzione creativa diventa un’interfaccia: proporzioni, tipografia, contrasti e componenti costruiscono un’identità coerente.",
    services: [
      [
        "Web design su misura",
        "Layout e linguaggio visivo vengono progettati attorno al carattere del tuo brand.",
      ],
      [
        "Prototipi e gerarchie",
        "Studiamo come presentare messaggi, servizi e inviti all’azione prima dello sviluppo.",
      ],
    ],
    note: "La struttura si apre e rivela lo spazio di lavoro.",
  },
  {
    number: "03",
    label: "IL CODICE PRENDE FORMA",
    title: "Non solo bello.",
    accent: "Costruito con criterio.",
    description:
      "Il design si traduce in componenti, comportamenti e dettagli tecnici. Il codice collega ciò che si vede a ciò che l’utente può fare.",
    services: [
      [
        "Sviluppo front-end",
        "Interfacce personalizzate e componenti organizzati per mantenere coerenza nel progetto.",
      ],
      [
        "Animazioni e interazioni",
        "Movimento legato alla narrazione, con attenzione a leggibilità e preferenze di accessibilità.",
      ],
    ],
    note: "Il codice nel monitor è una dimostrazione grafica.",
  },
  {
    number: "04",
    label: "DAL CODICE ALL’ESPERIENZA",
    title: "La struttura diventa",
    accent: "un mondo da esplorare.",
    description:
      "Tipografia, contenuti e interazioni smettono di essere elementi separati. Diventano un’esperienza riconoscibile, progettata anche per lo schermo del telefono.",
    services: [
      [
        "Adattamento responsive",
        "La composizione cambia tra desktop e smartphone: non si limita a ridurre tutto.",
      ],
      [
        "Contenuti e navigazione",
        "Testi, immagini e percorsi vengono rifiniti insieme per rendere il sito più comprensibile.",
      ],
    ],
    note: "L’anteprima rappresenta un concept dimostrativo.",
  },
  {
    number: "05",
    label: "PRONTO PER IL PROSSIMO PASSO",
    title: "Il lancio non è",
    accent: "un salto nel vuoto.",
    description:
      "Prima della pubblicazione si controllano collegamenti, contenuti, comportamento delle interfacce e presentazione sui dispositivi concordati.",
    services: [
      [
        "Verifiche e rifiniture",
        "Controlli su navigazione, leggibilità e comportamento responsive, oltre alle funzionalità previste dal progetto.",
      ],
      [
        "Preparazione alla pubblicazione",
        "Configurazione del rilascio e definizione delle eventuali necessità di gestione e aggiornamento.",
      ],
    ],
    note: "Il prossimo passo è parlare del tuo progetto.",
  },
];

/* =========================================================
   STATO CONDIVISO TRA GSAP E SCENA 3D
   ========================================================= */

type SequenceState = {
  open: number;
  typing: number;
  website: number;
  pageScroll: number;
  rotation: number;
};

const INITIAL_STATE: SequenceState = {
  open: 0,
  typing: 0,
  website: 0,
  pageScroll: 0,
  rotation: -0.24,
};

/* =========================================================
   CODICE MOSTRATO NELL’EDITOR DIMOSTRATIVO
   ========================================================= */

const DISPLAY_CODE = [
  "// Ogni progetto parte da un’identità.",
  'import { Esperienza } from "./componenti";',
  "",
  "export default function SitoSuMisura() {",
  "  return (",
  '    <Esperienza tema="personale">',
  '      <Sezione nome="presentazione">',
  "        <Titolo>",
  "          Il tuo brand, senza compromessi.",
  "        </Titolo>",
  "        <Testo>",
  "          Design, contenuti e movimento.",
  "        </Testo>",
  '        <Pulsante href="#contatti">',
  "          Parliamo del tuo progetto",
  "        </Pulsante>",
  "      </Sezione>",
  "    </Esperienza>",
  "  );",
  "}",
];

const TOTAL_CODE_CHARACTERS = DISPLAY_CODE.reduce(
  (total, line) => total + line.length + 1,
  0
);

function getTokenColor(token: string): string {
  if (token.startsWith("//")) {
    return "#697d95";
  }

  if (token.startsWith('"') || token.startsWith("'")) {
    return "#a7e3a1";
  }

  if (
    [
      "import",
      "from",
      "export",
      "default",
      "function",
      "return",
    ].includes(token)
  ) {
    return "#d6a0ff";
  }

  if (/^[A-ZÀ-Ý]/.test(token)) {
    return "#79d8ed";
  }

  if (
    token.length > 0 &&
    "<>{}()[]/;=".includes(token.charAt(0))
  ) {
    return "#f3c781";
  }

  return "#d4dceb";
}

/* =========================================================
   TEXTURE DEL MONITOR
   ========================================================= */

function useMonitorTexture() {
  const resource = useMemo(() => {
    const canvas = document.createElement("canvas");

    canvas.width = 1200;
    canvas.height = 750;

    const context = canvas.getContext("2d");

    if (!context) {
      return null;
    }

    const texture = new THREE.CanvasTexture(canvas);

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    return {
      canvas,
      context,
      texture,
    };
  }, []);

  useEffect(() => {
    return () => {
      resource?.texture.dispose();
    };
  }, [resource]);

  return resource;
}

/* =========================================================
   DISEGNO DELL’EDITOR
   ========================================================= */

function drawEditor(
  context: CanvasRenderingContext2D,
  typingProgress: number
) {
  const width = 1200;
  const height = 750;

  context.globalAlpha = 1;
  context.fillStyle = "#09101a";
  context.fillRect(0, 0, width, height);

  context.fillStyle = "#131e2c";
  context.fillRect(0, 0, width, 48);

  ["#ff6b7a", "#efc66b", "#7bd6a3"].forEach(
    (color, index) => {
      context.fillStyle = color;
      context.beginPath();

      context.arc(
        25 + index * 20,
        24,
        5,
        0,
        Math.PI * 2
      );

      context.fill();
    }
  );

  context.font = "16px monospace";
  context.fillStyle = "#99abc4";

  context.fillText(
    "progetto / sito-su-misura.tsx",
    110,
    30
  );

  context.fillStyle = "#0c1624";
  context.fillRect(0, 48, 180, height - 48);

  context.font = "14px monospace";
  context.fillStyle = "#7088a8";

  [
    "PROGETTO",
    "",
    "app/",
    "  pagina.tsx",
    "  stile.css",
    "",
    "componenti/",
    "  titolo.tsx",
    "  pulsante.tsx",
    "",
    "contenuti/",
  ].forEach((line, index) => {
    context.fillText(
      line,
      18,
      85 + index * 25
    );
  });

  let remaining = Math.floor(
    THREE.MathUtils.clamp(typingProgress, 0, 1) *
      TOTAL_CODE_CHARACTERS
  );

  let cursorX = 240;
  let cursorY = 95;

  DISPLAY_CODE.forEach((line, index) => {
    const y = 95 + index * 28;

    context.font = "17px monospace";
    context.fillStyle = "#435773";

    context.fillText(
      String(index + 1).padStart(2, " "),
      195,
      y
    );

    if (remaining <= 0) {
      return;
    }

    const visibleLine = line.slice(0, remaining);

    let x = 240;

    if (visibleLine.startsWith("//")) {
      context.fillStyle = "#697d95";
      context.fillText(visibleLine, x, y);

      x += context.measureText(visibleLine).width;
    } else {
      const tokens =
        visibleLine.match(
          /"[^"]*"|'[^']*'|[A-Za-zÀ-ÿ_$][\wÀ-ÿ$]*|\s+|./g
        ) ?? [];

      tokens.forEach((token) => {
        context.fillStyle = getTokenColor(token);
        context.fillText(token, x, y);

        x += context.measureText(token).width;
      });
    }

    cursorX = x;
    cursorY = y;

    remaining -= line.length + 1;
  });

  if (typingProgress > 0 && typingProgress < 1) {
    context.fillStyle = "#bca2ff";

    context.fillRect(
      cursorX + 3,
      cursorY - 16,
      8,
      20
    );
  }

  context.fillStyle = "#152238";
  context.fillRect(0, height - 25, width, 25);

  context.font = "12px monospace";
  context.fillStyle = "#8faac8";

  context.fillText(
    "DIMOSTRAZIONE VISIVA · SVILUPPO SU MISURA",
    20,
    height - 8
  );
}

/* =========================================================
   DISEGNO DELL’ANTEPRIMA WEB
   ========================================================= */

function drawWebsite(
  context: CanvasRenderingContext2D,
  reveal: number,
  pageScroll: number
) {
  const width = 1200;
  const height = 750;

  const progress = THREE.MathUtils.clamp(
    reveal,
    0,
    1
  );

  if (progress <= 0) {
    return;
  }

  context.save();

  const panelX = (1 - progress) * 400;
  const panelY = (1 - progress) * 80;
  const panelScale = 0.68 + progress * 0.32;

  context.globalAlpha = progress;
  context.translate(panelX, panelY);
  context.scale(panelScale, panelScale);

  context.fillStyle = "#f0eade";
  context.fillRect(0, 0, width, height);

  context.fillStyle = "#ded8cf";
  context.fillRect(0, 0, width, 42);

  context.fillStyle = "#8c867d";
  context.font = "13px Arial";

  context.fillText(
    "Anteprima del tuo prossimo sito",
    40,
    27
  );

  const innerScroll =
    THREE.MathUtils.clamp(pageScroll, 0, 1) * 120;

  context.save();

  context.beginPath();
  context.rect(0, 42, width, height - 42);
  context.clip();

  context.translate(0, -innerScroll);

  context.fillStyle = "#20231f";
  context.font = "bold 23px Arial";
  context.fillText("OLTRE / STUDIO", 65, 110);

  context.font = "14px Arial";

  context.fillText(
    "PROGETTI     APPROCCIO     CONTATTI",
    795,
    107
  );

  context.font = "78px Georgia";
  context.fillText("Idee con carattere.", 65, 265);

  context.fillStyle = "#6a6f61";

  context.fillText(
    "Esperienze su misura.",
    65,
    350
  );

  context.font = "20px Arial";
  context.fillStyle = "#66685f";

  context.fillText(
    "Una presenza digitale che racconta davvero chi sei.",
    70,
    410
  );

  context.fillStyle = "#293c2f";
  context.beginPath();
  context.roundRect(65, 455, 220, 50, 25);
  context.fill();

  context.fillStyle = "#f7f2e7";
  context.font = "bold 14px Arial";

  context.fillText(
    "SCOPRI IL PROGETTO  ↗",
    87,
    486
  );

  const gradient = context.createLinearGradient(
    65,
    550,
    1135,
    810
  );

  gradient.addColorStop(0, "#bbc4a3");
  gradient.addColorStop(1, "#536a56");

  context.fillStyle = gradient;
  context.fillRect(65, 550, 1070, 300);

  context.strokeStyle = "rgba(246,244,229,.55)";
  context.lineWidth = 2;

  for (let index = 0; index < 12; index += 1) {
    context.beginPath();

    context.ellipse(
      600,
      700,
      100 + index * 22,
      100,
      index * 0.1,
      0,
      Math.PI * 2
    );

    context.stroke();
  }

  context.restore();
  context.restore();
}

function drawMonitor(
  context: CanvasRenderingContext2D,
  state: SequenceState
) {
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.globalAlpha = 1;

  drawEditor(context, state.typing);

  drawWebsite(
    context,
    state.website,
    state.pageScroll
  );
}

/* =========================================================
   MODELLO DELLA STRUTTURA E DEL MONITOR
   ========================================================= */

function Machine({
  state,
  reducedMotion,
}: {
  state: RefObject<SequenceState>;
  reducedMotion: boolean;
}) {
  const root = useRef<THREE.Group>(null);

  const leftDoor = useRef<THREE.Group>(null);
  const rightDoor = useRef<THREE.Group>(null);

  const monitor = useMonitorTexture();

  const lastDraw = useRef("");
  const lastTime = useRef(0);

  useFrame((frame) => {
    if (!root.current) {
      return;
    }

    const current = state.current;

    const portrait =
      frame.size.width < 768 &&
      frame.size.height > frame.size.width;

    const fit = Math.min(
      (frame.viewport.width *
        (portrait ? 0.88 : 0.47)) /
        6.1,

      (frame.viewport.height *
        (portrait ? 0.39 : 0.68)) /
        3.4
    );

    root.current.scale.setScalar(fit);

    root.current.position.set(
      portrait
        ? 0
        : frame.viewport.width * 0.17,

      portrait
        ? -frame.viewport.height * 0.18
        : -0.05,

      0
    );

    root.current.rotation.set(
      0.04,
      current.rotation,
      -0.025 + current.open * 0.025
    );

    if (leftDoor.current) {
      leftDoor.current.rotation.y =
        -current.open * 2.12;
    }

    if (rightDoor.current) {
      rightDoor.current.rotation.y =
        current.open * 2.12;
    }

    if (!monitor) {
      return;
    }

    const drawState = reducedMotion
      ? {
          ...current,
          typing: 1,
          website: 1,
          pageScroll: 0,
        }
      : current;

    const key = [
      Math.round(drawState.typing * 450),
      Math.round(drawState.website * 80),
      Math.round(drawState.pageScroll * 80),
    ].join(":");

    const elapsed = frame.clock.elapsedTime;

    const contentChanged =
      key !== lastDraw.current;

    const enoughTimePassed =
      lastDraw.current === "" ||
      elapsed - lastTime.current > 1 / 30;

    if (contentChanged && enoughTimePassed) {
      drawMonitor(
        monitor.context,
        drawState
      );

      monitor.texture.needsUpdate = true;

      lastDraw.current = key;
      lastTime.current = elapsed;
    }
  });

  return (
    <group ref={root}>
      {/* Pannello posteriore */}
      <RoundedBox
        args={[3.95, 2.88, 0.18]}
        radius={0.07}
        position={[0, 0.02, -0.28]}
      >
        <meshPhysicalMaterial
          color="#333844"
          metalness={0.9}
          roughness={0.3}
          clearcoat={1}
          clearcoatRoughness={0.15}
        />
      </RoundedBox>

      {/* Monitor */}
      <group position={[0, 0.23, 0.04]}>
        <RoundedBox
          args={[3.6, 2.21, 0.16]}
          radius={0.06}
        >
          <meshPhysicalMaterial
            color="#101319"
            metalness={0.75}
            roughness={0.22}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </RoundedBox>

        {monitor && (
          <mesh position={[0, 0.015, 0.088]}>
            <planeGeometry args={[3.39, 2.118]} />

            <meshBasicMaterial
              map={monitor.texture}
              toneMapped={false}
            />
          </mesh>
        )}

        <mesh position={[0, -1.06, 0.087]}>
          <circleGeometry args={[0.012, 16]} />
          <meshBasicMaterial color="#a5e6ff" />
        </mesh>
      </group>

      {/* Supporto del monitor */}
      <RoundedBox
        args={[0.21, 0.55, 0.2]}
        radius={0.04}
        position={[0, -1.02, -0.05]}
      >
        <meshStandardMaterial
          color="#8a919b"
          metalness={0.95}
          roughness={0.23}
        />
      </RoundedBox>

      <RoundedBox
        args={[1.05, 0.09, 0.62]}
        radius={0.035}
        position={[0, -1.29, 0.06]}
      >
        <meshStandardMaterial
          color="#747c89"
          metalness={1}
          roughness={0.24}
        />
      </RoundedBox>

      {/* Anta sinistra */}
      <group
        ref={leftDoor}
        position={[-1.94, 0.02, 0.4]}
      >
        <RoundedBox
          args={[1.93, 2.85, 0.12]}
          radius={0.045}
          position={[0.965, 0, 0]}
        >
          <meshPhysicalMaterial
            color="#626a78"
            metalness={1}
            roughness={0.27}
            clearcoat={1}
            clearcoatRoughness={0.12}
          />
        </RoundedBox>

        {[0.28, 0.43, 0.58].map((y) => (
          <mesh
            key={y}
            position={[0.75, y, 0.067]}
          >
            <boxGeometry
              args={[0.75, 0.018, 0.006]}
            />

            <meshStandardMaterial
              color="#28313e"
              roughness={0.4}
            />
          </mesh>
        ))}

        <mesh position={[1.86, 0, 0.067]}>
          <boxGeometry
            args={[0.013, 1.7, 0.008]}
          />

          <meshStandardMaterial
            color="#a4b4ff"
            emissive="#6f78e8"
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>

      {/* Anta destra */}
      <group
        ref={rightDoor}
        position={[1.94, 0.02, 0.4]}
      >
        <RoundedBox
          args={[1.93, 2.85, 0.12]}
          radius={0.045}
          position={[-0.965, 0, 0]}
        >
          <meshPhysicalMaterial
            color="#626a78"
            metalness={1}
            roughness={0.27}
            clearcoat={1}
            clearcoatRoughness={0.12}
          />
        </RoundedBox>

        <mesh position={[-1.86, 0, 0.067]}>
          <boxGeometry
            args={[0.013, 1.7, 0.008]}
          />

          <meshStandardMaterial
            color="#a4b4ff"
            emissive="#6f78e8"
            emissiveIntensity={0.8}
          />
        </mesh>

        <RoundedBox
          args={[0.56, 0.19, 0.014]}
          radius={0.005}
          position={[-0.75, -0.7, 0.072]}
        >
          <meshStandardMaterial
            color="#202735"
            metalness={0.8}
            roughness={0.3}
          />
        </RoundedBox>
      </group>

      {/* Fissaggi */}
      {[-1.83, 1.83].flatMap((x) =>
        [-1.24, 1.28].map((y) => (
          <mesh
            key={`${x}-${y}`}
            position={[x, y, 0.31]}
          >
            <sphereGeometry
              args={[0.035, 12, 12]}
            />

            <meshStandardMaterial
              color="#a4aab5"
              metalness={1}
              roughness={0.2}
            />
          </mesh>
        ))
      )}
    </group>
  );
}

/* =========================================================
   ILLUMINAZIONE DELLO STUDIO
   ========================================================= */

function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.75} />

      <directionalLight
        position={[3, 5, 6]}
        intensity={3}
        color="#ecf2ff"
      />

      <pointLight
        position={[-4, 0, 4]}
        intensity={25}
        color="#a78bfa"
      />

      <pointLight
        position={[4, 1, 3]}
        intensity={20}
        color="#67e8f9"
      />

      <Environment
        frames={1}
        resolution={128}
      >
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
          intensity={2}
          color="#e0c6ff"
        />
      </Environment>
    </>
  );
}

/* =========================================================
   FALLBACK
   ========================================================= */

function MonitorFallback() {
  return (
    <div className="ws-fallback">
      <div>
        <span>
          LORENZO PIRAS / SVILUPPO SU MISURA
        </span>

        <strong>
          Dall’idea
          <br />
          all’esperienza.
        </strong>
      </div>
    </div>
  );
}

class MachineBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = {
    failed: false,
  };

  static getDerivedStateFromError() {
    return {
      failed: true,
    };
  }

  render() {
    if (this.state.failed) {
      return <MonitorFallback />;
    }

    return this.props.children;
  }
}

/* =========================================================
   COMPONENTE PRINCIPALE
   ========================================================= */

export default function WorkstationStory() {
  const section = useRef<HTMLElement>(null);

  const scene = useRef<HTMLDivElement>(null);
  const sceneExit = useRef<HTMLDivElement>(null);

  const state = useRef<SequenceState>({
    ...INITIAL_STATE,
  });

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  const motionPreference = useReducedMotion();

  const reducedMotion =
    motionPreference ?? false;

  /* Stato di montaggio e visibilità del browser */
  useEffect(() => {
    setMounted(true);

    const updateVisibility = () => {
      setTabVisible(!document.hidden);
    };

    updateVisibility();

    document.addEventListener(
      "visibilitychange",
      updateVisibility
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        updateVisibility
      );
    };
  }, []);

  /* Montaggio della scena soltanto vicino alla sezione */
  useEffect(() => {
    const element = section.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      {
        rootMargin: "150px 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  /* Timeline e transizioni collegate allo scroll */
  useEffect(() => {
    if (
      !mounted ||
      !section.current ||
      motionPreference === null
    ) {
      return;
    }

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

        Object.assign(
          state.current,
          INITIAL_STATE
        );

        const oldVisuals =
          document.querySelectorAll(
            ".studio-canvas, .film-overlay, .film-chapter-indicator"
          );

        /* Uscita della scena precedente */
        if (oldVisuals.length > 0) {
          gsap.fromTo(
            oldVisuals,
            {
              y: 0,
              opacity: 1,
            },
            {
              y: conditions.reduce
                ? 0
                : "-105vh",

              opacity: 0,
              ease: "none",

              scrollTrigger: {
                trigger: section.current,
                start: "top bottom",
                end: "top top",
                scrub: conditions.reduce
                  ? true
                  : 0.45,
              },
            }
          );
        }

        /* Comparsa della nuova scena */
        gsap.fromTo(
          scene.current,
          {
            autoAlpha: 0,
          },
          {
            autoAlpha: 1,
            ease: "none",

            scrollTrigger: {
              trigger: section.current,
              start: "top 85%",
              end: "top 15%",
              scrub: true,
            },
          }
        );

        /* Uscita finale del monitor */
        gsap.fromTo(
          sceneExit.current,
          {
            y: 0,
            opacity: 1,
          },
          {
            y: conditions.reduce
              ? 0
              : "-15vh",

            opacity: 0,
            ease: "none",

            scrollTrigger: {
              trigger: section.current,
              start: "bottom bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );

        /* Preferenza di movimento ridotto */
        if (conditions.reduce) {
          Object.assign(state.current, {
            open: 1,
            typing: 1,
            website: 1,
            pageScroll: 0,
            rotation: -0.12,
          });

          return;
        }

        /* Timeline unica della trasformazione */
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });

        timeline
          /* ATTO 1 — Apertura */
          .to(
            state.current,
            {
              rotation: 0.16,
              open: 0.2,
              duration: 0.35,
              ease: "power2.inOut",
            },
            0
          )

          .to(
            state.current,
            {
              rotation: -0.12,
              open: 0.7,
              duration: 0.4,
              ease: "power2.inOut",
            },
            0.35
          )

          .to(
            state.current,
            {
              rotation: 0.08,
              open: 1,
              duration: 0.25,
              ease: "power2.out",
            },
            0.75
          )

          /* ATTO 2 — Scrittura */
          .to(
            state.current,
            {
              typing: 0.3,
              rotation: -0.08,
              duration: 0.3,
              ease: "none",
            },
            1
          )

          .to(
            state.current,
            {
              typing: 0.68,
              rotation: 0.1,
              duration: 0.4,
              ease: "none",
            },
            1.3
          )

          .to(
            state.current,
            {
              typing: 1,
              rotation: -0.04,
              duration: 0.3,
              ease: "none",
            },
            1.7
          )

          /* ATTO 3 — Dal codice al sito */
          .to(
            state.current,
            {
              website: 0.28,
              rotation: 0.14,
              duration: 0.3,
              ease: "power2.inOut",
            },
            2
          )

          .to(
            state.current,
            {
              website: 0.75,
              rotation: -0.1,
              duration: 0.45,
              ease: "power2.inOut",
            },
            2.3
          )

          .to(
            state.current,
            {
              website: 1,
              rotation: 0.02,
              duration: 0.25,
              ease: "power2.out",
            },
            2.75
          )

          /* ATTO 4 — Esplorazione */
          .to(
            state.current,
            {
              pageScroll: 0.38,
              rotation: -0.12,
              duration: 0.35,
              ease: "power1.inOut",
            },
            3
          )

          .to(
            state.current,
            {
              pageScroll: 0.8,
              rotation: 0.08,
              duration: 0.4,
              ease: "power1.inOut",
            },
            3.35
          )

          .to(
            state.current,
            {
              pageScroll: 1,
              rotation: 0,
              duration: 0.25,
              ease: "power2.out",
            },
            3.75
          );

        /* Testi e servizi */
        const copies =
          section.current?.querySelectorAll<HTMLElement>(
            ".ws-copy"
          );

        copies?.forEach((copy) => {
          gsap.fromTo(
            copy,
            {
              y: 55,
              opacity: 0.25,
            },
            {
              y: 0,
              opacity: 1,
              ease: "none",

              scrollTrigger: {
                trigger: copy,
                start: "top 95%",
                end: "top 40%",
                scrub: 0.45,
              },
            }
          );

          const services =
            copy.querySelectorAll<HTMLElement>(
              ".ws-service"
            );

          const serviceContainer =
            copy.querySelector<HTMLElement>(
              ".ws-services"
            );

          if (
            services.length > 0 &&
            serviceContainer
          ) {
            gsap.fromTo(
              services,
              {
                x: -25,
                opacity: 0.2,
              },
              {
                x: 0,
                opacity: 1,
                stagger: 0.16,
                ease: "power2.out",

                scrollTrigger: {
                  trigger: serviceContainer,
                  start: "top 95%",
                  end: "bottom 65%",
                  scrub: 0.5,
                },
              }
            );
          }
        });
      }
    );

    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(frame);
      media.revert();
    };
  }, [mounted, motionPreference]);

  return (
    <section
      ref={section}
      id="dal-codice-al-sito"
      className="ws-story"
      aria-label="Dalla progettazione al sito web"
    >
      {/* Scena 3D */}
      <div
        ref={scene}
        className="ws-scene"
        aria-hidden="true"
        style={{
          opacity: 0,
          visibility: "hidden",
        }}
      >
        <div
          ref={sceneExit}
          className="ws-scene-exit"
        >
          <div className="ws-light" />

          {mounted && visible && (
            <MachineBoundary>
              <Canvas
                dpr={[1, 1.5]}
                frameloop={
                  reducedMotion || !tabVisible
                    ? "demand"
                    : "always"
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
                fallback={<MonitorFallback />}
              >
                <SceneActivity
                  sectionSelector="#dal-codice-al-sito"
                />

                <Suspense fallback={null}>
                  <StudioLights />

                  <Machine
                    state={state}
                    reducedMotion={reducedMotion}
                  />
                </Suspense>
              </Canvas>
            </MachineBoundary>
          )}
        </div>
      </div>

      {/* Contenuti */}
      {CHAPTERS.map((chapter, index) => (
        <article
          key={chapter.number}
          className="ws-part"
        >
          <div className="ws-copy">
            <p className="ws-eyebrow">
              {chapter.number} / {chapter.label}
            </p>

            <h2>
              {chapter.title}
              <br />
              <span>{chapter.accent}</span>
            </h2>

            <p className="ws-description">
              {chapter.description}
            </p>

            <div className="ws-services">
              {chapter.services.map(
                ([title, description]) => (
                  <div
                    key={title}
                    className="ws-service"
                  >
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                )
              )}
            </div>

            {index === CHAPTERS.length - 1 && (
              <div className="ws-contact">
                <a href="#contatti">
                  Arriviamo al tuo progetto ↘
                </a>
              </div>
            )}

            <p className="ws-note">
              {chapter.note}
            </p>
          </div>
        </article>
      ))}

      {/* Stili completi della sequenza */}
      <style>{`
        .ws-story {
          position: relative;
          z-index: 7;
          background: transparent;
          color: #f6f2ff;
        }

        .ws-scene {
          position: fixed;
          inset: 0;
          height: 100svh;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .ws-scene-exit {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .ws-light {
          position: absolute;
          right: -5%;
          top: 10%;
          width: 75vw;
          height: 80vh;
          border-radius: 50%;
          background: radial-gradient(
            ellipse,
            rgba(75,91,175,.3),
            rgba(108,51,164,.12) 45%,
            transparent 70%
          );
          filter: blur(60px);
          pointer-events: none;
        }

        .ws-part {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 8vw;
          min-height: 115svh;
          padding:
            max(110px, 12svh)
            clamp(24px, 6vw, 100px);
          pointer-events: none;
        }

        .ws-copy {
          grid-column: 1;
          width: 100%;
          max-width: 500px;
          pointer-events: auto;
        }

        .ws-eyebrow {
          margin: 0 0 24px;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: .15em;
          line-height: 1.7;
          color: #a4dfff;
        }

        .ws-copy h2 {
          margin: 0;
          font-size: clamp(40px, 4.7vw, 74px);
          font-weight: 700;
          letter-spacing: -.06em;
          line-height: 1.02;
          text-wrap: balance;
        }

        .ws-copy h2 > span {
          color: #b9afff;
        }

        .ws-description {
          margin: 26px 0 0;
          max-width: 440px;
          font-size: 14px;
          line-height: 1.9;
          color: rgba(255,255,255,.64);
        }

        .ws-services {
          margin-top: 30px;
          border-top: 1px solid rgba(255,255,255,.14);
        }

        .ws-service {
          padding: 18px 0;
          border-bottom: 1px solid rgba(255,255,255,.1);
        }

        .ws-service h3 {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: -.02em;
        }

        .ws-service p {
          margin: 7px 0 0;
          font-size: 11px;
          line-height: 1.8;
          color: rgba(255,255,255,.5);
        }

        .ws-note {
          margin: 23px 0 0;
          font-size: 9px;
          line-height: 1.7;
          color: rgba(255,255,255,.35);
        }

        .ws-contact {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 16px;
          margin-top: 27px;
        }

        .ws-contact a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 49px;
          padding: 13px 22px;
          border-radius: 999px;
          background: #eee9ff;
          color: #180e29;
          font-size: 11px;
          font-weight: 700;
          transition:
            background-color 200ms ease,
            color 200ms ease;
        }

        .ws-contact a:hover {
          background: #c9f1ff;
        }

        .ws-contact a:focus-visible {
          outline: 2px solid #a5f3fc;
          outline-offset: 5px;
        }

        .ws-fallback {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          height: 100%;
          padding-right: 12%;
        }

        .ws-fallback > div {
          width: 40vw;
          max-width: 550px;
          aspect-ratio: 16 / 10;
          padding: 30px;
          border: 10px solid #4a5263;
          border-radius: 18px;
          background: linear-gradient(
            145deg,
            #0b1221,
            #3d316d
          );
        }

        .ws-fallback span {
          font-size: 8px;
          letter-spacing: .1em;
          color: #b8c6e3;
        }

        .ws-fallback strong {
          display: block;
          margin-top: 35px;
          font-size: clamp(20px, 3vw, 45px);
          line-height: 1.1;
          letter-spacing: -.05em;
        }

        @media (max-width:767px) and (orientation:portrait) {
          .ws-part {
            display: block;
            min-height: 130svh;
            padding: 95px 18px 52svh;
          }

          .ws-copy {
            max-width: 100%;
            padding: 24px 20px;
            border: 1px solid rgba(255,255,255,.09);
            border-radius: 24px;
            background: rgba(10,9,22,.92);
          }

          .ws-eyebrow {
            margin-bottom: 16px;
            font-size: 8px;
            letter-spacing: .08em;
          }

          .ws-copy h2 {
            font-size: clamp(33px, 9.3vw, 50px);
          }

          .ws-description {
            margin-top: 19px;
            font-size: 12px;
            line-height: 1.8;
          }

          .ws-services {
            margin-top: 23px;
          }

          .ws-service {
            padding: 14px 0;
          }

          .ws-service h3 {
            font-size: 13px;
          }

          .ws-service p {
            font-size: 10px;
          }

          .ws-contact {
            gap: 13px;
          }

          .ws-contact a {
            max-width: 100%;
            font-size: 10px;
            padding: 13px 18px;
          }

          .ws-light {
            top: 30%;
            right: -30%;
            width: 140vw;
            height: 65vh;
            filter: blur(45px);
          }

          .ws-fallback {
            align-items: flex-end;
            justify-content: center;
            padding: 0 20px 65px;
          }

          .ws-fallback > div {
            width: 88vw;
          }
        }

        @media (max-height:540px) and (orientation:landscape) {
          .ws-part {
            min-height: 165svh;
            padding: 90px 25px 70px;
            gap: 35px;
          }

          .ws-copy h2 {
            font-size: 36px;
          }

          .ws-description {
            font-size: 12px;
          }
        }

        @media (prefers-reduced-motion:reduce) {
          .ws-copy,
          .ws-service {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}