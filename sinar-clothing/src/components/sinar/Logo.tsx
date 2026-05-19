export function Logo({ height = 40 }: { height?: number }) {
  return (
    <img
      src="/images/sinar-logo.jpeg"
      alt="Sinar Clothing"
      style={{ height }}
      className="w-auto object-contain rounded-xl"
      loading="eager"
    />
  );
}
