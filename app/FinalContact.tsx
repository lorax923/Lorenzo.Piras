"use client";

import { motion, useReducedMotion } from "framer-motion";

const PHONE = "tel:+393247484896";

const WHATSAPP =
  "https://wa.me/393247484896?text=Ciao%20Lorenzo%2C%20vorrei%20parlare%20del%20mio%20progetto.";

export default function FinalContact() {
  const reducedMotion = useReducedMotion();

  return (
    <footer id="contatti" className="final-contact">
      {/* Sfondo decorativo */}
      <div
        className="final-contact-light"
        aria-hidden="true"
      />

      <div className="final-contact-inner">
        <motion.div
          initial={
            reducedMotion
              ? false
              : { opacity: 0, y: 45 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <p className="final-contact-eyebrow">
            LORENZO PIRAS / CONTATTO DIRETTO
          </p>

          <h2>
            Ora parliamo
            <br />
            <span>del tuo progetto.</span>
          </h2>

          <p className="final-contact-description">
            Hai visto come un’idea può diventare
            un’esperienza digitale. Il prossimo passo
            è capire cosa rende unica la tua.
          </p>

          <a
            href={PHONE}
            className="final-contact-number"
            aria-label="Chiama Lorenzo Piras al numero +39 3247484896"
          >
            +39 3247484896
            <span aria-hidden="true"> ↗</span>
          </a>

          <div className="final-contact-actions">
            <a
              href={PHONE}
              className="final-contact-primary"
            >
              Chiama Lorenzo
            </a>

            <a
              href={WHATSAPP}
              className="final-contact-secondary"
            >
              Scrivi su WhatsApp ↗
            </a>
          </div>

          <p className="final-contact-note">
            Raccontami il tuo brand, gli obiettivi
            e il tipo di sito che immagini.
            Partiamo da lì.
          </p>
        </motion.div>

        <div className="final-contact-bottom">
          <span>
            Lorenzo Piras — Web design su misura.
          </span>

          <span>
            Le anteprime mostrate sono concept dimostrativi.
          </span>

          <a href="#home">
            Torna all’inizio ↑
          </a>
        </div>
      </div>

      <style>{`
        .final-contact {
          position: relative;
          z-index: 30;
          isolation: isolate;
          overflow: hidden;
          min-height: 100svh;
          display: flex;
          align-items: center;
          padding:
            clamp(90px, 12vw, 170px)
            clamp(24px, 6vw, 100px)
            30px;
          background: #0a0612;
          color: #f8f4ff;
          border-top: 1px solid rgba(255,255,255,.1);
          scroll-margin-top: 76px;
        }

        .final-contact-light {
          position: absolute;
          z-index: -1;
          top: -15%;
          right: -20%;
          width: 100vw;
          height: 100vh;
          border-radius: 50%;
          background: radial-gradient(
            ellipse,
            rgba(143,62,207,.45),
            rgba(44,97,135,.18) 45%,
            transparent 70%
          );
          filter: blur(60px);
          pointer-events: none;
        }

        .final-contact-inner {
          width: 100%;
          max-width: 1400px;
          margin-inline: auto;
        }

        .final-contact-eyebrow {
          margin: 0 0 35px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .2em;
          color: #cdb0ff;
        }

        .final-contact h2 {
          margin: 0;
          font-size: clamp(44px, 8.5vw, 130px);
          font-weight: 700;
          line-height: 1.02;
          letter-spacing: -.065em;
          text-wrap: balance;
        }

        .final-contact h2 > span {
          color: #e1b0ff;
        }

        .final-contact-description {
          max-width: 530px;
          margin: 35px 0 0;
          font-size: 16px;
          line-height: 1.8;
          color: rgba(255,255,255,.6);
        }

        .final-contact-number {
          display: inline-block;
          margin-top: 35px;
          font-size: clamp(26px, 5.7vw, 84px);
          font-weight: 600;
          letter-spacing: -.055em;
          line-height: 1.3;
          color: #fff;
          transition: color 200ms ease;
        }

        .final-contact-number:hover {
          color: #a5f3fc;
        }

        .final-contact-number > span {
          color: #c8a8ff;
        }

        .final-contact-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .final-contact-primary,
        .final-contact-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
          padding: 14px 25px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          text-align: center;
        }

        .final-contact-primary {
          background: #f8f4ff;
          color: #170e25;
        }

        .final-contact-secondary {
          border: 1px solid rgba(255,255,255,.22);
          background: rgba(255,255,255,.025);
        }

        .final-contact-note {
          max-width: 450px;
          margin-top: 25px;
          font-size: 11px;
          line-height: 1.8;
          color: rgba(255,255,255,.4);
        }

        .final-contact-bottom {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 15px 25px;
          margin-top: 90px;
          padding-top: 25px;
          border-top: 1px solid rgba(255,255,255,.12);
          font-size: 10px;
          line-height: 1.7;
          color: rgba(255,255,255,.4);
        }

        .final-contact a:focus-visible {
          outline: 2px solid #a5f3fc;
          outline-offset: 6px;
        }

        @media (max-width:767px) {
          .final-contact {
            padding-top: 100px;
            padding-bottom:
              max(30px, env(safe-area-inset-bottom));
            scroll-margin-top: 64px;
          }

          .final-contact-eyebrow {
            font-size: 8px;
            letter-spacing: .12em;
            margin-bottom: 28px;
          }

          .final-contact h2 {
            font-size: clamp(38px, 10vw, 66px);
          }

          .final-contact-description {
            font-size: 13px;
            margin-top: 26px;
          }

          .final-contact-number {
            font-size: clamp(24px, 7.7vw, 43px);
            margin-top: 28px;
          }

          .final-contact-actions {
            gap: 10px;
          }

          .final-contact-primary,
          .final-contact-secondary {
            padding: 13px 19px;
            font-size: 11px;
          }

          .final-contact-bottom {
            flex-direction: column;
            margin-top: 65px;
          }
        }
      `}</style>
    </footer>
  );
}