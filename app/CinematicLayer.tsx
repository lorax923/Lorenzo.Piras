"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { createPortal } from "react-dom";
import { useReducedMotion } from "framer-motion";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* =========================================================
   CONTENUTI AGGIUNTIVI
   Nessun risultato commerciale o dato inventato.
   ========================================================= */

const CHAPTERS = [
  {
    name: "Vision",
    heading: "Prima il carattere. Poi il codice.",
    description:
      "Ogni esperienza parte da una direzione: cosa deve comunicare il brand, a chi si rivolge e quale sensazione deve lasciare.",
    tags: ["Identità", "Direzione creativa", "Esperienza"],
    color: "#c4a5ff",
    anchor: "#home",
  },
  {
    name: "Identity",
    heading: "Un sistema visivo, non una decorazione.",
    description:
      "Palette, ritmo tipografico e composizione lavorano insieme per costruire una presenza riconoscibile.",
    tags: ["Palette", "Tipografia", "Composizione"],
    color: "#e5c9a7",
    anchor: "#concept",
  },
  {
    name: "Interaction",
    heading: "L’interfaccia invita a esplorare.",
    description:
      "Il movimento accompagna l’attenzione: mette in evidenza ciò che conta e collega i contenuti senza interrompere il percorso.",
    tags: ["Gerarchie", "Interazioni", "Responsive UI"],
    color: "#b9f5a4",
    anchor: "#concept",
  },
  {
    name: "Motion",
    heading: "Il movimento ha una grammatica.",
    description:
      "Entrate, pause e trasformazioni danno ritmo alla pagina. L’animazione sostiene il messaggio, non lo sostituisce.",
    tags: ["Ritmo", "Transizioni", "Scroll narrative"],
    color: "#f0abfc",
    anchor: "#metodo",
  },
  {
    name: "Engineering",
    heading: "Dietro la scena, una struttura.",
    description:
      "Componenti, contenuti e comportamento responsive vengono organizzati per poter rifinire il progetto senza perdere coerenza.",
    tags: ["Componenti", "Accessibilità", "Ottimizzazione"],
    color: "#8bdcff",
    anchor: "#metodo",
  },
  {
    name: "Collaborate",
    heading: "Il brief diventa una direzione concreta.",
    description:
      "Partiamo dai tuoi obiettivi, dai contenuti disponibili e dalle priorità. Da lì definiamo il percorso del progetto.",
    tags: ["Obiettivi", "Contenuti", "Priorità"],
    color: "#edb0ff",
    anchor: "#contatti",
  },
];

const PARTICLES = Array.from({ length: 12 }, (_, index) => ({
  x: 50 + Math.cos((index / 12) * Math.PI * 2) * 43,
  y: 50 + Math.sin((index / 12) * Math.PI * 2) * 43,
}));

/* =========================================================
   STUDIO VISIVO PER OGNI CAPITOLO
   ========================================================= */

function VisualStudy({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="film-study film-study-identity" aria-hidden="true">
        <span className="film-small-label">CREATIVE DIRECTION</span>

        <div className="film-monogram" data-film-piece>
          LP
          <span>®</span>
        </div>

        <div className="film-swatch-row">
          {["#b995ff", "#e1b0ff", "#87deee", "#f1edf8"].map(
            (color) => (
              <span
                key={color}
                data-film-piece
                style={{ backgroundColor: color }}
              />
            )
          )}
        </div>
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className="film-study film-study-editorial" aria-hidden="true">
        <div className="film-editorial-type" data-film-piece>
          Aa<span> / 01</span>
        </div>

        <div className="film-editorial-grid">
          <span data-film-piece />
          <span data-film-piece />
          <span data-film-piece />
          <span data-film-piece />
        </div>

        <span className="film-small-label">
          CONTRAST · SPACE · BALANCE
        </span>
      </div>
    );
  }

  if (index === 2) {
    return (
      <div className="film-study film-study-interface" aria-hidden="true">
        <div className="film-mini-window" data-film-piece>
          <div className="film-window-toolbar">
            <i />
            <i />
            <i />
          </div>

          <div className="film-window-layout">
            <span className="film-window-sidebar" />
            <div>
              <span className="film-window-title" />
              <span className="film-window-line" />
              <span className="film-window-line film-short" />

              <div className="film-window-cards">
                <i data-film-piece />
                <i data-film-piece />
                <i data-film-piece />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (index === 3) {
    return (
      <div className="film-study film-study-motion" aria-hidden="true">
        <span className="film-small-label">MOTION STUDY / SCROLL DRIVEN</span>

        <div className="film-bars">
          {[28, 65, 42, 90, 56, 100, 48, 78, 34, 62].map(
            (height, barIndex) => (
              <span
                key={barIndex}
                data-film-bar
                style={{ height: `${height}%` }}
              />
            )
          )}
        </div>

        <div className="film-motion-line">
          <span data-film-sweep />
        </div>
      </div>
    );
  }

  if (index === 4) {
    return (
      <div className="film-study film-study-stack" aria-hidden="true">
        {[
          ["01", "INTERFACE"],
          ["02", "INTERACTION"],
          ["03", "STRUCTURE"],
        ].map(([number, title]) => (
          <div key={number} data-film-piece className="film-stack-layer">
            <span>{number}</span>
            <strong>{title}</strong>
            <i />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="film-study film-study-brief" aria-hidden="true">
      <span className="film-small-label">FROM CONVERSATION TO CONCEPT</span>

      <div className="film-brief-flow">
        {["IDEA", "DIRECTION", "EXPERIENCE"].map((word, flowIndex) => (
          <div key={word} data-film-piece>
            <span>0{flowIndex + 1}</span>
            <strong>{word}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   SCHEDA AGGIUNTIVA
   Il trigger è la sezione già presente nella pagina.
   ========================================================= */

function DetailCard({ index }: { index: number }) {
  const root = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const chapter = CHAPTERS[index];

  useEffect(() => {
    const element = root.current;
    const section = element?.closest("[data-scene]");

    if (!element || !section || reducedMotion !== false) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const pieces = element.querySelectorAll("[data-film-piece]");
      const bars = element.querySelectorAll("[data-film-bar]");
      const sweep = element.querySelector("[data-film-sweep]");

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: "top 96%",
          end: "top 45%",
          scrub: 0.45,
          invalidateOnRefresh: true,
        },
      });

      if (pieces.length) {
        timeline.fromTo(
          pieces,
          {
            y: 24,
            opacity: 0.25,
            rotateX: -12,
          },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            stagger: 0.07,
            duration: 1,
            ease: "power2.out",
          },
          0
        );
      }

      if (bars.length) {
        timeline.fromTo(
          bars,
          {
            scaleY: 0.12,
            transformOrigin: "bottom",
          },
          {
            scaleY: 1,
            stagger: 0.045,
            duration: 1,
            ease: "none",
          },
          0
        );
      }

      if (sweep) {
        timeline.fromTo(
          sweep,
          { xPercent: -100 },
          {
            xPercent: 180,
            duration: 1.5,
            ease: "none",
          },
          0
        );
      }
    }, element);

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <div
      ref={root}
      className="film-detail"
      style={
        {
          "--film-accent": chapter.color,
        } as CSSProperties
      }
    >
      <VisualStudy index={index} />

      <div className="film-detail-copy">
        <h3>{chapter.heading}</h3>
        <p>{chapter.description}</p>

        <div className="film-detail-tags">
          {chapter.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   LIVELLO CINEMATICO
   Inserisce le schede nelle colonne già esistenti.
   I portal rimangono gestiti da React.
   ========================================================= */

export default function CinematicLayer() {
  const [slots, setSlots] = useState<HTMLElement[]>([]);
  const [active, setActive] = useState(0);

  const activeRef = useRef(0);
  const overlay = useRef<HTMLDivElement>(null);
  const orbit = useRef<HTMLDivElement>(null);
  const orbitSvg = useRef<SVGSVGElement>(null);

  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const columns = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".studio-main [data-scene] [data-copy]"
      )
    );

    setSlots(columns.slice(0, CHAPTERS.length));
  }, []);

  useEffect(() => {
    if (!slots.length || reducedMotion === null) return;

    gsap.registerPlugin(ScrollTrigger);

    const main = document.querySelector<HTMLElement>(".studio-main");

    if (!main) return;

    const media = gsap.matchMedia();

    media.add(
      {
        desktop: "(min-width: 768px)",
        mobile: "(max-width: 767px)",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const conditions = context.conditions as {
          desktop: boolean;
          mobile: boolean;
          reduce: boolean;
        };

        if (conditions.reduce) return;

        const sections = Array.from(
          main.querySelectorAll<HTMLElement>("[data-scene]")
        );

        sections.forEach((section, index) => {
          ScrollTrigger.create({
            trigger: section,
            start: "top 55%",
            end: "bottom 55%",

            onToggle(self) {
              if (!self.isActive) return;

              if (activeRef.current !== index) {
                activeRef.current = index;
                setActive(index);
              }
            },
          });
        });

        if (orbitSvg.current) {
          gsap.fromTo(
            orbitSvg.current,
            { rotation: -25 },
            {
              rotation: 260,
              ease: "none",
              transformOrigin: "50% 50%",

              scrollTrigger: {
                trigger: main,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.65,
              },
            }
          );
        }

        const paths =
          overlay.current?.querySelectorAll<SVGGeometryElement>(
            "[data-film-path]"
          );

        paths?.forEach((path, index) => {
          const length = path.getTotalLength();

          gsap.fromTo(
            path,
            {
              strokeDasharray: length,
              strokeDashoffset: length,
            },
            {
              strokeDashoffset: index % 2 === 0 ? -length : 0,
              ease: "none",

              scrollTrigger: {
                trigger: main,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.65,
              },
            }
          );
        });

        if (conditions.desktop && orbit.current) {
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: main,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.55,
            },
          });

          gsap.set(orbit.current, {
            left: "74%",
            scale: 1,
          });

          ["26%", "74%", "27%", "73%", "26%"].forEach(
            (left, index) => {
              timeline.to(
                orbit.current,
                {
                  left,
                  scale: index === 3 ? 1.15 : 1,
                  duration: 1,
                  ease: "power1.inOut",
                },
                index
              );
            }
          );
        }

        if (conditions.mobile && orbit.current) {
          gsap.set(orbit.current, {
            left: "50%",
            scale: 0.92,
          });
        }
      }
    );

    /*
     * Le schede appena inserite possono modificare l'altezza.
     * Ricalcoliamo i trigger dopo il layout del browser.
     */
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(frame);
      media.revert();
    };
  }, [slots, reducedMotion]);

  const current = CHAPTERS[Math.min(active, CHAPTERS.length - 1)];

  return (
    <>
      {slots.map((slot, index) =>
        createPortal(
          <DetailCard index={index} />,
          slot,
          `film-detail-${index}`
        )
      )}

      <div
        ref={overlay}
        className="film-overlay"
        aria-hidden="true"
        style={
          {
            "--film-accent": current.color,
          } as CSSProperties
        }
      >
        <div ref={orbit} className="film-orbit">
          <svg
            ref={orbitSvg}
            viewBox="0 0 600 600"
            fill="none"
          >
            <circle
              cx="300"
              cy="300"
              r="255"
              className="film-orbit-base"
            />

            <circle
              cx="300"
              cy="300"
              r="215"
              className="film-orbit-dashed"
            />

            <ellipse
              data-film-path
              cx="300"
              cy="300"
              rx="270"
              ry="125"
              transform="rotate(-32 300 300)"
              className="film-orbit-active"
            />

            <ellipse
              data-film-path
              cx="300"
              cy="300"
              rx="150"
              ry="265"
              transform="rotate(-32 300 300)"
              className="film-orbit-secondary"
            />

            {PARTICLES.map((particle, index) => (
              <circle
                key={index}
                cx={particle.x * 6}
                cy={particle.y * 6}
                r={index % 3 === 0 ? 3 : 1.5}
                fill="currentColor"
                opacity={index % 3 === 0 ? 0.8 : 0.35}
              />
            ))}
          </svg>

          <span className="film-orbit-caption">
            LORENZO PIRAS / {current.name.toUpperCase()}
          </span>
        </div>
      </div>

      <aside
        className="film-chapter-indicator"
        aria-label="Capitolo corrente"
      >
        <span className="film-indicator-number">
          0{active + 1}
          <i> / 06</i>
        </span>

        <span className="film-indicator-name">{current.name}</span>

        <div className="film-indicator-dots" aria-hidden="true">
          {CHAPTERS.map((chapter, index) => (
            <span
              key={chapter.name}
              className={index === active ? "is-active" : ""}
            />
          ))}
        </div>
      </aside>

      {/* CSS normale: non richiede un registry styled-jsx. */}
      <style>{`
        .film-detail {
          margin-top: 30px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 20px;
          overflow: hidden;
          background: rgba(12,8,21,.65);
          perspective: 900px;
        }

        .film-study {
          position: relative;
          min-height: 140px;
          padding: 20px;
          overflow: hidden;
          border-bottom: 1px solid rgba(255,255,255,.08);
          background:
            radial-gradient(
              ellipse at 80% 20%,
              rgba(157,110,255,.13),
              transparent 65%
            ),
            rgba(255,255,255,.025);
        }

        .film-small-label {
          font-size: 8px;
          letter-spacing: .16em;
          color: rgba(255,255,255,.4);
        }

        .film-detail-copy {
          padding: 20px;
        }

        .film-detail-copy h3 {
          margin: 0;
          color: var(--film-accent);
          font-size: 15px;
          line-height: 1.4;
          font-weight: 600;
          letter-spacing: -.025em;
        }

        .film-detail-copy p {
          margin: 10px 0 0;
          max-width: 460px;
          font-size: 11px;
          line-height: 1.8;
          color: rgba(255,255,255,.55);
        }

        .film-detail-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 15px;
        }

        .film-detail-tags span {
          padding: 5px 9px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,.12);
          font-size: 8px;
          color: rgba(255,255,255,.5);
        }

        .film-study-identity {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 12px;
        }

        .film-study-identity .film-small-label {
          grid-column: 1 / -1;
        }

        .film-monogram {
          font-size: 62px;
          line-height: 1;
          font-weight: 700;
          letter-spacing: -.1em;
          color: #eee5ff;
        }

        .film-monogram span {
          display: inline-block;
          margin-left: 8px;
          font-size: 18px;
          vertical-align: top;
          letter-spacing: 0;
          color: #d8b4fe;
        }

        .film-swatch-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .film-swatch-row span {
          width: 22px;
          height: 54px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,.12);
        }

        .film-study-editorial {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          align-items: center;
        }

        .film-editorial-type {
          font-family: Georgia, serif;
          font-size: 62px;
          line-height: 1;
          color: #e9d5b8;
        }

        .film-editorial-type > span {
          font: 10px Arial, sans-serif;
          color: rgba(255,255,255,.35);
        }

        .film-editorial-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 6px;
          height: 70px;
        }

        .film-editorial-grid span {
          border-radius: 3px;
          background: rgba(224,201,171,.25);
        }

        .film-editorial-grid span:first-child {
          grid-row: span 2;
          background: rgba(224,201,171,.55);
        }

        .film-study-editorial .film-small-label {
          grid-column: 1 / -1;
        }

        .film-mini-window {
          border: 1px solid rgba(185,245,164,.3);
          border-radius: 10px;
          overflow: hidden;
          background: rgba(7,31,24,.75);
        }

        .film-window-toolbar {
          display: flex;
          gap: 4px;
          height: 21px;
          align-items: center;
          padding-left: 9px;
          border-bottom: 1px solid rgba(255,255,255,.1);
        }

        .film-window-toolbar i {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(185,245,164,.5);
        }

        .film-window-layout {
          display: grid;
          grid-template-columns: 40px 1fr;
          gap: 12px;
          padding: 12px;
        }

        .film-window-sidebar {
          border-radius: 4px;
          background: rgba(185,245,164,.13);
        }

        .film-window-title,
        .film-window-line {
          display: block;
          height: 5px;
          margin-bottom: 6px;
          border-radius: 999px;
          background: rgba(185,245,164,.22);
        }

        .film-window-title {
          width: 55%;
          height: 8px;
          background: rgba(185,245,164,.7);
        }

        .film-short {
          width: 72%;
        }

        .film-window-cards {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 6px;
          margin-top: 10px;
        }

        .film-window-cards i {
          height: 25px;
          border-radius: 4px;
          background: rgba(185,245,164,.22);
        }

        .film-bars {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 7px;
          height: 65px;
          margin-top: 14px;
        }

        .film-bars span {
          flex: 1;
          border-radius: 5px 5px 0 0;
          background: linear-gradient(
            0deg,
            rgba(131,73,206,.5),
            #f0abfc
          );
        }

        .film-motion-line {
          position: relative;
          height: 2px;
          overflow: hidden;
          margin-top: 12px;
          background: rgba(255,255,255,.1);
        }

        .film-motion-line span {
          display: block;
          width: 65%;
          height: 100%;
          background: #f0abfc;
        }

        .film-study-stack {
          display: grid;
          gap: 8px;
        }

        .film-stack-layer {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 9px 12px;
          border: 1px solid rgba(139,220,255,.18);
          border-radius: 7px;
          background: rgba(139,220,255,.035);
        }

        .film-stack-layer span {
          font-size: 8px;
          color: #8bdcff;
        }

        .film-stack-layer strong {
          font-size: 9px;
          font-weight: 500;
          letter-spacing: .12em;
          color: rgba(255,255,255,.7);
        }

        .film-stack-layer i {
          margin-left: auto;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #8bdcff;
        }

        .film-brief-flow {
          display: flex;
          gap: 8px;
          margin-top: 24px;
        }

        .film-brief-flow > div {
          flex: 1;
          border-top: 1px solid rgba(237,176,255,.35);
          padding-top: 12px;
        }

        .film-brief-flow span {
          display: block;
          font-size: 8px;
          color: rgba(255,255,255,.35);
        }

        .film-brief-flow strong {
          display: block;
          margin-top: 8px;
          font-size: 9px;
          color: #edb0ff;
          font-weight: 500;
        }

        .film-overlay {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          overflow: hidden;
        }

        .film-orbit {
          position: absolute;
          left: 74%;
          top: 50%;
          width: min(47vw,76vh);
          aspect-ratio: 1;
          transform: translate(-50%,-50%);
          color: var(--film-accent);
          transition: color 600ms ease;
        }

        .film-orbit svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .film-orbit-base {
          stroke: currentColor;
          stroke-width: .6;
          opacity: .16;
        }

        .film-orbit-dashed {
          stroke: currentColor;
          stroke-width: .8;
          stroke-dasharray: 2 12;
          opacity: .3;
        }

        .film-orbit-active {
          stroke: currentColor;
          stroke-width: 1;
          opacity: .6;
        }

        .film-orbit-secondary {
          stroke: currentColor;
          stroke-width: .8;
          opacity: .3;
        }

        .film-orbit-caption {
          position: absolute;
          bottom: -12px;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 8px;
          letter-spacing: .22em;
          color: currentColor;
          opacity: .5;
        }

        .film-chapter-indicator {
          position: fixed;
          z-index: 45;
          right: 25px;
          bottom: 22px;
          display: grid;
          grid-template-columns: auto auto;
          align-items: center;
          gap: 10px 14px;
          padding: 13px 16px;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 16px;
          background: rgba(9,6,16,.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          pointer-events: none;
        }

        .film-indicator-number {
          font-size: 17px;
          letter-spacing: -.04em;
        }

        .film-indicator-number i {
          font-size: 10px;
          color: rgba(255,255,255,.3);
          font-style: normal;
        }

        .film-indicator-name {
          font-size: 9px;
          color: rgba(255,255,255,.65);
        }

        .film-indicator-dots {
          grid-column: 1 / -1;
          display: flex;
          gap: 5px;
        }

        .film-indicator-dots span {
          width: 19px;
          height: 2px;
          background: rgba(255,255,255,.15);
          transition: background-color 250ms ease;
        }

        .film-indicator-dots .is-active {
          background: #d8b4fe;
        }

        @media (max-width:767px) {
          .film-detail {
            margin-top: 23px;
            border-radius: 15px;
          }

          .film-study {
            min-height: 112px;
            padding: 15px;
          }

          .film-detail-copy {
            padding: 15px;
          }

          .film-detail-copy h3 {
            font-size: 13px;
          }

          .film-detail-copy p {
            font-size: 10px;
            line-height: 1.7;
          }

          .film-monogram {
            font-size: 47px;
          }

          .film-swatch-row span {
            width: 17px;
            height: 42px;
          }

          .film-editorial-type {
            font-size: 46px;
          }

          .film-orbit {
            left: 50%;
            top: 67%;
            width: min(88vw,45vh);
          }

          .film-orbit-caption {
            display: none;
          }

          .film-chapter-indicator {
            display: none;
          }

          .film-brief-flow strong {
            font-size: 8px;
          }
        }

        @media (prefers-reduced-motion:reduce) {
          .film-overlay,
          .film-chapter-indicator {
            display: none;
          }
        }
      `}</style>
    </>
  );
}