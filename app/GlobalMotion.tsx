"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * GLOBAL MOTION — LORENZO PIRAS
 * Livello decorativo indipendente dalle scene React Three Fiber.
 * Non modifica le timeline esistenti, non blocca lo scroll,
 * non sostituisce testi, contatti o componenti già presenti.
 * Le classi gm-* e gli attributi data-gm-* appartengono solo a questo file.
 */

type Phase = {
  id: string;
  label: string;
  caption: string;
  alignment: string;
  accent: string;
  secondary: string;
  highlight: string;
  frameOpacity: number;
  auraOpacity: number;
  rotation: number;
  travel: number;
  lineProgress: number;
  scaleFrom: number;
  scaleTo: number;
  entryStart: string;
  entryEnd: string;
  exitStart: string;
  exitEnd: string;
  scrub: number;
  stagger: number;
  dustShift: number;
  haloShift: number;
  reticleSize: number;
  frameInset: number;
  beamAngle: number;
  ornamentVariant: string;
};

const PHASES: Phase[] = [
  {
    id: "visione",
    label: "Visione",
    caption: "Identità prima degli effetti",
    alignment: "destra",
    accent: "#c4a5ff",
    secondary: "#72dce9",
    highlight: "#edb5ff",
    frameOpacity: 0.72,
    auraOpacity: 0.2,
    rotation: 10,
    travel: 30,
    lineProgress: 0.7,
    scaleFrom: 0.91,
    scaleTo: 1.015,
    entryStart: "top 92%",
    entryEnd: "top 34%",
    exitStart: "bottom 68%",
    exitEnd: "bottom 8%",
    scrub: 0.55,
    stagger: 0.055,
    dustShift: 20,
    haloShift: 8,
    reticleSize: 42,
    frameInset: 18,
    beamAngle: -32,
    ornamentVariant: "editorial",
  },
  {
    id: "atelier",
    label: "Direzione",
    caption: "Spazio, materia, tipografia",
    alignment: "sinistra",
    accent: "#e4c6a0",
    secondary: "#b39b7f",
    highlight: "#f0e4cf",
    frameOpacity: 0.56,
    auraOpacity: 0.16,
    rotation: -13,
    travel: 38,
    lineProgress: 0.7999999999999999,
    scaleFrom: 0.93,
    scaleTo: 1.0299999999999998,
    entryStart: "top 92%",
    entryEnd: "top 34%",
    exitStart: "bottom 68%",
    exitEnd: "bottom 8%",
    scrub: 0.63,
    stagger: 0.07,
    dustShift: 22,
    haloShift: 11,
    reticleSize: 50,
    frameInset: 26,
    beamAngle: -27,
    ornamentVariant: "orbital",
  },
  {
    id: "forma",
    label: "Interazione",
    caption: "Una gerarchia chiara",
    alignment: "destra",
    accent: "#b8efa8",
    secondary: "#69cbb6",
    highlight: "#dcf4b9",
    frameOpacity: 0.65,
    auraOpacity: 0.18,
    rotation: 16,
    travel: 46,
    lineProgress: 0.8999999999999999,
    scaleFrom: 0.9500000000000001,
    scaleTo: 1.015,
    entryStart: "top 92%",
    entryEnd: "top 34%",
    exitStart: "bottom 68%",
    exitEnd: "bottom 8%",
    scrub: 0.7100000000000001,
    stagger: 0.055,
    dustShift: 24,
    haloShift: 14,
    reticleSize: 58,
    frameInset: 34,
    beamAngle: -22,
    ornamentVariant: "technical",
  },
  {
    id: "pulse",
    label: "Movimento",
    caption: "Il ritmo sostiene il messaggio",
    alignment: "sinistra",
    accent: "#f0a3df",
    secondary: "#9985ff",
    highlight: "#82def1",
    frameOpacity: 0.78,
    auraOpacity: 0.22,
    rotation: -19,
    travel: 54,
    lineProgress: 0.7,
    scaleFrom: 0.91,
    scaleTo: 1.0299999999999998,
    entryStart: "top 92%",
    entryEnd: "top 34%",
    exitStart: "bottom 68%",
    exitEnd: "bottom 8%",
    scrub: 0.55,
    stagger: 0.07,
    dustShift: 26,
    haloShift: 17,
    reticleSize: 42,
    frameInset: 18,
    beamAngle: -17,
    ornamentVariant: "editorial",
  },
  {
    id: "metodo",
    label: "Struttura",
    caption: "Ogni livello ha uno scopo",
    alignment: "destra",
    accent: "#95d8f1",
    secondary: "#8caaff",
    highlight: "#d2c4ff",
    frameOpacity: 0.6,
    auraOpacity: 0.16,
    rotation: 22,
    travel: 30,
    lineProgress: 0.7999999999999999,
    scaleFrom: 0.93,
    scaleTo: 1.015,
    entryStart: "top 92%",
    entryEnd: "top 34%",
    exitStart: "bottom 68%",
    exitEnd: "bottom 8%",
    scrub: 0.63,
    stagger: 0.055,
    dustShift: 28,
    haloShift: 8,
    reticleSize: 50,
    frameInset: 26,
    beamAngle: -12,
    ornamentVariant: "orbital",
  },
  {
    id: "dialogo",
    label: "Prospettiva",
    caption: "Dalle idee alle possibilità",
    alignment: "sinistra",
    accent: "#e2b3f0",
    secondary: "#9db7ee",
    highlight: "#f4d0eb",
    frameOpacity: 0.55,
    auraOpacity: 0.14,
    rotation: -25,
    travel: 38,
    lineProgress: 0.8999999999999999,
    scaleFrom: 0.9500000000000001,
    scaleTo: 1.0299999999999998,
    entryStart: "top 92%",
    entryEnd: "top 34%",
    exitStart: "bottom 68%",
    exitEnd: "bottom 8%",
    scrub: 0.7100000000000001,
    stagger: 0.07,
    dustShift: 30,
    haloShift: 11,
    reticleSize: 58,
    frameInset: 34,
    beamAngle: -7,
    ornamentVariant: "technical",
  },
  {
    id: "strategia",
    label: "Strategia",
    caption: "Obiettivi e contenuti",
    alignment: "destra",
    accent: "#b1c6f9",
    secondary: "#a5b0f1",
    highlight: "#ccdef5",
    frameOpacity: 0.6,
    auraOpacity: 0.16,
    rotation: 28,
    travel: 46,
    lineProgress: 0.7,
    scaleFrom: 0.91,
    scaleTo: 1.015,
    entryStart: "top 92%",
    entryEnd: "top 34%",
    exitStart: "bottom 68%",
    exitEnd: "bottom 8%",
    scrub: 0.55,
    stagger: 0.055,
    dustShift: 32,
    haloShift: 14,
    reticleSize: 42,
    frameInset: 18,
    beamAngle: -2,
    ornamentVariant: "editorial",
  },
  {
    id: "progetto",
    label: "Progetto",
    caption: "La forma segue il carattere",
    alignment: "destra",
    accent: "#c1b2f0",
    secondary: "#87d9e9",
    highlight: "#ded0ff",
    frameOpacity: 0.66,
    auraOpacity: 0.18,
    rotation: -31,
    travel: 54,
    lineProgress: 0.7999999999999999,
    scaleFrom: 0.93,
    scaleTo: 1.0299999999999998,
    entryStart: "top 92%",
    entryEnd: "top 34%",
    exitStart: "bottom 68%",
    exitEnd: "bottom 8%",
    scrub: 0.63,
    stagger: 0.07,
    dustShift: 34,
    haloShift: 17,
    reticleSize: 50,
    frameInset: 26,
    beamAngle: 3,
    ornamentVariant: "orbital",
  },
  {
    id: "codice",
    label: "Sviluppo",
    caption: "Dalla struttura al comportamento",
    alignment: "destra",
    accent: "#9fd6f4",
    secondary: "#bfa6ee",
    highlight: "#97e6c9",
    frameOpacity: 0.7,
    auraOpacity: 0.2,
    rotation: 34,
    travel: 30,
    lineProgress: 0.8999999999999999,
    scaleFrom: 0.9500000000000001,
    scaleTo: 1.015,
    entryStart: "top 92%",
    entryEnd: "top 34%",
    exitStart: "bottom 68%",
    exitEnd: "bottom 8%",
    scrub: 0.7100000000000001,
    stagger: 0.055,
    dustShift: 36,
    haloShift: 8,
    reticleSize: 58,
    frameInset: 34,
    beamAngle: 8,
    ornamentVariant: "technical",
  },
  {
    id: "esperienza",
    label: "Esperienza",
    caption: "Una composizione, più schermi",
    alignment: "destra",
    accent: "#add4bb",
    secondary: "#a1bfdb",
    highlight: "#e2d5b4",
    frameOpacity: 0.62,
    auraOpacity: 0.17,
    rotation: -37,
    travel: 38,
    lineProgress: 0.7,
    scaleFrom: 0.91,
    scaleTo: 1.0299999999999998,
    entryStart: "top 92%",
    entryEnd: "top 34%",
    exitStart: "bottom 68%",
    exitEnd: "bottom 8%",
    scrub: 0.55,
    stagger: 0.07,
    dustShift: 38,
    haloShift: 11,
    reticleSize: 42,
    frameInset: 18,
    beamAngle: 13,
    ornamentVariant: "editorial",
  },
  {
    id: "rifinitura",
    label: "Rifinitura",
    caption: "Controllare, migliorare, pubblicare",
    alignment: "destra",
    accent: "#bebbf6",
    secondary: "#a0daf0",
    highlight: "#dbb8ef",
    frameOpacity: 0.56,
    auraOpacity: 0.15,
    rotation: 40,
    travel: 46,
    lineProgress: 0.7999999999999999,
    scaleFrom: 0.93,
    scaleTo: 1.015,
    entryStart: "top 92%",
    entryEnd: "top 34%",
    exitStart: "bottom 68%",
    exitEnd: "bottom 8%",
    scrub: 0.63,
    stagger: 0.055,
    dustShift: 40,
    haloShift: 14,
    reticleSize: 50,
    frameInset: 26,
    beamAngle: 18,
    ornamentVariant: "orbital",
  },
  {
    id: "contatto",
    label: "Incontro",
    caption: "Il prossimo progetto inizia qui",
    alignment: "centro",
    accent: "#dfb7f4",
    secondary: "#adc8f0",
    highlight: "#f2d5ee",
    frameOpacity: 0.48,
    auraOpacity: 0.12,
    rotation: -43,
    travel: 54,
    lineProgress: 0.8999999999999999,
    scaleFrom: 0.9500000000000001,
    scaleTo: 1.0299999999999998,
    entryStart: "top 92%",
    entryEnd: "top 34%",
    exitStart: "bottom 68%",
    exitEnd: "bottom 8%",
    scrub: 0.7100000000000001,
    stagger: 0.07,
    dustShift: 42,
    haloShift: 17,
    reticleSize: 58,
    frameInset: 34,
    beamAngle: 23,
    ornamentVariant: "technical",
  },
];

const SECTION_SELECTOR = [
  ".studio-main [data-scene]",
  ".ws-story .ws-part",
  ".final-contact",
].join(", ");

const DUST = Array.from({ length: 18 }, (_, index) => ({
  left: 5 + ((index * 37) % 90),
  top: 5 + ((index * 23) % 90),
  radius: index % 4 === 0 ? 2 : 1,
  opacity: 0.12 + (index % 4) * 0.055,
}));

function phaseStyle(phase: Phase): CSSProperties {
  return {
    "--gm-accent": phase.accent,
    "--gm-secondary": phase.secondary,
    "--gm-highlight": phase.highlight,
    "--gm-frame-opacity": phase.frameOpacity,
    "--gm-aura-opacity": phase.auraOpacity,
    "--gm-reticle": `${phase.reticleSize}px`,
    "--gm-inset": `${phase.frameInset}px`,
    "--gm-beam-angle": `${phase.beamAngle}deg`,
  } as CSSProperties;
}

function Reticle({ className = "" }: { className?: string }) {
  return (
    <span className={`gm-reticle ${className}`}>
      <i />
      <b />
      <em />
    </span>
  );
}

/** Elementi di sezione: il portal non aggiunge altezza al layout. */
function SectionOrnament({ phase, index }: { phase: Phase; index: number }) {
  return (
    <div
      className={`gm-phase gm-variant-${phase.ornamentVariant}`}
      data-gm-phase={phase.id}
      data-gm-align={phase.alignment}
      style={phaseStyle(phase)}
      aria-hidden="true"
    >
      <div className="gm-phase-entrance" data-gm-entrance>
        <div className="gm-phase-aura" data-gm-aura />
        <div className="gm-phase-beam" data-gm-beam />
        <div className="gm-phase-surface" data-gm-surface />
        <div className="gm-phase-frame" data-gm-frame>
          <i className="gm-corner gm-corner-tl" />
          <i className="gm-corner gm-corner-tr" />
          <i className="gm-corner gm-corner-bl" />
          <i className="gm-corner gm-corner-br" />
        </div>
        <div className="gm-phase-lines">
          <svg viewBox="0 0 1000 640" preserveAspectRatio="none" fill="none">
            <path data-gm-draw d="M30 80 H240 L320 160 H550 L640 70 H970" />
            <path data-gm-draw d="M35 540 H210 L285 465 H600 L690 555 H965" />
            <path className="gm-subtle-path" d="M60 320 H940" />
          </svg>
        </div>
        <div className="gm-phase-orbit" data-gm-orbit>
          <svg viewBox="0 0 400 400" fill="none">
            <circle cx="200" cy="200" r="172" />
            <ellipse cx="200" cy="200" rx="180" ry="72" transform="rotate(-32 200 200)" />
            <path d="M200 12 V35 M200 365 V388 M12 200 H35 M365 200 H388" />
            <circle className="gm-orbit-point" cx="200" cy="28" r="3" />
          </svg>
        </div>
        <Reticle className="gm-reticle-one" />
        <Reticle className="gm-reticle-two" />
        <div className="gm-phase-caption" data-gm-caption>
          <span className="gm-phase-number">{String(index + 1).padStart(2, "0")}</span>
          <span className="gm-phase-name">{phase.label}</span>
          <span className="gm-caption-rule" />
          <span className="gm-phase-note">{phase.caption}</span>
        </div>
        <div className="gm-phase-rail">
          {Array.from({ length: 9 }, (_, mark) => (
            <i key={mark} data-gm-tick />
          ))}
        </div>
        <div className="gm-phase-grain" />
      </div>
    </div>
  );
}

export default function GlobalMotion() {
  const root = useRef<HTMLDivElement>(null);
  const pointer = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [sections, setSections] = useState<HTMLElement[]>([]);
  const [active, setActive] = useState(0);
  const [enabled, setEnabled] = useState(true);
  const [systemReduced, setSystemReduced] = useState(false);
  const [paused, setPaused] = useState(false);

  /** Raccoglie soltanto le sezioni della struttura già creata. */
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(SECTION_SELECTOR)
    );
    setSections(elements.slice(0, PHASES.length));

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setSystemReduced(preference.matches);
    const updateVisibility = () => setPaused(document.hidden);
    updatePreference();
    updateVisibility();
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", updateVisibility);

    return () => {
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  /**
   * Tutti i tween appartengono a questo matchMedia.
   * Nessun kill globale: le scene iPhone e monitor rimangono indipendenti.
   */
  useEffect(() => {
    if (!sections.length || !enabled || !root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    let alive = true;
    let refreshFrame = 0;

    media.add(
      {
        desktop: "(min-width: 1024px)",
        tablet: "(min-width: 768px) and (max-width: 1023px)",
        mobile: "(max-width: 767px)",
        fine: "(hover: hover) and (pointer: fine)",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const conditions = context.conditions as Record<string, boolean>;
        if (conditions.reduce) return;
        const mobile = conditions.mobile;

        sections.forEach((section, index) => {
          const phase = PHASES[index];
          const ornament = section.querySelector<HTMLElement>(".gm-phase");
          if (!phase || !ornament) return;

          const entrance = ornament.querySelector("[data-gm-entrance]");
          const frame = ornament.querySelector("[data-gm-frame]");
          const aura = ornament.querySelector("[data-gm-aura]");
          const orbit = ornament.querySelector("[data-gm-orbit]");
          const beam = ornament.querySelector("[data-gm-beam]");
          const surface = ornament.querySelector("[data-gm-surface]");
          const caption = ornament.querySelector("[data-gm-caption]");
          const ticks = ornament.querySelectorAll("[data-gm-tick]");
          const paths = ornament.querySelectorAll<SVGPathElement>("[data-gm-draw]");

          const entry = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: phase.entryStart,
              end: phase.entryEnd,
              scrub: phase.scrub,
              invalidateOnRefresh: true,
            },
          });

          entry.fromTo(
            entrance,
            { opacity: 0, y: mobile ? 14 : phase.travel },
            { opacity: 1, y: 0, duration: 1, ease: "none" },
            0
          );
          entry.fromTo(
            frame,
            { scale: phase.scaleFrom },
            { scale: 1, duration: 1, ease: "power2.out" },
            0
          );
          entry.fromTo(
            caption,
            { x: -16, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: "none" },
            0.1
          );
          entry.fromTo(
            ticks,
            { scaleY: 0.1, opacity: 0.1 },
            { scaleY: 1, opacity: 1, stagger: phase.stagger, duration: 0.55 },
            0.05
          );

          paths.forEach((path, pathIndex) => {
            const length = path.getTotalLength();
            entry.fromTo(
              path,
              { strokeDasharray: length, strokeDashoffset: length },
              {
                strokeDashoffset: length * (1 - phase.lineProgress),
                duration: 1,
                ease: "none",
              },
              pathIndex * 0.1
            );
          });

          const travel = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });
          travel.fromTo(
            orbit,
            { rotation: -phase.rotation, scale: 0.95 },
            { rotation: phase.rotation, scale: phase.scaleTo, duration: 1, ease: "none" },
            0
          );
          travel.fromTo(
            aura,
            { yPercent: phase.haloShift },
            { yPercent: -phase.haloShift, duration: 1, ease: "none" },
            0
          );
          travel.fromTo(
            beam,
            { xPercent: -25 },
            { xPercent: 25, duration: 1, ease: "none" },
            0
          );
          travel.fromTo(
            surface,
            { yPercent: 5 },
            { yPercent: -5, duration: 1, ease: "none" },
            0
          );

          // L'uscita anima il portal esterno, non gli stessi target dell'ingresso.
          gsap.fromTo(
            ornament,
            { opacity: 1 },
            {
              opacity: 0,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: phase.exitStart,
                end: phase.exitEnd,
                scrub: phase.scrub,
              },
            }
          );

          ScrollTrigger.create({
            trigger: section,
            start: "top 52%",
            end: "bottom 52%",
            onToggle(self) {
              if (self.isActive && activeRef.current !== index) {
                activeRef.current = index;
                setActive(index);
              }
            },
          });
        });

        const main = document.querySelector(".studio-page");
        const dust = root.current?.querySelectorAll(".gm-dust-point");
        if (main && dust?.length) {
          gsap.fromTo(
            dust,
            { y: 20, rotation: 0 },
            {
              y: (index: number) => -(45 + PHASES[index % PHASES.length].dustShift),
              rotation: 90,
              ease: "none",
              scrollTrigger: {
                trigger: main,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
              },
            }
          );
        }

        // Il puntatore luminoso esiste solo con mouse o trackpad.
        if (conditions.fine && !mobile && pointer.current) {
          const point = pointer.current;
          const moveX = gsap.quickTo(point, "x", { duration: 0.65, ease: "power3.out" });
          const moveY = gsap.quickTo(point, "y", { duration: 0.65, ease: "power3.out" });
          gsap.set(point, { x: window.innerWidth / 2, y: window.innerHeight / 2 });
          const onMove = (event: PointerEvent) => {
            if (document.hidden || event.pointerType === "touch") return;
            moveX(event.clientX);
            moveY(event.clientY);
          };
          window.addEventListener("pointermove", onMove, { passive: true });
          return () => {
            window.removeEventListener("pointermove", onMove);
            moveX.tween.kill();
            moveY.tween.kill();
          };
        }
      }
    );

    const refresh = () => {
      if (!alive) return;
      refreshFrame = requestAnimationFrame(() => {
        if (alive) ScrollTrigger.refresh();
      });
    };
    refresh();
    void document.fonts.ready.then(refresh);

    return () => {
      alive = false;
      cancelAnimationFrame(refreshFrame);
      media.revert();
    };
  }, [sections, enabled]);

  const current = PHASES[Math.min(active, PHASES.length - 1)];
  const motionAvailable = enabled && !systemReduced;

  function goTo(index: number) {
    sections[index]?.scrollIntoView({
      behavior: systemReduced ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <>
      {sections.map((section, index) =>
        createPortal(
          <div className={motionAvailable ? "gm-slot" : "gm-slot gm-hidden"}>
            <SectionOrnament phase={PHASES[index]} index={index} />
          </div>,
          section,
          `gm-section-${index}`
        )
      )}

      <div
        ref={root}
        className={`gm-world ${motionAvailable ? "" : "gm-hidden"}`}
        data-gm-paused={paused ? "true" : "false"}
        style={phaseStyle(current)}
        aria-hidden="true"
      >
        <div className="gm-atmosphere gm-atmosphere-a" />
        <div className="gm-atmosphere gm-atmosphere-b" />
        <div className="gm-world-grid" />
        <div className="gm-world-vignette" />
        <div className="gm-pointer" ref={pointer}>
          <span />
        </div>
        <div className="gm-dust">
          {DUST.map((point, index) => (
            <i
              className="gm-dust-point"
              key={index}
              style={{
                left: `${point.left}%`,
                top: `${point.top}%`,
                width: point.radius * 2,
                height: point.radius * 2,
                opacity: point.opacity,
              }}
            />
          ))}
        </div>
        <div className="gm-world-corners">
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>

      {sections.length > 0 && (
        <nav className="gm-navigator" aria-label="Navigazione dei capitoli">
          <span className="gm-nav-label">Percorso</span>
          {sections.map((_, index) => (
            <button
              key={PHASES[index].id}
              type="button"
              className={index === active ? "gm-nav-stop gm-is-active" : "gm-nav-stop"}
              aria-label={`Vai al capitolo ${index + 1}: ${PHASES[index].label}`}
              aria-current={index === active ? "step" : undefined}
              onClick={() => goTo(index)}
            >
              <span className="gm-nav-marker" />
              <span className="gm-nav-tooltip">{PHASES[index].label}</span>
            </button>
          ))}
        </nav>
      )}

      <div className="gm-controls">
        <button
          type="button"
          className="gm-toggle"
          aria-pressed={enabled}
          onClick={() => setEnabled((value) => !value)}
        >
          <span className="gm-toggle-symbol" aria-hidden="true">✦</span>
          <span>{systemReduced ? "Movimento ridotto" : enabled ? "Effetti attivi" : "Effetti aggiuntivi spenti"}</span>
        </button>
        <span className="gm-control-note">Solo livello decorativo</span>
      </div>

      <style>{GLOBAL_MOTION_CSS}</style>
    </>
  );
}

const GLOBAL_MOTION_CSS = `
.gm-hidden {
  display: none !important;
}

.gm-slot {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
  border-radius: inherit;
}

.gm-phase {
  position: absolute;
  inset: 0;
  pointer-events: none;
  color: var(--gm-accent);
  isolation: isolate;
}

.gm-phase * {
  box-sizing: border-box;
  pointer-events: none;
}

.gm-phase-entrance {
  position: absolute;
  inset: 0;
  transform-origin: 50% 50%;
}

.gm-phase-aura {
  position: absolute;
  top: 15%;
  right: -8%;
  width: 62%;
  height: 70%;
  border-radius: 50%;
  background: radial-gradient(ellipse, var(--gm-accent), transparent 68%);
  opacity: var(--gm-aura-opacity);
  filter: blur(45px);
}

.gm-phase-beam {
  position: absolute;
  left: 15%;
  top: 30%;
  width: 70%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gm-secondary), transparent);
  opacity: .18;
  transform: rotate(var(--gm-beam-angle));
  transform-origin: center;
}

.gm-phase-surface {
  position: absolute;
  left: var(--gm-inset);
  right: var(--gm-inset);
  top: 12%;
  bottom: 12%;
  border-radius: 32px;
  background: linear-gradient(120deg, rgba(255,255,255,.012), transparent 45%, rgba(255,255,255,.015));
  opacity: .65;
}

.gm-phase-frame {
  position: absolute;
  left: var(--gm-inset);
  right: var(--gm-inset);
  top: 10%;
  bottom: 10%;
  border-radius: 28px;
  opacity: var(--gm-frame-opacity);
  transform-origin: center;
}

.gm-corner {
  position: absolute;
  display: block;
  width: 40px;
  height: 40px;
  border-color: currentColor;
  border-style: solid;
  border-width: 0;
  opacity: .35;
}

.gm-corner-tl {
  top: 0;
  left: 0;
  border-top-width: 1px;
  border-left-width: 1px;
  border-top-left-radius: 20px;
}

.gm-corner-tr {
  top: 0;
  right: 0;
  border-top-width: 1px;
  border-right-width: 1px;
  border-top-right-radius: 20px;
}

.gm-corner-bl {
  bottom: 0;
  left: 0;
  border-bottom-width: 1px;
  border-left-width: 1px;
  border-bottom-left-radius: 20px;
}

.gm-corner-br {
  bottom: 0;
  right: 0;
  border-bottom-width: 1px;
  border-right-width: 1px;
  border-bottom-right-radius: 20px;
}

.gm-phase-lines {
  position: absolute;
  inset: 10% 2%;
  opacity: .15;
}

.gm-phase-lines svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.gm-phase-lines path {
  stroke: currentColor;
  stroke-width: .65;
  vector-effect: non-scaling-stroke;
}

.gm-phase-lines .gm-subtle-path {
  stroke-dasharray: 2 18;
  opacity: .35;
}

.gm-phase-orbit {
  position: absolute;
  top: 50%;
  left: 74%;
  width: min(40vw, 60vh);
  aspect-ratio: 1;
  margin-left: calc(min(40vw, 60vh) / -2);
  margin-top: calc(min(40vw, 60vh) / -2);
  opacity: .13;
  transform-origin: 50% 50%;
}

.gm-phase-orbit svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.gm-phase-orbit circle, .gm-phase-orbit ellipse, .gm-phase-orbit path {
  stroke: currentColor;
  stroke-width: .75;
  vector-effect: non-scaling-stroke;
}

.gm-phase-orbit .gm-orbit-point {
  fill: var(--gm-highlight);
  stroke: none;
}

.gm-reticle {
  position: absolute;
  display: block;
  width: var(--gm-reticle);
  height: var(--gm-reticle);
  opacity: .3;
}

.gm-reticle i {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: currentColor;
}

.gm-reticle b {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: currentColor;
}

.gm-reticle em {
  position: absolute;
  inset: 30%;
  border: 1px solid currentColor;
  border-radius: 50%;
}

.gm-reticle-one {
  top: 18%;
  right: 9%;
}

.gm-reticle-two {
  bottom: 18%;
  left: 5%;
  opacity: .16;
  transform: scale(.65);
}

.gm-phase-caption {
  position: absolute;
  left: clamp(26px, 6vw, 100px);
  right: clamp(26px, 6vw, 100px);
  bottom: 5%;
  display: flex;
  align-items: center;
  gap: 14px;
  max-width: 650px;
}

.gm-phase-number {
  font-family: var(--font-geist-mono), monospace;
  font-size: 11px;
  letter-spacing: .02em;
  color: var(--gm-accent);
}

.gm-phase-name {
  font-size: 9px;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--gm-highlight);
  white-space: nowrap;
}

.gm-caption-rule {
  display: block;
  width: 55px;
  height: 1px;
  background: currentColor;
  opacity: .35;
}

.gm-phase-note {
  font-size: 9px;
  letter-spacing: .03em;
  color: rgba(255,255,255,.32);
  line-height: 1.5;
}

.gm-phase-rail {
  position: absolute;
  top: 22%;
  bottom: 22%;
  right: 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 12px;
  opacity: .25;
}

.gm-phase-rail i {
  display: block;
  width: 8px;
  height: 1px;
  background: currentColor;
  transform-origin: center;
}

.gm-phase-rail i:nth-child(3n) {
  width: 12px;
  opacity: .6;
}

.gm-phase-grain {
  position: absolute;
  inset: 0;
  opacity: .012;
  background-image: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,.3) 4px);
  mix-blend-mode: screen;
}

.gm-world {
  position: fixed;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
  isolation: isolate;
}

.gm-world * {
  pointer-events: none;
}

.gm-atmosphere {
  position: absolute;
  width: 55vw;
  height: 65vh;
  border-radius: 50%;
  filter: blur(70px);
  opacity: .035;
  transition: background-color 700ms ease;
}

.gm-atmosphere-a {
  top: -20%;
  left: -20%;
  background: var(--gm-accent);
}

.gm-atmosphere-b {
  bottom: -25%;
  right: -15%;
  background: var(--gm-secondary);
}

.gm-world-grid {
  position: absolute;
  inset: 0;
  opacity: .015;
  background-image: linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px);
  background-size: 120px 120px;
  mask-image: radial-gradient(ellipse at center, transparent 20%, black 100%);
  -webkit-mask-image: radial-gradient(ellipse at center, transparent 20%, black 100%);
}

.gm-world-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 55%, rgba(3,2,8,.12));
}

.gm-pointer {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
}

.gm-pointer > span {
  position: absolute;
  display: block;
  width: 360px;
  height: 360px;
  left: -180px;
  top: -180px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(185,140,255,.045), transparent 65%);
}

.gm-dust {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.gm-dust-point {
  position: absolute;
  display: block;
  border-radius: 50%;
  background: var(--gm-highlight);
}

.gm-world-corners {
  position: absolute;
  inset: 92px 16px 18px;
  opacity: .16;
}

.gm-world-corners > i {
  position: absolute;
  display: block;
  width: 12px;
  height: 12px;
  border-color: var(--gm-accent);
  border-style: solid;
  border-width: 0;
}

.gm-world-corners > i:nth-child(1) {
  top: 0;
  left: 0;
  border-top-width: 1px;
  border-left-width: 1px;
}

.gm-world-corners > i:nth-child(2) {
  top: 0;
  right: 0;
  border-top-width: 1px;
  border-right-width: 1px;
}

.gm-world-corners > i:nth-child(3) {
  bottom: 0;
  left: 0;
  border-bottom-width: 1px;
  border-left-width: 1px;
}

.gm-world-corners > i:nth-child(4) {
  bottom: 0;
  right: 0;
  border-bottom-width: 1px;
  border-right-width: 1px;
}

.gm-controls {
  position: fixed;
  bottom: 18px;
  left: 18px;
  z-index: 85;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
}

.gm-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 8px 13px;
  border: 1px solid rgba(255,255,255,.14);
  border-radius: 999px;
  background: rgba(12,8,22,.88);
  color: rgba(255,255,255,.72);
  font-family: inherit;
  font-size: 10px;
  line-height: 1.4;
  cursor: pointer;
  box-shadow: 0 8px 30px rgba(0,0,0,.14);
  transition: background-color 180ms ease, border-color 180ms ease;
}

.gm-toggle-symbol {
  font-size: 12px;
  color: #cdb3f4;
}

.gm-control-note {
  padding-left: 10px;
  font-size: 7px;
  letter-spacing: .05em;
  color: rgba(255,255,255,.3);
}

.gm-toggle:hover {
  background: #21162f;
  border-color: rgba(206,175,255,.4);
}

.gm-toggle:focus-visible {
  outline: 2px solid #a5e6f8;
  outline-offset: 4px;
}

.gm-toggle[aria-pressed="false"] .gm-toggle-symbol {
  color: rgba(255,255,255,.35);
}

.gm-navigator {
  position: fixed;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 55;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  padding: 10px 3px;
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 999px;
  background: rgba(8,5,15,.45);
}

.gm-nav-label {
  position: absolute;
  right: 34px;
  top: -24px;
  font-size: 7px;
  letter-spacing: .15em;
  text-transform: uppercase;
  color: rgba(255,255,255,.3);
}

.gm-nav-stop {
  position: relative;
  display: grid;
  place-items: center;
  width: 22px;
  height: 21px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
}

.gm-nav-marker {
  display: block;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(255,255,255,.25);
  transition: background-color 200ms ease, transform 200ms ease;
}

.gm-nav-stop.gm-is-active .gm-nav-marker {
  background: #d8b4fe;
  transform: scale(1.6);
}

.gm-nav-tooltip {
  position: absolute;
  right: 32px;
  top: 50%;
  transform: translateY(-50%) translateX(3px);
  padding: 7px 11px;
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 8px;
  background: #100b1b;
  font-size: 10px;
  color: #e9ddfa;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 150ms ease, transform 150ms ease;
  pointer-events: none;
}

.gm-nav-stop:hover .gm-nav-tooltip, .gm-nav-stop:focus-visible .gm-nav-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(0);
}

.gm-nav-stop:focus-visible {
  outline: 1px solid #b6eafb;
  outline-offset: 1px;
}

.gm-variant-editorial .gm-phase-orbit {
  opacity: .075;
}

.gm-variant-editorial .gm-phase-lines {
  opacity: .12;
}

.gm-variant-editorial .gm-corner {
  width: 55px;
  height: 28px;
  border-radius: 0;
}

.gm-variant-editorial .gm-phase-surface {
  border-radius: 0;
  background: linear-gradient(100deg, rgba(255,255,255,.018), transparent 70%);
}

.gm-variant-orbital .gm-phase-orbit {
  opacity: .16;
}

.gm-variant-orbital .gm-phase-lines {
  opacity: .075;
}

.gm-variant-orbital .gm-reticle-one {
  transform: rotate(45deg);
}

.gm-variant-orbital .gm-phase-frame {
  border-radius: 50%;
}

.gm-variant-technical .gm-phase-lines {
  opacity: .2;
}

.gm-variant-technical .gm-phase-grain {
  opacity: .018;
}

.gm-variant-technical .gm-corner {
  border-radius: 2px;
  width: 25px;
  height: 25px;
}

.gm-variant-technical .gm-phase-orbit {
  opacity: .09;
}

.gm-phase[data-gm-align="sinistra"] .gm-phase-aura {
  right: auto;
  left: -8%;
}

.gm-phase[data-gm-align="sinistra"] .gm-phase-orbit {
  left: 26%;
}

.gm-phase[data-gm-align="sinistra"] .gm-reticle-one {
  right: auto;
  left: 9%;
}

.gm-phase[data-gm-align="sinistra"] .gm-reticle-two {
  left: auto;
  right: 5%;
}

.gm-phase[data-gm-align="centro"] .gm-phase-aura {
  left: 10%;
  right: 10%;
  width: 80%;
}

.gm-phase[data-gm-align="centro"] .gm-phase-orbit {
  left: 50%;
  opacity: .06;
}

.studio-page :is(.studio-primary, .studio-nav-cta, .ws-contact a, .final-contact-primary) {
  transition-property: background-color, color, box-shadow, border-color;
  transition-duration: 220ms;
  transition-timing-function: ease;
}

.studio-page :is(.studio-outline, .final-contact-secondary) {
  transition-property: background-color, color, border-color, box-shadow;
  transition-duration: 220ms;
  transition-timing-function: ease;
}

.studio-page :is(.studio-text-link, .studio-nav nav a, .final-contact-bottom a) {
  text-decoration-color: transparent;
  text-underline-offset: 5px;
  text-decoration-thickness: 1px;
  transition: color 180ms ease, text-decoration-color 180ms ease;
}

.studio-page :is(.studio-primary, .studio-outline, .studio-nav-cta, .ws-contact a, .final-contact-primary, .final-contact-secondary):focus-visible {
  outline: 2px solid #a5e6f8;
  outline-offset: 5px;
}

.gm-world[data-gm-paused="true"] *, .gm-world[data-gm-paused="true"] *::before, .gm-world[data-gm-paused="true"] *::after {
  animation-play-state: paused !important;
}

@media (hover: hover) and (pointer: fine) {
  .studio-page :is(.studio-primary, .studio-nav-cta, .ws-contact a, .final-contact-primary):hover {
    box-shadow: 0 10px 35px rgba(190,160,255,.13);
    border-color: rgba(255,255,255,.35);
  }

  .studio-page :is(.studio-outline, .final-contact-secondary):hover {
    background-color: rgba(188,157,255,.075);
    border-color: rgba(207,178,255,.42);
    box-shadow: inset 0 0 0 1px rgba(207,178,255,.04);
  }

  .studio-page :is(.studio-text-link, .studio-nav nav a, .final-contact-bottom a):hover {
    text-decoration-line: underline;
    text-decoration-color: rgba(221,203,255,.5);
    color: #eee5fa;
  }

  .gm-nav-stop:hover .gm-nav-marker {
    background: #e7d3ff;
    transform: scale(1.4);
  }
}

@media (min-width: 1600px) {
  .gm-phase-frame {
    left: 40px;
    right: 40px;
    top: 12%;
    bottom: 12%;
  }

  .gm-phase-caption {
    bottom: 7%;
    gap: 18px;
    max-width: 750px;
  }

  .gm-phase-name {
    font-size: 10px;
    letter-spacing: .17em;
  }

  .gm-phase-note {
    font-size: 10px;
    line-height: 1.6;
  }

  .gm-corner {
    width: 58px;
    height: 58px;
  }

  .gm-phase-rail {
    right: 35px;
    top: 25%;
    bottom: 25%;
  }

  .gm-world-grid {
    background-size: 150px 150px;
    opacity: .012;
  }

  .gm-controls {
    left: 25px;
    bottom: 24px;
  }

  .gm-navigator {
    right: 18px;
    padding: 14px 5px;
  }
}

@media (min-width: 1280px) and (max-width: 1599px) {
  .gm-phase-frame {
    left: 28px;
    right: 28px;
    top: 11%;
    bottom: 11%;
  }

  .gm-phase-caption {
    bottom: 6%;
    gap: 13px;
  }

  .gm-phase-orbit {
    width: min(38vw, 62vh);
    margin-left: calc(min(38vw, 62vh) / -2);
    margin-top: calc(min(38vw, 62vh) / -2);
  }

  .gm-reticle-one {
    top: 18%;
    right: 8%;
  }

  .gm-reticle-two {
    bottom: 18%;
    left: 5%;
  }

  .gm-phase-rail {
    right: 23px;
    opacity: .2;
  }

  .gm-world-corners {
    inset: 92px 14px 17px;
  }

  .gm-nav-stop {
    height: 20px;
    width: 21px;
  }

  .gm-toggle {
    font-size: 9px;
    min-height: 36px;
  }
}

@media (min-width: 1024px) and (max-width: 1279px) {
  .gm-phase-frame {
    left: 20px;
    right: 20px;
    top: 12%;
    bottom: 12%;
  }

  .gm-phase-aura {
    width: 55%;
    filter: blur(35px);
    opacity: calc(var(--gm-aura-opacity) * .8);
  }

  .gm-phase-caption {
    left: 6vw;
    right: 6vw;
    bottom: 6%;
    gap: 10px;
  }

  .gm-phase-note {
    max-width: 210px;
    font-size: 8px;
  }

  .gm-caption-rule {
    width: 35px;
  }

  .gm-phase-orbit {
    width: 36vw;
    margin-left: -18vw;
    margin-top: -18vw;
  }

  .gm-reticle-one {
    right: 6%;
    top: 17%;
  }

  .gm-reticle-two {
    left: 4%;
    bottom: 16%;
    opacity: .12;
  }

  .gm-phase-rail {
    right: 15px;
    opacity: .16;
  }

  .gm-navigator {
    right: 6px;
    padding: 8px 2px;
  }

  .gm-nav-stop {
    height: 19px;
    width: 18px;
  }

  .gm-nav-label {
    display: none;
  }

  .gm-world-grid {
    background-size: 100px 100px;
    opacity: .012;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .gm-phase-frame {
    left: 15px;
    right: 15px;
    top: 11%;
    bottom: 11%;
  }

  .gm-corner {
    width: 26px;
    height: 26px;
    opacity: .25;
  }

  .gm-phase-caption {
    left: 5vw;
    right: 5vw;
    bottom: 5%;
    gap: 9px;
  }

  .gm-phase-number {
    font-size: 10px;
  }

  .gm-phase-name {
    font-size: 8px;
    letter-spacing: .1em;
  }

  .gm-phase-note {
    display: none;
  }

  .gm-caption-rule {
    width: 40px;
  }

  .gm-phase-orbit {
    width: 38vw;
    margin-left: -19vw;
    margin-top: -19vw;
    opacity: .1;
  }

  .gm-phase-lines {
    opacity: .1;
    inset: 13% 3%;
  }

  .gm-reticle-one {
    opacity: .18;
    transform: scale(.75);
  }

  .gm-reticle-two {
    display: none;
  }

  .gm-phase-rail {
    display: none;
  }

  .gm-navigator {
    display: none;
  }

  .gm-pointer > span {
    width: 260px;
    height: 260px;
    left: -130px;
    top: -130px;
  }

  .gm-world-grid {
    background-size: 100px 100px;
    opacity: .01;
  }

  .gm-controls {
    left: 13px;
    bottom: 13px;
  }

  .gm-control-note {
    display: none;
  }
}

@media (max-width: 767px) {
  .gm-navigator {
    display: none;
  }

  .gm-pointer {
    display: none;
  }

  .gm-phase-rail {
    display: none;
  }

  .gm-reticle-two {
    display: none;
  }

  .gm-phase-grain {
    display: none;
  }

  .gm-world-grid {
    display: none;
  }

  .gm-atmosphere {
    filter: blur(35px);
    opacity: .025;
    width: 90vw;
    height: 50vh;
  }

  .gm-world-corners {
    inset: 78px 9px 12px;
    opacity: .1;
  }

  .gm-world-corners > i {
    width: 8px;
    height: 8px;
  }

  .gm-phase-caption {
    left: 24px;
    right: 24px;
    bottom: 4%;
    gap: 8px;
  }

  .gm-phase-name {
    font-size: 8px;
    letter-spacing: .08em;
  }

  .gm-phase-number {
    font-size: 9px;
  }

  .gm-phase-note {
    display: none;
  }

  .gm-caption-rule {
    width: 32px;
    opacity: .2;
  }

  .gm-controls {
    left: 10px;
    bottom: max(10px, env(safe-area-inset-bottom));
    gap: 0;
  }

  .gm-toggle {
    min-height: 34px;
    padding: 7px 10px;
    gap: 6px;
    font-size: 8px;
    background: rgba(12,8,22,.94);
  }

  .gm-control-note {
    display: none;
  }

  .gm-toggle-symbol {
    font-size: 10px;
  }

  .gm-dust-point:nth-child(2n) {
    display: none;
  }
}

@media (max-width: 767px) and (orientation: portrait) {
  .gm-phase-frame {
    left: 10px;
    right: 10px;
    top: 7%;
    bottom: 7%;
    border-radius: 20px;
  }

  .gm-phase-surface {
    display: none;
  }

  .gm-phase-aura {
    left: -10%;
    right: auto;
    top: 45%;
    width: 120%;
    height: 40%;
    filter: blur(28px);
    opacity: calc(var(--gm-aura-opacity) * .65);
  }

  .gm-phase[data-gm-align="sinistra"] .gm-phase-aura {
    left: -10%;
    right: auto;
  }

  .gm-phase[data-gm-align="centro"] .gm-phase-aura {
    left: -10%;
    width: 120%;
  }

  .gm-phase-orbit {
    left: 50%;
    top: 68%;
    width: 66vw;
    margin-left: -33vw;
    margin-top: -33vw;
    opacity: .08;
  }

  .gm-phase[data-gm-align="sinistra"] .gm-phase-orbit {
    left: 50%;
  }

  .gm-phase-lines {
    inset: 48% 0 12%;
    opacity: .1;
  }

  .gm-phase-beam {
    top: 63%;
    left: -10%;
    width: 120%;
    opacity: .1;
  }

  .gm-reticle-one {
    top: 57%;
    right: 8%;
    width: 28px;
    height: 28px;
    opacity: .2;
  }

  .gm-phase[data-gm-align="sinistra"] .gm-reticle-one {
    left: auto;
    right: 8%;
  }

  .gm-corner {
    width: 22px;
    height: 22px;
    opacity: .18;
  }

  .gm-variant-editorial .gm-corner {
    width: 35px;
    height: 18px;
  }

  .gm-variant-orbital .gm-phase-orbit {
    opacity: .09;
  }

  .gm-variant-technical .gm-phase-orbit {
    opacity: .065;
  }
}

@media (max-width: 479px) and (orientation: portrait) {
  .gm-phase-frame {
    left: 8px;
    right: 8px;
    top: 6%;
    bottom: 6%;
  }

  .gm-phase-caption {
    left: 22px;
    right: 22px;
    bottom: 3%;
    gap: 7px;
  }

  .gm-phase-name {
    font-size: 7px;
    letter-spacing: .09em;
  }

  .gm-phase-number {
    font-size: 8px;
  }

  .gm-caption-rule {
    width: 25px;
  }

  .gm-phase-orbit {
    width: 72vw;
    margin-left: -36vw;
    margin-top: -36vw;
    top: 69%;
  }

  .gm-reticle-one {
    width: 22px;
    height: 22px;
    top: 59%;
    right: 7%;
  }

  .gm-phase[data-gm-align="sinistra"] .gm-reticle-one {
    right: 7%;
  }

  .gm-phase-aura {
    filter: blur(24px);
    opacity: calc(var(--gm-aura-opacity) * .5);
  }

  .gm-phase-lines {
    opacity: .075;
    inset: 50% 0 12%;
  }

  .gm-phase-beam {
    opacity: .07;
  }

  .gm-corner {
    width: 18px;
    height: 18px;
  }

  .gm-dust-point:nth-child(3n) {
    display: none;
  }

  .gm-world-corners {
    inset: 76px 7px 10px;
  }

  .gm-controls {
    left: 8px;
  }

  .gm-toggle {
    min-height: 32px;
    font-size: 8px;
    padding: 7px 9px;
  }
}

@media (max-width: 359px) {
  .gm-phase-caption {
    display: none;
  }

  .gm-phase-lines {
    display: none;
  }

  .gm-phase-orbit {
    opacity: .05;
  }

  .gm-phase-frame {
    left: 6px;
    right: 6px;
  }

  .gm-reticle-one {
    display: none;
  }

  .gm-toggle {
    font-size: 7px;
    min-height: 30px;
    gap: 5px;
    padding: 6px 8px;
  }
}

@media (max-height: 540px) and (orientation: landscape) {
  .gm-navigator {
    display: none;
  }

  .gm-phase-frame {
    top: 16%;
    bottom: 11%;
    left: 12px;
    right: 12px;
  }

  .gm-phase-caption {
    bottom: 4%;
    left: 28px;
    right: 28px;
  }

  .gm-phase-note {
    display: none;
  }

  .gm-phase-name {
    font-size: 7px;
  }

  .gm-phase-number {
    font-size: 8px;
  }

  .gm-phase-orbit {
    top: 52%;
    width: 62vh;
    margin-left: -31vh;
    margin-top: -31vh;
  }

  .gm-phase-aura {
    filter: blur(25px);
    opacity: calc(var(--gm-aura-opacity) * .65);
  }

  .gm-reticle-one {
    width: 24px;
    height: 24px;
    top: 22%;
  }

  .gm-reticle-two {
    display: none;
  }

  .gm-phase-rail {
    display: none;
  }

  .gm-corner {
    width: 20px;
    height: 20px;
  }

  .gm-controls {
    left: 8px;
    bottom: 8px;
  }

  .gm-toggle {
    font-size: 8px;
    min-height: 30px;
    padding: 6px 9px;
  }

  .gm-control-note {
    display: none;
  }

  .gm-world-corners {
    inset: 66px 8px 10px;
  }
}

@media (pointer: coarse) {
  .gm-pointer {
    display: none;
  }

  .gm-nav-stop {
    min-width: 30px;
    min-height: 30px;
  }

  .gm-toggle {
    min-height: 44px;
    touch-action: manipulation;
  }

  .gm-phase-grain {
    display: none;
  }
}

@media (prefers-contrast: more) {
  .gm-phase-aura {
    display: none;
  }

  .gm-atmosphere {
    display: none;
  }

  .gm-phase-lines {
    opacity: .07;
  }

  .gm-toggle {
    color: #fff;
    background: #100a19;
    border-color: #d2b7ef;
  }

  .gm-nav-tooltip {
    color: #fff;
    background: #100a19;
    border-color: #d2b7ef;
  }

  .gm-control-note {
    color: #c6b9d6;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gm-world, .gm-slot {
    display: none !important;
  }

  .gm-nav-marker, .gm-nav-tooltip, .gm-toggle {
    transition: none !important;
  }

  .studio-page :is(.studio-primary, .studio-outline, .studio-nav-cta, .ws-contact a, .final-contact-primary, .final-contact-secondary) {
    transition-duration: .01ms;
  }
}

@media (forced-colors: active) {
  .gm-world, .gm-slot {
    display: none !important;
  }

  .gm-toggle {
    border: 1px solid ButtonText;
    color: ButtonText;
    background: ButtonFace;
    box-shadow: none;
  }

  .gm-toggle-symbol {
    color: ButtonText;
  }

  .gm-nav-marker {
    background: ButtonText;
  }

  .gm-nav-stop.gm-is-active .gm-nav-marker {
    outline: 1px solid Highlight;
    background: Highlight;
  }

  .gm-nav-tooltip {
    color: CanvasText;
    background: Canvas;
    border-color: CanvasText;
  }
}

@media print {
  .gm-world, .gm-slot, .gm-controls, .gm-navigator {
    display: none !important;
  }
}
`;
