"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface SlideoutDrawerProps {
  trigger?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
}

export function SlideoutDrawer({ trigger, title, description, children }: SlideoutDrawerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      {trigger && (
        <DialogPrimitive.Trigger asChild>
          {trigger}
        </DialogPrimitive.Trigger>
      )}
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild>
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
                className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-[var(--surface-primary)] sm:border-l border-[var(--border-primary)] shadow-2xl flex flex-col"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-primary)]">
                  <div>
                    {title && (
                      <DialogPrimitive.Title className="text-lg font-semibold text-[var(--text-primary)]">
                        {title}
                      </DialogPrimitive.Title>
                    )}
                    {description && (
                      <DialogPrimitive.Description className="text-sm text-[var(--text-secondary)] mt-1">
                        {description}
                      </DialogPrimitive.Description>
                    )}
                  </div>
                  <DialogPrimitive.Close className="p-2 -mr-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-[var(--text-secondary)] transition-colors focus:outline-none">
                    <X className="w-5 h-5" />
                    <span className="sr-only">Close</span>
                  </DialogPrimitive.Close>
                </div>
                <div className="flex-1 overflow-y-auto p-6 bg-[var(--surface-primary)] bg-white">
                  {children}
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
