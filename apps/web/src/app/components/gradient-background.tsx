/**
 * Site-wide diagonal brand gradient background.
 * Renders a non-interactive fixed layer behind the app content.
 */
export default function GradientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 brand-gradient"
    />
  );
}