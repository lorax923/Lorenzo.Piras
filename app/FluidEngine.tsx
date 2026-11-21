"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

import Lenis from "lenis";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* =========================================================
   FLUID ENGINE — LORENZO PIRAS

   Responsabilità:
   - Scorrimento progressivo su desktop.
   - Scorrimento nativo sui dispositivi touch.
   - Sincronizzazione Lenis / GSAP.
   - Rispetto delle preferenze di movimento ridotto.
   - Compatibilità con il blocco dello scroll dell'intro.
   - Aggiornamento delle misure dopo cambiamenti di layout.
   - Cleanup di listener, timer e istanza Lenis.

   Questo componente non modifica posizione, rotazione
   o timeline degli oggetti 3D.
   ========================================================= */

export default function FluidEngine() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let disposed = false;

    let lenis: Lenis | null = null;

    let refreshTimer:
      ReturnType<typeof setTimeout> | undefined;

    let lockObserver: MutationObserver | null = null;

    let removeTicker: (() => void) | null = null;

    const desktopInput = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    );

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    /*
     * Non aggiorniamo ScrollTrigger a ogni cambiamento
     * del DOM: sarebbe costoso durante le animazioni.
     *
     * Raggruppiamo invece gli aggiornamenti di layout
     * in un unico refresh ritardato.
     */
    function scheduleRefresh() {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }

      refreshTimer = setTimeout(() => {
        if (disposed || document.hidden) {
          return;
        }

        lenis?.resize();

        ScrollTrigger.refresh();
      }, 180);
    }

    /*
     * IntroPresentation modifica overflow del body.
     * Lenis deve rispettare quel blocco, senza provare
     * a riavviare lo scorrimento durante l'introduzione.
     */
    function isPageLocked() {
      const body = document.body;

      return (
        body.style.overflow === "hidden" ||
        body.style.overflowY === "hidden" ||
        body.classList.contains("is-locked") ||
        body.classList.contains("no-scroll")
      );
    }

    function synchronizeLock() {
      if (!lenis) {
        return;
      }

      if (isPageLocked()) {
        if (!lenis.isStopped) {
          lenis.stop();
        }

        return;
      }

      if (lenis.isStopped) {
        lenis.start();
        scheduleRefresh();
      }
    }

    /*
     * Rimuove soltanto le risorse di questo motore.
     * Non elimina le timeline o gli ScrollTrigger
     * appartenenti alle altre parti del sito.
     */
    function destroySmoothScroll() {
      lockObserver?.disconnect();
      lockObserver = null;

      removeTicker?.();
      removeTicker = null;

      lenis?.destroy();
      lenis = null;
    }

    function createSmoothScroll() {
      if (
        lenis ||
        disposed ||
        !desktopInput.matches ||
        reducedMotion.matches
      ) {
        return;
      }

      const instance = new Lenis({
        /*
         * Il ticker GSAP chiamerà raf().
         * Non avviare contemporaneamente autoRaf.
         */
        autoRaf: false,

        autoResize: true,

        smoothWheel: true,

        /*
         * Manteniamo il comportamento touch del browser.
         */
        syncTouch: false,

        /*
         * Valore abbastanza reattivo da non trasformare
         * lo scorrimento in un trascinamento lento.
         */
        lerp: 0.16,

        wheelMultiplier: 1,
        touchMultiplier: 1,

        /*
         * Gestione dei collegamenti #contatti, #home, ecc.
         * Offset negativo per lasciare spazio alla navbar.
         */
        anchors: {
          offset: -88,
        },

        /*
         * Questi elementi mantengono lo scroll nativo.
         * L'attributo potrà essere usato anche per
         * eventuali modali o pannelli futuri.
         */
        prevent: (node) => {
          return (
            node.hasAttribute("data-native-scroll") ||
            node.hasAttribute("data-lenis-prevent") ||
            node.tagName === "TEXTAREA" ||
            node.tagName === "SELECT"
          );
        },
      });

      lenis = instance;

      const updateScrollTrigger = () => {
        ScrollTrigger.update();
      };

      instance.on("scroll", updateScrollTrigger);

      /*
       * GSAP fornisce il tempo in secondi.
       * Lenis richiede millisecondi.
       */
      const tick = (time: number) => {
        if (disposed || document.hidden) {
          return;
        }

        instance.raf(time * 1000);
      };

      gsap.ticker.add(tick);

      removeTicker = () => {
        gsap.ticker.remove(tick);

        instance.off(
          "scroll",
          updateScrollTrigger
        );
      };

      /*
       * Osserviamo solo gli attributi del body,
       * non l'intero albero del sito.
       */
      lockObserver = new MutationObserver(() => {
        synchronizeLock();
      });

      lockObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ["style", "class"],
      });

      synchronizeLock();
      scheduleRefresh();
    }

    /*
     * Se cambiano dispositivo di input o preferenze
     * di accessibilità, ricreiamo solo ciò che serve.
     */
    function reconcileMode() {
      if (
        desktopInput.matches &&
        !reducedMotion.matches
      ) {
        createSmoothScroll();
      } else {
        destroySmoothScroll();
      }

      scheduleRefresh();
    }

    /*
     * Al rientro nella scheda riallineiamo Lenis
     * alla posizione reale della pagina.
     */
    function handleVisibility() {
      if (document.hidden) {
        return;
      }

      if (lenis) {
        lenis.resize();

        lenis.scrollTo(window.scrollY, {
          immediate: true,
          force: true,
        });

        synchronizeLock();
      }

      ScrollTrigger.update();
      scheduleRefresh();
    }

    function handlePageShow() {
      reconcileMode();
      handleVisibility();
    }

    function handleAssetLoad(event: Event) {
      const target = event.target;

      if (
        target instanceof HTMLImageElement ||
        target instanceof HTMLVideoElement
      ) {
        scheduleRefresh();
      }
    }

    desktopInput.addEventListener(
      "change",
      reconcileMode
    );

    reducedMotion.addEventListener(
      "change",
      reconcileMode
    );

    window.addEventListener(
      "resize",
      scheduleRefresh,
      { passive: true }
    );

    window.addEventListener(
      "orientationchange",
      scheduleRefresh
    );

    window.addEventListener(
      "pageshow",
      handlePageShow
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    document.addEventListener(
      "load",
      handleAssetLoad,
      true
    );

    /*
     * Il caricamento dei font può cambiare righe,
     * altezze dei testi e punti di attivazione.
     */
    document.fonts.ready.then(() => {
      if (!disposed) {
        scheduleRefresh();
      }
    });

    reconcileMode();

    return () => {
      disposed = true;

      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }

      desktopInput.removeEventListener(
        "change",
        reconcileMode
      );

      reducedMotion.removeEventListener(
        "change",
        reconcileMode
      );

      window.removeEventListener(
        "resize",
        scheduleRefresh
      );

      window.removeEventListener(
        "orientationchange",
        scheduleRefresh
      );

      window.removeEventListener(
        "pageshow",
        handlePageShow
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );

      document.removeEventListener(
        "load",
        handleAssetLoad,
        true
      );

      destroySmoothScroll();
    };
  }, []);

  return null;
}

/* =========================================================
   SCENE ACTIVITY

   Questo componente va DENTRO un Canvas R3F.

   Quando la sezione associata non è più visibile,
   interrompe il rendering continuo di quel Canvas.

   Non usare display:none come unica ottimizzazione:
   nascondere un Canvas non arresta automaticamente
   il suo ciclo di rendering.
   ========================================================= */

type SceneActivityProps = {
  sectionSelector: string;
};

export function SceneActivity({
  sectionSelector,
}: SceneActivityProps) {
  const getState = useThree((state) => state.get);

  useEffect(() => {
    const target =
      document.querySelector<HTMLElement>(
        sectionSelector
      );

    if (!target) {
      return;
    }

    const initialMode = getState().frameloop;

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    let sectionVisible = false;

    function updateMode() {
      const state = getState();

      const shouldRenderContinuously =
        sectionVisible &&
        !document.hidden &&
        !motionPreference.matches;

      const nextMode = shouldRenderContinuously
        ? "always"
        : "demand";

      if (state.frameloop !== nextMode) {
        state.setFrameloop(nextMode);
      }

      if (shouldRenderContinuously) {
        state.invalidate();
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        sectionVisible = entry.isIntersecting;
        updateMode();
      },
      {
        /*
         * Attiviamo la scena leggermente prima
         * che entri nella viewport.
         */
        rootMargin: "120px 0px",
        threshold: 0,
      }
    );

    observer.observe(target);

    document.addEventListener(
      "visibilitychange",
      updateMode
    );

    motionPreference.addEventListener(
      "change",
      updateMode
    );

    return () => {
      observer.disconnect();

      document.removeEventListener(
        "visibilitychange",
        updateMode
      );

      motionPreference.removeEventListener(
        "change",
        updateMode
      );

      const state = getState();

      state.setFrameloop(initialMode);
    };
  }, [sectionSelector, getState]);

  return null;
}