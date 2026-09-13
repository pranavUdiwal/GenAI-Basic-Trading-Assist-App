export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-mono text-sm font-medium transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-amber text-bg hover:bg-amber-hover active:scale-[0.97] border border-amber',
    secondary:
      'bg-transparent text-text border border-border-strong hover:bg-surface-hover active:scale-[0.97]',
    ghost:
      'bg-transparent text-text-dim hover:text-text hover:bg-surface-hover border border-transparent',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded',
    md: 'px-4 py-2 text-sm rounded',
    lg: 'px-6 py-2.5 text-sm rounded',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
