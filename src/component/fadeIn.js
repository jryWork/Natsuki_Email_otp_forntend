import { useEffect, useState } from "react";
const FadeIn = ({ children, key }) => {
  const [style, setStyle] = useState({
    opacity: 0,
    transform: "translateX(-20px)",
  });

  useEffect(() => {
    setStyle({ opacity: 0, transform: "translateX(-20px)" }); // Reset style
    const timer = setTimeout(() => { // Start animation
      setStyle({ opacity: 1, transform: "translateX(0)" });
    }, 100);
    return () => clearTimeout(timer); // Cleanup
  }, [key]); // Re-run effect when key changes

  return (
    <div
      style={{
        ...style,
        transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
};

export default FadeIn;