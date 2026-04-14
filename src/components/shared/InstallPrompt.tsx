"use client";

import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { Download, X } from "lucide-react";

export function InstallPrompt() {
  const { visible, showIOSGuide, install, dismiss } = useInstallPrompt();

  if (!visible) return null;

  return (
    <div className="mx-4 mt-3 p-4 bg-surface border border-border rounded-2xl shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
          <Download size={20} className="text-white" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary">
            Add Hearth to your home screen
          </p>
          <p className="text-xs text-text-secondary mt-0.5">
            {showIOSGuide ? (
              <>
                Tap <strong>Share</strong> (the square with an arrow), then{" "}
                <strong>Add to Home Screen</strong>.
              </>
            ) : (
              "Quick access — feels like a native app."
            )}
          </p>
        </div>
        <button
          onClick={dismiss}
          className="flex-shrink-0 p-1 rounded text-text-secondary hover:bg-primary-light transition-colors"
          aria-label="Dismiss install prompt"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
      {!showIOSGuide && (
        <div className="flex justify-end gap-2 mt-3">
          <button
            onClick={dismiss}
            className="px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-primary-light rounded-lg transition-colors"
          >
            Not now
          </button>
          <button
            onClick={install}
            className="px-3 py-1.5 text-xs font-medium text-white bg-cta hover:bg-cta-hover rounded-lg transition-colors"
          >
            Install
          </button>
        </div>
      )}
    </div>
  );
}
