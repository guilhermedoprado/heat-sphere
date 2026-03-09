import { useState, useCallback, useEffect, useRef } from "react";

const STORAGE_KEY = "focusTimerConfig";

export type TimerPhase = "work" | "break";

export type FocusTimerConfig = {
  workMinutes: number;
  breakMinutes: number;
  autoAdvance: boolean;
};

const DEFAULT_CONFIG: FocusTimerConfig = {
  workMinutes: 25,
  breakMinutes: 5,
  autoAdvance: true,
};

const MIN_WORK = 1;
const MAX_WORK = 120;
const MIN_BREAK = 1;
const MAX_BREAK = 60;

function loadConfig(): FocusTimerConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw) as Partial<FocusTimerConfig>;
    return {
      workMinutes: clamp(parsed.workMinutes ?? DEFAULT_CONFIG.workMinutes, MIN_WORK, MAX_WORK),
      breakMinutes: clamp(parsed.breakMinutes ?? DEFAULT_CONFIG.breakMinutes, MIN_BREAK, MAX_BREAK),
      autoAdvance: parsed.autoAdvance ?? DEFAULT_CONFIG.autoAdvance,
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

function saveConfig(config: FocusTimerConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    /* ignore */
  }
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

export type UseFocusTimerOptions = {
  onWorkComplete?: (durationSecs: number) => void;
};

export function useFocusTimer(options: UseFocusTimerOptions = {}) {
  const { onWorkComplete } = options;

  const [config, setConfigState] = useState<FocusTimerConfig>(loadConfig);
  const [phase, setPhase] = useState<TimerPhase>("work");
  const [timeLeft, setTimeLeft] = useState(() => config.workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  const endTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseRef = useRef<TimerPhase>(phase);
  phaseRef.current = phase;

  const workSecs = config.workMinutes * 60;
  const breakSecs = config.breakMinutes * 60;

  const playAlarm = useCallback(() => {
    new Audio("https://assets.mixkit.co/active/bell.wav").play().catch(() => {});
  }, []);

  const startPhase = useCallback(
    (nextPhase: TimerPhase) => {
      const secs = nextPhase === "work" ? workSecs : breakSecs;
      setPhase(nextPhase);
      setTimeLeft(secs);
      endTimeRef.current = Date.now() + secs * 1000;
    },
    [workSecs, breakSecs]
  );

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    endTimeRef.current = null;
    setIsRunning(false);
  }, []);

  const tick = useCallback(() => {
    if (endTimeRef.current === null) return;
    const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
    setTimeLeft(remaining);

    if (remaining > 0) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    endTimeRef.current = null;
    setIsRunning(false);

    const currentPhase = phaseRef.current;
    if (currentPhase === "work") {
      onWorkComplete?.(workSecs);
      playAlarm();
      if (config.autoAdvance) {
        startPhase("break");
        setIsRunning(true);
      }
    } else {
      playAlarm();
      if (config.autoAdvance) {
        startPhase("work");
        setIsRunning(true);
      }
    }
  }, [phase, workSecs, breakSecs, config.autoAdvance, onWorkComplete, playAlarm, startPhase]);

  useEffect(() => {
    if (!isRunning) return;
    if (endTimeRef.current === null) {
      endTimeRef.current = Date.now() + timeLeft * 1000;
    }
    intervalRef.current = setInterval(tick, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, tick]);

  const toggle = useCallback(() => {
    if (isRunning) {
      stopTimer();
      return;
    }
    if (timeLeft <= 0) {
      startPhase(phase);
    }
    setIsRunning(true);
    endTimeRef.current = Date.now() + timeLeft * 1000;
  }, [isRunning, timeLeft, phase, startPhase, stopTimer]);

  const reset = useCallback(() => {
    stopTimer();
    const secs = phase === "work" ? workSecs : breakSecs;
    setTimeLeft(secs);
  }, [phase, workSecs, breakSecs, stopTimer]);

  const setWorkMinutes = useCallback((m: number) => {
    const v = clamp(m, MIN_WORK, MAX_WORK);
    setConfigState((c) => {
      const next = { ...c, workMinutes: v };
      saveConfig(next);
      return next;
    });
    if (!isRunning && phase === "work") {
      setTimeLeft(v * 60);
    }
  }, [isRunning, phase]);

  const setBreakMinutes = useCallback((m: number) => {
    const v = clamp(m, MIN_BREAK, MAX_BREAK);
    setConfigState((c) => {
      const next = { ...c, breakMinutes: v };
      saveConfig(next);
      return next;
    });
    if (!isRunning && phase === "break") {
      setTimeLeft(v * 60);
    }
  }, [isRunning, phase]);

  const setAutoAdvance = useCallback((v: boolean) => {
    setConfigState((c) => {
      const next = { ...c, autoAdvance: v };
      saveConfig(next);
      return next;
    });
  }, []);

  const switchToWork = useCallback(() => {
    stopTimer();
    startPhase("work");
  }, [stopTimer, startPhase]);

  const switchToBreak = useCallback(() => {
    stopTimer();
    startPhase("break");
  }, [stopTimer, startPhase]);

  return {
    timeLeft,
    isRunning,
    phase,
    config,
    toggle,
    reset,
    setWorkMinutes,
    setBreakMinutes,
    setAutoAdvance,
    switchToWork,
    switchToBreak,
    workSecs,
    breakSecs,
    MIN_WORK,
    MAX_WORK,
    MIN_BREAK,
    MAX_BREAK,
  };
}
