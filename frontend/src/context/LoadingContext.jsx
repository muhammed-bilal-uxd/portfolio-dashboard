import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import Loading from "../components/Loading/Loading";

const LoadingContext = createContext({
  isLoading: false,
});

export function LoadingProvider({ children }) {
  const [activeRequests, setActiveRequests] = useState(0);
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const requestCountRef = useRef(0);
  const hideLoaderTimeoutRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.fetch !== "function") {
      return undefined;
    }

    const originalFetch = window.fetch.bind(window);

    const startLoading = () => {
      requestCountRef.current += 1;
      setActiveRequests(requestCountRef.current);
    };

    const stopLoading = () => {
      requestCountRef.current = Math.max(0, requestCountRef.current - 1);
      setActiveRequests(requestCountRef.current);
    };

    window.fetch = async (...args) => {
      startLoading();

      try {
        return await originalFetch(...args);
      } finally {
        stopLoading();
      }
    };

    return () => {
      if (hideLoaderTimeoutRef.current) {
        clearTimeout(hideLoaderTimeoutRef.current);
      }
      window.fetch = originalFetch;
    };
  }, []);

  useEffect(() => {
    if (activeRequests > 0) {
      if (hideLoaderTimeoutRef.current) {
        clearTimeout(hideLoaderTimeoutRef.current);
        hideLoaderTimeoutRef.current = null;
      }

      setIsLoaderVisible(true);
      return undefined;
    }

    hideLoaderTimeoutRef.current = setTimeout(() => {
      setIsLoaderVisible(false);
      hideLoaderTimeoutRef.current = null;
    }, 2000);

    return () => {
      if (hideLoaderTimeoutRef.current) {
        clearTimeout(hideLoaderTimeoutRef.current);
        hideLoaderTimeoutRef.current = null;
      }
    };
  }, [activeRequests]);

  const value = useMemo(
    () => ({
      isLoading: isLoaderVisible,
    }),
    [isLoaderVisible],
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {value.isLoading && <Loading />}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
