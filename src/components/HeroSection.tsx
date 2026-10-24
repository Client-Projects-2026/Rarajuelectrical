import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "../icons";
import { heroSlides } from "../data/heroSlides";
import PowerFlowOverlay from "./PowerFlowOverlay";

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isPausedByPointer, setIsPausedByPointer] = useState(false);
  const [isPausedByFocus, setIsPausedByFocus] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const updateMotionPreference = () =>
      setPrefersReducedMotion(motionPreference.matches);
    updateMotionPreference();
    motionPreference.addEventListener("change", updateMotionPreference);
    return () =>
      motionPreference.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (
      !autoPlay ||
      prefersReducedMotion ||
      isPausedByPointer ||
      isPausedByFocus
    ) {
      return;
    }
    const timer = window.setInterval(() => {
      setActiveSlide((index) => (index + 1) % heroSlides.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [activeSlide, autoPlay, isPausedByFocus, isPausedByPointer, prefersReducedMotion]);

  const showSlide = (index: number) => {
    setActiveSlide((index + heroSlides.length) % heroSlides.length);
  };
  const slide = heroSlides[activeSlide];
  const isAutoRotating =
    autoPlay && !prefersReducedMotion && !isPausedByPointer && !isPausedByFocus;

  return (
    <section
      className={`hero${activeSlide === 1 ? " hero-slide-second" : ""}`}
      id="home"
      aria-labelledby="hero-title"
      aria-roledescription="carousel"
      aria-label="Featured electrical services"
      onMouseEnter={() => setIsPausedByPointer(true)}
      onMouseLeave={() => setIsPausedByPointer(false)}
      onFocusCapture={() => setIsPausedByFocus(true)}
      onBlurCapture={(event) => {
        const nextTarget = event.relatedTarget;
        if (
          !(nextTarget instanceof Node) ||
          !event.currentTarget.contains(nextTarget)
        ) {
          setIsPausedByFocus(false);
        }
      }}
    >
      <div className="hero-image" aria-hidden="true">
        {heroSlides.map((heroSlide, index) => (
          <img
            className={`hero-photo${index === 1 ? " hero-photo-reference" : ""}${activeSlide === index ? " is-active" : ""}`}
            src={heroSlide.image}
            alt=""
            key={heroSlide.image}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
          />
        ))}
      </div>
      <div className="hero-shade" />
      <PowerFlowOverlay slideIndex={activeSlide} />
      <div
        className="container hero-content"
        key={activeSlide}
        aria-live={isAutoRotating ? "off" : "polite"}
      >
        <p className="eyebrow light">
          <span /> ENGINEERING | INSTALLATION | LONG-TERM SUPPORT
        </p>
        <h1 id="hero-title" className="hero-reveal hero-title">
          {slide.title}
          <br />
          <em>
            {slide.lead}
            <span>{slide.accent}</span>
          </em>
        </h1>
        <p className="hero-intro hero-reveal">{slide.description}</p>
        <div className="hero-actions hero-reveal">
          <a className="button button-accent" href="#contact">
            {slide.primaryAction} <ArrowRight size={17} />
          </a>
          <a className="button button-text" href="#services">
            {slide.secondaryAction}
          </a>
        </div>
      </div>
      <button
        className="hero-side-control hero-side-previous"
        type="button"
        aria-label="Previous slide"
        onClick={() => showSlide(activeSlide - 1)}
      >
        <ArrowLeft size={19} />
      </button>
      <button
        className="hero-side-control hero-side-next"
        type="button"
        aria-label="Next slide"
        onClick={() => showSlide(activeSlide + 1)}
      >
        <ArrowRight size={19} />
      </button>
      <div className="hero-controls" aria-label="Hero slide controls">
        <span className="hero-slide-count" aria-hidden="true">
          0{activeSlide + 1}
          <span> / 0{heroSlides.length}</span>
        </span>
        <button
          className="hero-control"
          type="button"
          aria-label={
            prefersReducedMotion
              ? "Automatic slide rotation is disabled by your motion preference"
              : autoPlay
                ? "Pause slide rotation"
                : "Play slide rotation"
          }
          disabled={prefersReducedMotion}
          onClick={() => {
            setAutoPlay((playing) => !playing);
          }}
        >
          {autoPlay && !prefersReducedMotion ? (
            <Pause size={15} />
          ) : (
            <Play size={15} />
          )}
        </button>
        <div className="hero-dots" role="group" aria-label="Choose slide">
          {heroSlides.map((heroSlide, index) => (
            <button
              type="button"
              key={heroSlide.image}
              className={`hero-dot${activeSlide === index ? " is-active" : ""}`}
              aria-label={`Show slide ${index + 1}`}
              aria-pressed={activeSlide === index}
              onClick={() => showSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
