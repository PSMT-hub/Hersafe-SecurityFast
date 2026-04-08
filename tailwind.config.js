/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './src/**/*.{js,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],

  theme: {
    extend: {
      colors: {
        // ── Backgrounds ──────────────────────────────────
        bg:          'var(--color-bg)',
        surface:     'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        'surface-3': 'var(--color-surface-3)',

        // ── Primary (Violeta Proteção) ────────────────────
        primary: {
          DEFAULT: 'var(--color-primary)',
          light:   'var(--color-primary-light)',
          dark:    'var(--color-primary-dark)',
          muted:   'var(--color-primary-muted)',
        },

        // ── Emergency (Rosa SOS) ──────────────────────────
        emergency: {
          DEFAULT: 'var(--color-emergency)',
          light:   'var(--color-emergency-light)',
          dark:    'var(--color-emergency-dark)',
          muted:   'var(--color-emergency-muted)',
        },

        // ── Semantic (Status) ─────────────────────────────
        safe: {
          DEFAULT: 'var(--color-safe)',
          muted:   'var(--color-safe-muted)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          muted:   'var(--color-warning-muted)',
        },
        danger: {
          DEFAULT: 'var(--color-danger)',
          muted:   'var(--color-danger-muted)',
        },

        // ── Text ──────────────────────────────────────────
        text: {
          DEFAULT: 'var(--color-text)',
          muted:   'var(--color-text-muted)',
          dim:     'var(--color-text-dim)',
          inverse: 'var(--color-text-inverse)',
        },

        // ── Border ────────────────────────────────────────
        border: {
          DEFAULT: 'var(--color-border)',
          focus:   'var(--color-border-focus)',
        },
      },

      // ── Border Radius ─────────────────────────────────
      borderRadius: {
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        full: 'var(--radius-full)',
      },

      // ── Font Size ────────────────────────────────────
      fontSize: {
        xs:   'var(--font-xs)',
        sm:   'var(--font-sm)',
        base: 'var(--font-base)',
        lg:   'var(--font-lg)',
        xl:   'var(--font-xl)',
        '2xl': 'var(--font-2xl)',
        '3xl': 'var(--font-3xl)',
        '4xl': 'var(--font-4xl)',
      },

      // ── Box Shadow (via shadow-* classes) ────────────
      boxShadow: {
        sm:             'var(--shadow-sm)',
        md:             'var(--shadow-md)',
        lg:             'var(--shadow-lg)',
        'glow-primary':   'var(--shadow-glow-primary)',
        'glow-emergency': 'var(--shadow-glow-emergency)',
      },
    },
  },

  plugins: [],
};
