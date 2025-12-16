import { X, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import clsx from 'clsx';

const SettingsPanel = ({ open, onClose }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <div
        className={clsx(
          'fixed inset-0 z-40 bg-black/50 transition-opacity',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />
      <aside
        className={clsx(
          'fixed top-0 right-0 z-50 h-full w-80 max-w-full bg-surface border-l border-surface shadow-card transition-transform',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-surface">
          <div>
            <p className="text-sm font-semibold">Settings</p>
            <p className="text-xs text-slate-400">Customize your experience</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-background text-slate-300"
            aria-label="Close settings"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-slate-400">Appearance</p>
            <div className="rounded-xl border border-surface bg-background p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Theme</p>
                <p className="text-xs text-slate-400">Switch between Light and Dark</p>
              </div>
              <button
                onClick={toggleTheme}
                className="relative inline-flex h-9 w-16 items-center rounded-full bg-surface border border-surface transition"
                aria-label="Toggle theme"
              >
                <span
                  className={clsx(
                    'absolute h-7 w-7 rounded-full bg-accent text-background flex items-center justify-center transition-transform shadow-glow',
                    theme === 'dark' ? 'translate-x-1' : 'translate-x-8'
                  )}
                >
                  {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </span>
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-surface/70 bg-background/60 p-4 text-sm text-slate-400">
            Future options: notification preferences, language, saved payments.
          </div>
        </div>
      </aside>
    </>
  );
};

export default SettingsPanel;

