import { useEffect, useState } from "react";

const useMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSizeLessThan900, setIsSizeLessThan900] = useState(window.innerWidth < 900);
  const [isSizeLessThan1080, setIsSizeLessThan1080] = useState(
    window.innerWidth < 1080
  );

  const checkWindowSize = () => {
    setIsMobile(window.innerWidth < 768);
    setIsSizeLessThan900(window.innerWidth < 900);
    setIsSizeLessThan1080(window.innerWidth < 1080);
  };

  useEffect(() => {
    // Check screen size initially
    checkWindowSize();

    // Add resize listener
    window.addEventListener("resize", checkWindowSize);

    // Cleanup listener
    return () => window.removeEventListener("resize", checkWindowSize);
  }, []);

  return { isMobile, isSizeLessThan1080 , isSizeLessThan900};
};

export default useMobile;
