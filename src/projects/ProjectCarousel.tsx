import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "../icons";
import type { Project } from "../content/types";
import "./projects.css";

export default function ProjectCarousel({ projects }: { projects: Project[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLElement>(null);
  const pointerStartX = useRef<number | null>(null);
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [visibleSlides, setVisibleSlides] = useState(3);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [paused, setPaused] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setIndex(0);
  }, [projects.length]);

  const loopedProjects = [...projects, ...projects];

  if (projects.length === 0) {
    return <p className="container project-carousel-empty">Project details are being updated. Please check back soon.</p>;
  }

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    const card = firstCardRef.current;
    if (!viewport || !card) return;

    const measure = () => {
      const track = card.parentElement;
      const gap = track
        ? Number.parseFloat(getComputedStyle(track).columnGap) || 0
        : 0;
      const cardStep = card.getBoundingClientRect().width + gap;
      setStep(cardStep);
      setVisibleSlides(
        cardStep > 0
          ? Math.max(1, Math.ceil((viewport.clientWidth + gap) / cardStep))
          : 1,
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !autoPlay || reducedMotion || projects.length < 2) return;
    const timer = window.setInterval(() => setIndex((value) => value + 1), 5000);
    return () => window.clearInterval(timer);
  }, [autoPlay, paused, projects.length, reducedMotion]);

  useEffect(() => {
    if (transitionEnabled) return;
    const frame = window.requestAnimationFrame(() => setTransitionEnabled(true));
    return () => window.cancelAnimationFrame(frame);
  }, [transitionEnabled]);

  const goTo = (nextIndex: number) => {
    if (projects.length < 2) return;
    setTransitionEnabled(true);
    setIndex((nextIndex + projects.length) % projects.length);
  };

  const handleTransitionEnd = () => {
    if (index < projects.length) return;
    setTransitionEnabled(false);
    setIndex(index % projects.length);
  };

  return (
    <div
      className="project-carousel container"
      role="region"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setPaused(false);
      }}
      aria-label="Electrical project capabilities"
    >
      <div className="project-carousel-heading">
        <p>PROJECT CAPABILITIES</p>
        <div
          className="project-carousel-controls"
          role="group"
          aria-label="Project slides"
        >
          <button
            type="button"
            aria-label={
              reducedMotion
                ? "Automatic project rotation is disabled by your motion preference"
                : autoPlay
                  ? "Pause project rotation"
                  : "Play project rotation"
            }
            aria-pressed={!autoPlay}
            disabled={reducedMotion}
            onClick={() => setAutoPlay((playing) => !playing)}
          >
            {autoPlay && !reducedMotion ? <Pause size={15} /> : <Play size={15} />}
          </button>
          <button
            type="button"
            aria-label="Previous projects"
            onClick={() => goTo(index - 1)}
          >
            <ArrowLeft size={17} />
          </button>
          <button
            type="button"
            aria-label="Next projects"
            onClick={() => goTo(index + 1)}
          >
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
      <div
        className="project-carousel-viewport"
        ref={viewportRef}
        onPointerDown={(event) => {
          pointerStartX.current = event.clientX;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={(event) => {
          if (pointerStartX.current === null) return;
          const distance = event.clientX - pointerStartX.current;
          pointerStartX.current = null;
          if (Math.abs(distance) >= 45) goTo(index + (distance < 0 ? 1 : -1));
        }}
        onPointerCancel={() => {
          pointerStartX.current = null;
        }}
      >
        <div
          className={`project-carousel-track${transitionEnabled ? " is-animated" : ""}`}
          style={{ transform: `translateX(-${index * step}px)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {loopedProjects.map((project, itemIndex) => (
            <article
              className="project-slide"
              key={`${project.title}-${itemIndex}`}
              ref={itemIndex === 0 ? firstCardRef : undefined}
              aria-hidden={
                itemIndex < index || itemIndex >= index + visibleSlides
              }
            >
              <img src={project.image} alt={project.imageAlt} loading="lazy" />
              <div className="project-slide-copy">
                <p>{project.category}</p>
                <h3>{project.title}</h3>
                <span>{project.description}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div
        className="project-carousel-pagination"
        role="group"
        aria-label="Choose a project slide"
      >
        {projects.map((project, dotIndex) => (
          <button
            key={project.title}
            type="button"
            className={dotIndex === index % projects.length ? "is-active" : ""}
            aria-label={`Show project ${dotIndex + 1}: ${project.title}`}
            aria-current={dotIndex === index % projects.length ? "true" : undefined}
            onClick={() => goTo(dotIndex)}
          />
        ))}
      </div>
    </div>
  );
}
