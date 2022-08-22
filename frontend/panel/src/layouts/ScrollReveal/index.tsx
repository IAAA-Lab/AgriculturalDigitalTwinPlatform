import { useEffect, useRef } from "react";
import "../../index.css";

type Props = {
  children: any;
};

const ScrollReveal = ({ children }: Props) => {
  const observer = useRef<any>();

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("isActive");
        }
      });
    });
    const elemsWithIds = document.querySelectorAll("[class*=-animation]");
    elemsWithIds.forEach((elem) => observer.current.observe(elem));
    return () => {
      observer.current.disconnect();
    };
  }, []);
  return <>{children}</>;
};

export default ScrollReveal;
