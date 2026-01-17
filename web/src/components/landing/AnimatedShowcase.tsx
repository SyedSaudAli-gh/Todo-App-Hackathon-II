"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { LANDING_CONTENT } from "@/lib/constants";
import { todoSlideVariants, checkmarkVariants } from "@/lib/animations";
import { DemoTodo } from "@/types/landing";

export function AnimatedShowcase() {
  const [demoTodos, setDemoTodos] = useState<DemoTodo[]>(
    [...LANDING_CONTENT.showcase.demoTodos]
  );

  // Automated animation sequence
  useEffect(() => {
    const interval = setInterval(() => {
      setDemoTodos((prev) => {
        // Find first incomplete todo and mark it complete
        const firstIncomplete = prev.findIndex((todo) => !todo.completed);
        if (firstIncomplete !== -1) {
          const updated = [...prev];
          updated[firstIncomplete] = { ...updated[firstIncomplete], completed: true };
          return updated;
        }
        // Reset all to incomplete if all are complete
        return prev.map((todo) => ({ ...todo, completed: false }));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <section id="showcase" className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto max-w-3xl px-4">
        <h2 className="text-center text-2xl font-bold md:text-3xl lg:text-4xl">
          {LANDING_CONTENT.showcase.title}
        </h2>

        <div className="mt-8 space-y-3 md:space-y-4">
          <AnimatePresence mode="wait">
            {demoTodos.map((todo) => (
              <motion.div
                key={todo.id}
                variants={todoSlideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`flex items-center gap-3 rounded-lg border bg-card p-3 shadow-sm transition-opacity md:p-4 ${
                  todo.completed ? "opacity-60" : "opacity-100"
                }`}
              >
                {/* Checkbox */}
                <motion.div
                  variants={checkmarkVariants}
                  animate={todo.completed ? "checked" : "unchecked"}
                  className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
                    todo.completed
                      ? "border-primary bg-primary"
                      : "border-muted-foreground"
                  }`}
                >
                  {todo.completed && <Check className="h-3 w-3 text-primary-foreground" />}
                </motion.div>

                {/* Todo Title */}
                <span
                  className={`flex-1 text-sm md:text-base ${
                    todo.completed ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {todo.title}
                </span>

                {/* Priority Badge */}
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium text-white ${getPriorityColor(
                    todo.priority
                  )}`}
                >
                  {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
