"use client";

import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export function InstallPrompt() {
  const { visible, showIOSGuide, install, dismiss } = useInstallPrompt();

  if (!visible) return null;

  return (
    <div className="mx-4 mt-3 p-4 bg-surface border border-outline-variant rounded-2xl shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
          <MaterialIcon name="download" size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-on-surface">
            Add Hearth to your home screen
          </p>
          <p className="text-xs text-on-surface-variant mt-0.5">
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
          className="flex-shrink-0 p-1 rounded text-on-surface-variant hover:bg-primary-container transition-colors"
          aria-label="Dismiss install prompt"
        >
          <MaterialIcon name="close" size={16} />
        </button>
      </div>
      {!showIOSGuide && (
        <div className="flex justify-end gap-2 mt-3">
          <button
            onClick={dismiss}
            className="px-3 py-1.5 text-xs font-medium text-on-surface-variant hover:bg-primary-container rounded-lg transition-colors"
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
