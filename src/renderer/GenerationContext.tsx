import { createContext, useContext, useState, useRef, useCallback, type ReactNode } from "react";

export type GenStatus = "idle" | "generating" | "completed" | "failed";

export interface GenTask {
  status: GenStatus;
  prompt: string;
  size: string;
  mode: "t2i" | "i2i";
  providerName: string;
  providerModel: string;
  startTime: number;
  resultFilename: string;
  resultDataUrl: string;
  errorMsg: string;
  errorCode: string;
}

export interface GenInput {
  prompt: string;
  ratioIdx: number;
  qualityIdx: number;
  selectedStyle: string;
}

export interface GenInputState {
  mode: "t2i" | "i2i";
  t2i: GenInput;
  i2i: GenInput;
}

const EMPTY_INPUT: GenInput = {
  prompt: "",
  ratioIdx: 0,
  qualityIdx: 0,
  selectedStyle: "",
};

const EMPTY_INPUT_STATE: GenInputState = {
  mode: "t2i",
  t2i: { ...EMPTY_INPUT },
  i2i: { ...EMPTY_INPUT },
};

const EMPTY_TASK: GenTask = {
  status: "idle",
  prompt: "",
  size: "",
  mode: "t2i",
  providerName: "",
  providerModel: "",
  startTime: 0,
  resultFilename: "",
  resultDataUrl: "",
  errorMsg: "",
  errorCode: "",
};

interface GenContextValue {
  task: GenTask;
  input: GenInputState;
  saveInput: (partial: Partial<GenInput>) => void;
  setInputMode: (mode: "t2i" | "i2i") => void;
  startTask: (partial: Pick<GenTask, "prompt" | "size" | "mode" | "providerName" | "providerModel">) => void;
  finishTask: (resultFilename: string) => void;
  failTask: (errorMsg: string, errorCode: string) => void;
  resetTask: () => void;
  setResultDataUrl: (url: string) => void;
}

const GenContext = createContext<GenContextValue | null>(null);

export function GenerationProvider({ children }: { children: ReactNode }) {
  const [task, setTask] = useState<GenTask>(EMPTY_TASK);
  const [input, setInput] = useState<GenInputState>(EMPTY_INPUT_STATE);
  const taskRef = useRef<GenTask>(EMPTY_TASK);

  taskRef.current = task;

  const saveInput = useCallback((partial: Partial<GenInput>) => {
    setInput((prev) => {
      const modeKey = prev.mode;
      return { ...prev, [modeKey]: { ...prev[modeKey], ...partial } };
    });
  }, []);

  const setInputMode = useCallback((mode: "t2i" | "i2i") => {
    setInput((prev) => ({ ...prev, mode }));
  }, []);

  const startTask = useCallback((partial: Pick<GenTask, "prompt" | "size" | "mode" | "providerName" | "providerModel">) => {
    const t: GenTask = {
      ...EMPTY_TASK,
      ...partial,
      status: "generating",
      startTime: Date.now(),
    };
    taskRef.current = t;
    setTask(t);
  }, []);

  const finishTask = useCallback((resultFilename: string) => {
    const t = { ...taskRef.current, status: "completed" as GenStatus, resultFilename };
    taskRef.current = t;
    setTask(t);
  }, []);

  const failTask = useCallback((errorMsg: string, errorCode: string) => {
    const t = { ...taskRef.current, status: "failed" as GenStatus, errorMsg, errorCode };
    taskRef.current = t;
    setTask(t);
  }, []);

  const resetTask = useCallback(() => {
    taskRef.current = EMPTY_TASK;
    setTask(EMPTY_TASK);
  }, []);

  const setResultDataUrl = useCallback((url: string) => {
    const t = { ...taskRef.current, resultDataUrl: url };
    taskRef.current = t;
    setTask(t);
  }, []);

  return (
    <GenContext.Provider value={{ task, input, saveInput, setInputMode, startTask, finishTask, failTask, resetTask, setResultDataUrl }}>
      {children}
    </GenContext.Provider>
  );
}

export function useGenTask() {
  const ctx = useContext(GenContext);
  if (!ctx) throw new Error("useGenTask must be used within GenerationProvider");
  return ctx;
}
