import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./PageTransition.css";

export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayedChildren, setDisplayedChildren] = useState(children);
  const [phase, setPhase] = useState("in");
  const previousPath = useRef(location.pathname);
  const latestChildren = useRef(children);
  const containerRef = useRef(null);
  latestChildren.current = children;

  const focusMainHeading = () => {
    requestAnimationFrame(() => {
      const heading = containerRef.current?.querySelector("h1");
      if (!heading) return;
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    });
  };

  useEffect(() => {
    if (location.pathname === previousPath.current) {
      setDisplayedChildren(children);
      return undefined;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      previousPath.current = location.pathname;
      setDisplayedChildren(children);
      setPhase("in");
      focusMainHeading();
      return undefined;
    }

    setPhase("out");
    const timeout = window.setTimeout(() => {
      previousPath.current = location.pathname;
      setDisplayedChildren(latestChildren.current);
      setPhase("in");
      focusMainHeading();
    }, 180);

    return () => window.clearTimeout(timeout);
  }, [location.pathname, location.search, location.hash]);

  return (
    <div id="main-content" ref={containerRef} tabIndex={-1} className={`page-transition page-transition--${phase}`}>
      {displayedChildren}
    </div>
  );
}