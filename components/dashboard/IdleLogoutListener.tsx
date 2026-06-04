"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase/client";

// Durasi idle timeout: 3 menit (180.000 ms)
const IDLE_TIMEOUT_MS = 3 * 60 * 1000;

export function IdleLogoutListener() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error("Error signing out during idle logout:", err);
      } finally {
        window.location.href = "/login";
      }
    };

    const resetTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(handleLogout, IDLE_TIMEOUT_MS);
    };

    resetTimer();

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []);

  return null;
}
