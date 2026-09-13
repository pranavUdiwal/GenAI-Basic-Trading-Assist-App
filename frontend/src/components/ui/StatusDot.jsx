export default function StatusDot({ color = 'amber', size = 'sm', pulse = false }) {
  const colors = {
    amber: 'bg-amber',
    success: 'bg-success',
    danger: 'bg-danger',
    dim: 'bg-text-muted',
  };

  const sizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={`inline-block rounded-full ${colors[color]} ${sizes[size]} ${pulse ? 'animate-pulse-dot' : ''}`}
    />
  );
}
