'use client';

import { useCallback, useEffect, useRef, useState } from "react";

type ParserWorkerHandle = {
  worker: Worker | null;
  isReady: boolean;
  parse: (payload: string) => Promise<unknown>;
};

export function useParserWorker(): ParserWorkerHandle {
  const workerRef = useRef<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(false);

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const parse = useCallback(async (_payload: string) => {
    if (!workerRef.current) {
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      resolve(null);
    });
  }, []);

  return {
    worker: workerRef.current,
    isReady,
    parse
  };
}
