"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* =========================================================
   INTRODUZIONE LORENZO PIRAS
   Animazione grafica: non simula un caricamento reale.
   ========================================================= */

export default function IntroPresentation() {
  const root = useRef<HTMLDivElement>(null);
  const skipButton = useRef<HTMLButtonElement>(null);

  const [finished, setFinished] = useState(false);

  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (finished || reducedMotion === null || !root.current) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    document.body.style.overflow = "hidden";

    skipButton.current?.focus({
      preventScroll: true,
    });

    let active = true;
    let reducedTimer: ReturnType<typeof setTimeout> | undefined;
    let timeline: gsap.core.Timeline | undefined;

    const complete = () => {
      if (active) {
        setFinished(true);
      }
    };

    const context = gsap.context(() => {
      /*
       * Chi preferisce meno movimento vede soltanto
       * un passaggio breve, senza la sequenza completa.
       */
      if (reducedMotion) {
        gsap.set(
          [
            ".intro-monogram",
            ".intro-character",
            ".intro-subtitle",
            ".intro-caption",
          ],
          {
            opacity: 1,
            y: 0,
            scale: 1,
          }
        );

        reducedTimer = setTimeout(complete, 400);

        return;
      }

      gsap.set(".intro-monogram", {
        opacity: 0,
        scale: 0.82,
        y: 15,
      });

      gsap.set(".intro-character", {
        yPercent: 120,
        opacity: 0,
        rotateX: -55,
      });

      gsap.set(".intro-subtitle", {
        opacity: 0,
        y: 16,
      });

      gsap.set(".intro-caption", {
        opacity: 0,
      });

      gsap.set(".intro-line-fill", {
        scaleX: 0,
        transformOrigin: "left",
      });

      gsap.set(".intro-halo", {
        scale: 0.6,
        opacity: 0,
      });

      timeline = gsap.timeline({
        onComplete: complete,
      });

      timeline
        /* Luce iniziale */
        .to(
          ".intro-halo",
          {
            scale: 1,
            opacity: 0.65,
            duration: 1.2,
            ease: "power2.out",
          },
          0
        )

        /* Monogramma */
        .to(
          ".intro-monogram",
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
          },
          0.12
        )

        /* Nome e cognome */
        .to(
          ".intro-character",
          {
            yPercent: 0,
            opacity: 1,
            rotateX: 0,
            stagger: 0.045,
            duration: 0.9,
            ease: "power4.out",
          },
          0.6
        )

        /* Descrizione professionale */
        .to(
          ".intro-subtitle",
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
          },
          1.35
        )

        .to(
          ".intro-caption",
          {
            opacity: 1,
            duration: 0.6,
          },
          1.55
        )

        /* Linea decorativa, non percentuale di caricamento */
        .to(
          ".intro-line-fill",
          {
            scaleX: 1,
            duration: 1.65,
            ease: "power2.inOut",
          },
          0.85
        )

        /* Espansione finale della luce */
        .to(
          ".intro-halo",
          {
            scale: 1.35,
            opacity: 0.85,
            duration: 0.8,
            ease: "power2.inOut",
          },
          2.3
        )

        /* Uscita del contenuto */
        .to(
          ".intro-content",
          {
            y: -35,
            opacity: 0,
            duration: 0.55,
            ease: "power2.in",
          },
          2.85
        )

        .to(
          ".intro-skip",
          {
            opacity: 0,
            duration: 0.2,
          },
          2.9
        )

        /* Apertura verso l'alto */
        .to(
          root.current,
          {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 1,
            ease: "power4.inOut",
          },
          3.05
        );
    }, root);

    return () => {
      active = false;

      if (reducedTimer) {
        clearTimeout(reducedTimer);
      }

      timeline?.kill();
      context.revert();

      document.body.style.overflow = previousOverflow;

      if (previousFocus?.isConnected) {
        previousFocus.focus({
          preventScroll: true,
        });
      }

      /*
       * Il blocco dello scroll può modificare la larghezza
       * disponibile: aggiorniamo le misure della scena.
       */
      window.dispatchEvent(new Event("resize"));

      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.refresh();
    };
  }, [finished, reducedMotion]);

  function handleKeyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      setFinished(true);
    }

    /*
     * Durante questa breve schermata l'unico comando
     * interattivo è "Salta intro".
     */
    if (event.key === "Tab") {
      event.preventDefault();
      skipButton.current?.focus();
    }
  }

  if (finished) return null;

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-presentation-title"
      onKeyDown={handleKeyboard}
      className="intro-presentation"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#07040d",
        clipPath: "inset(0% 0% 0% 0%)",
      }}
    >
      <div className="intro-halo" aria-hidden="true" />

      <div className="intro-grid" aria-hidden="true" />

      <div className="intro-content">
        <div className="intro-monogram" aria-hidden="true">
          <span>LP</span>
          <i>®</i>
        </div>

        <p className="intro-overline" aria-hidden="true">
          INDEPENDENT DESIGNER &amp; DEVELOPER
        </p>

        <h2
          id="intro-presentation-title"
          className="intro-name"
          aria-label="Lorenzo Piras"
        >
          <span className="intro-name-word" aria-hidden="true">
            {"Lorenzo".split("").map((letter, index) => (
              <span
                className="intro-character-mask"
                key={`name-${index}`}
              >
                <span className="intro-character">
                  {letter}
                </span>
              </span>
            ))}
          </span>

          <span
            className="intro-name-word intro-surname"
            aria-hidden="true"
          >
            {"Piras".split("").map((letter, index) => (
              <span
                className="intro-character-mask"
                key={`surname-${index}`}
              >
                <span className="intro-character">
                  {letter}
                </span>
              </span>
            ))}
            <span className="intro-character-mask">
              <span className="intro-character">.</span>
            </span>
          </span>
        </h2>

        <p className="intro-subtitle">
          Bespoke Web Design
          <span> &amp; Digital Experiences</span>
        </p>

        <div className="intro-line" aria-hidden="true">
          <div className="intro-line-fill" />
        </div>

        <p className="intro-caption">
          A DIFFERENT PERSPECTIVE ON THE WEB
        </p>
      </div>

      <button
        ref={skipButton}
        type="button"
        className="intro-skip"
        onClick={() => setFinished(true)}
      >
        Salta intro ↗
      </button>

      <style>{`
        .intro-presentation {
          display: grid;
          place-items: center;
          overflow: hidden;
          isolation: isolate;
          color: #f8f4ff;
        }

        .intro-halo {
          position: absolute;
          z-index: -1;
          width: min(85vw, 1000px);
          height: min(75vh, 700px);
          border-radius: 50%;
          background:
            radial-gradient(
              ellipse at 35% 40%,
              rgba(168, 85, 247, .6),
              transparent 62%
            ),
            radial-gradient(
              ellipse at 75% 60%,
              rgba(34, 211, 238, .3),
              transparent 60%
            );
          filter: blur(65px);
          opacity: 0;
          pointer-events: none;
        }

        .intro-grid {
          position: absolute;
          inset: 0;
          z-index: -1;
          opacity: .035;
          pointer-events: none;
          background-image:
            linear-gradient(#fff 1px, transparent 1px),
            linear-gradient(90deg, #fff 1px, transparent 1px);
          background-size: 75px 75px;
          mask-image: radial-gradient(
            ellipse at center,
            #000,
            transparent 75%
          );
          -webkit-mask-image: radial-gradient(
            ellipse at center,
            #000,
            transparent 75%
          );
        }

        .intro-content {
          width: min(1100px, calc(100% - 48px));
          text-align: center;
          perspective: 1000px;
        }

        .intro-monogram {
          position: relative;
          display: inline-flex;
          align-items: flex-start;
          justify-content: center;
          margin-bottom: 30px;
          opacity: 0;
        }

        .intro-monogram > span {
          display: grid;
          place-items: center;
          width: 66px;
          height: 66px;
          border: 1px solid rgba(220, 190, 255, .3);
          border-radius: 20px;
          background: rgba(255,255,255,.035);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.08),
            0 0 45px rgba(168,85,247,.12);
          font-size: 27px;
          font-weight: 600;
          letter-spacing: -.1em;
          padding-right: 3px;
        }

        .intro-monogram > i {
          position: absolute;
          right: -16px;
          top: -7px;
          font-size: 13px;
          font-style: normal;
          color: #dfb8ff;
        }

        .intro-overline {
          margin: 0 0 22px;
          font-size: 9px;
          letter-spacing: .28em;
          color: rgba(255,255,255,.4);
        }

        .intro-name {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: baseline;
          gap: 0 .2em;
          margin: 0;
          font-family:
            var(--font-geist-sans),
            Arial,
            sans-serif;
          font-size: clamp(54px, 10vw, 145px);
          font-weight: 600;
          line-height: 1.1;
          letter-spacing: -.075em;
        }

        .intro-name-word {
          display: inline-flex;
          white-space: nowrap;
        }

        .intro-character-mask {
          display: inline-block;
          overflow: hidden;
          padding-bottom: .08em;
          margin-bottom: -.08em;
        }

        .intro-character {
          display: inline-block;
          opacity: 0;
          transform-origin: 50% 100%;
        }

        .intro-surname {
          color: #d9b1ff;
        }

        .intro-subtitle {
          margin: 25px 0 0;
          font-size: clamp(11px, 1.2vw, 15px);
          letter-spacing: .08em;
          color: rgba(255,255,255,.68);
          opacity: 0;
        }

        .intro-subtitle > span {
          color: rgba(255,255,255,.4);
        }

        .intro-line {
          width: min(280px, 65%);
          height: 1px;
          margin: 35px auto 0;
          overflow: hidden;
          background: rgba(255,255,255,.12);
        }

        .intro-line-fill {
          width: 100%;
          height: 100%;
          transform: scaleX(0);
          transform-origin: left;
          background: linear-gradient(
            90deg,
            #c084fc,
            #e9d5ff,
            #67e8f9
          );
        }

        .intro-caption {
          margin: 20px 0 0;
          font-size: 8px;
          letter-spacing: .22em;
          color: rgba(255,255,255,.33);
          opacity: 0;
        }

        .intro-skip {
          position: absolute;
          right: clamp(20px, 4vw, 60px);
          bottom: max(26px, env(safe-area-inset-bottom));
          min-height: 44px;
          padding: 10px 18px;
          border: 1px solid rgba(255,255,255,.2);
          border-radius: 999px;
          background: rgba(255,255,255,.035);
          color: rgba(255,255,255,.7);
          font: inherit;
          font-size: 11px;
          cursor: pointer;
        }

        .intro-skip:hover {
          background: rgba(255,255,255,.1);
          color: #fff;
        }

        .intro-skip:focus-visible {
          outline: 2px solid #a5f3fc;
          outline-offset: 5px;
        }

        @media (max-width: 600px) {
          .intro-content {
            width: calc(100% - 36px);
          }

          .intro-name {
            flex-direction: column;
            align-items: center;
            gap: 0;
            font-size: clamp(61px, 17vw, 95px);
            line-height: 1.03;
          }

          .intro-monogram {
            margin-bottom: 28px;
          }

          .intro-monogram > span {
            width: 56px;
            height: 56px;
            border-radius: 17px;
            font-size: 23px;
          }

          .intro-overline {
            font-size: 7px;
            letter-spacing: .18em;
            margin-bottom: 24px;
          }

          .intro-subtitle {
            margin-top: 25px;
            font-size: 10px;
            line-height: 1.8;
          }

          .intro-subtitle > span {
            display: block;
          }

          .intro-caption {
            font-size: 7px;
            letter-spacing: .13em;
          }

          .intro-halo {
            width: 130vw;
            height: 65vh;
            filter: blur(45px);
          }
        }

        @media (max-height: 500px) and (orientation: landscape) {
          .intro-monogram {
            margin-bottom: 12px;
          }

          .intro-monogram > span {
            width: 42px;
            height: 42px;
            font-size: 20px;
            border-radius: 12px;
          }

          .intro-overline {
            margin-bottom: 12px;
            font-size: 7px;
          }

          .intro-name {
            font-size: 70px;
          }

          .intro-subtitle {
            margin-top: 12px;
            font-size: 10px;
          }

          .intro-line {
            margin-top: 20px;
          }

          .intro-caption {
            margin-top: 12px;
          }
        }
      `}</style>
    </div>
  );
}