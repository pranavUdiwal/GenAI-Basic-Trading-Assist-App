import StatusDot from './StatusDot';
import { useAuth } from '../../context/AuthContext';

export default function SessionPill() {
  const { user } = useAuth();

  const label = user
    ? `SESSION ACTIVE : ${(user.name || user.email || 'USER').toUpperCase()}`
    : 'SESSION ACTIVE : GUEST';

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded font-mono text-[11px] text-text-dim tracking-wider">
      <StatusDot color="amber" size="xs" pulse />
      <span>{label}</span>
    </div>
  );
}
