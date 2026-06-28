import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from "react";

export type GenStatus = "idle" | "generating" | "completed" | "failed" | "pending";

export interface GenTask {
  id: string;
  status: GenStatus;
  prompt: string;
  size: string;
  mode: "t2i" | "i2i";
  providerName: string;
  providerModel: string;
  startTime: number;
  endTime?: number;
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
  selectedSubject: string;
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
  selectedSubject: "",
};

const EMPTY_INPUT_STATE: GenInputState = {
  mode: "t2i",
  t2i: { ...EMPTY_INPUT },
  i2i: { ...EMPTY_INPUT },
};

const EMPTY_TASK: GenTask = {
  id: "",
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
  // 新 API：任务列表
  tasks: GenTask[];
  addTask: (partial: Pick<GenTask, "prompt" | "size" | "mode" | "providerName" | "providerModel"> & { status?: GenStatus }) => string;
  updateTask: (id: string, partial: Partial<GenTask>) => void;
  removeTask: (id: string) => void;
  clearTasks: () => void;

  // 兼容旧 API：指向最新任务
  task: GenTask;
  input: GenInputState;
  saveInput: (partial: Partial<GenInput>) => void;
  setInputMode: (mode: "t2i" | "i2i") => void;
  startTask: (partial: Pick<GenTask, "prompt" | "size" | "mode" | "providerName" | "providerModel">) => string;
  finishTask: (resultFilename: string) => void;
  failTask: (errorMsg: string, errorCode: string) => void;
  resetTask: () => void;
  setResultDataUrl: (url: string) => void;
}

const GenContext = createContext<GenContextValue | null>(null);

function genId() {
  return `t_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// ====== 任务持久化 ======

const TASKS_KEY = "futureai_tasks";

function persistTasks(tasks: GenTask[]) {
  const clean = tasks.map(({ resultDataUrl, ...rest }) => rest);
  try { localStorage.setItem(TASKS_KEY, JSON.stringify(clean)); } catch { /* quota */ }
}

function restoreTasks(): GenTask[] {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (!raw) return [];
    const tasks: GenTask[] = JSON.parse(raw);
    // 重启后：生成中/排队 → 失败，其余保留
    return tasks.map((t) =>
      t.status === "generating" || t.status === "pending"
        ? { ...t, status: "failed" as GenStatus, errorMsg: "软件已重启，任务中断", errorCode: "restarted", endTime: Date.now() }
        : t
    );
  } catch { return []; }
}

export function GenerationProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<GenTask[]>(restoreTasks);
  const [input, setInput] = useState<GenInputState>(EMPTY_INPUT_STATE);
  const tasksRef = useRef<GenTask[]>([]);
  const activeIdRef = useRef<string | null>(null);

  tasksRef.current = tasks;

  // 任务变化 → 持久化
  useEffect(() => { persistTasks(tasks); }, [tasks]);

  // ====== 新 API ======

  const addTask = useCallback((partial: Pick<GenTask, "prompt" | "size" | "mode" | "providerName" | "providerModel"> & { status?: GenStatus }) => {
    const id = genId();
    const t: GenTask = {
      ...EMPTY_TASK,
      ...partial,
      id,
      status: partial.status || "pending",
      startTime: Date.now(),
    };
    tasksRef.current = [...tasksRef.current, t];
    activeIdRef.current = id;
    setTasks(tasksRef.current);
    return id;
  }, []);

  const updateTask = useCallback((id: string, partial: Partial<GenTask>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...partial } : t)));
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearTasks = useCallback(() => {
    setTasks([]);
    activeIdRef.current = null;
  }, []);

  // ====== 兼容旧 API（操作最新任务）======
  // 仅在当前会话有活动任务时才显示，避免重启后显示旧的完成状态
  const task = activeIdRef.current
    ? (tasks.find(t => t.id === activeIdRef.current) || EMPTY_TASK)
    : EMPTY_TASK;

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
    return addTask({ ...partial, status: "generating" });
  }, [addTask]);

  const finishTask = useCallback((resultFilename: string) => {
    const id = activeIdRef.current;
    if (id) updateTask(id, { status: "completed", resultFilename, endTime: Date.now() });
  }, [updateTask]);

  const failTask = useCallback((errorMsg: string, errorCode: string) => {
    const id = activeIdRef.current;
    if (id) updateTask(id, { status: "failed", errorMsg, errorCode, endTime: Date.now() });
  }, [updateTask]);

  const resetTask = useCallback(() => {
    const id = activeIdRef.current;
    if (id) removeTask(id);
    activeIdRef.current = null;
  }, [removeTask]);

  const setResultDataUrl = useCallback((url: string) => {
    const id = activeIdRef.current;
    if (id) updateTask(id, { resultDataUrl: url });
  }, [updateTask]);

  return (
    <GenContext.Provider value={{ tasks, addTask, updateTask, removeTask, clearTasks, task, input, saveInput, setInputMode, startTask, finishTask, failTask, resetTask, setResultDataUrl }}>
      {children}
    </GenContext.Provider>
  );
}

export function useGenTask() {
  const ctx = useContext(GenContext);
  if (!ctx) throw new Error("useGenTask must be used within GenerationProvider");
  return ctx;
}