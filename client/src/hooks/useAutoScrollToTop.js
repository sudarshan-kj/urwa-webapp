import { useEffect } from "react";

const useAutoScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  });
};

export default useAutoScrollToTop;
