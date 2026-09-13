import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../../components/ui/Button';

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { login, signup, isLoading } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password });
      } else {
        await signup({ name: form.name, email: form.email, password: form.password });
      }
      onClose();
      setForm({ name: '', email: '', password: '' });
    } catch {
      // Toast is fired by AuthContext
    }
  };

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-surface border border-border rounded p-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-mono text-sm text-text tracking-wider uppercase">
            {mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </h2>
          <button
            onClick={onClose}
            className="font-mono text-text-muted hover:text-text text-sm transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab toggle */}
        <div className="flex gap-1 mb-5 p-0.5 bg-surface-light rounded">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-1.5 font-mono text-[11px] tracking-wider rounded transition-colors cursor-pointer ${
              mode === 'login'
                ? 'bg-surface-hover text-text'
                : 'text-text-muted hover:text-text-dim'
            }`}
          >
            SIGN IN
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-1.5 font-mono text-[11px] tracking-wider rounded transition-colors cursor-pointer ${
              mode === 'signup'
                ? 'bg-surface-hover text-text'
                : 'text-text-muted hover:text-text-dim'
            }`}
          >
            SIGN UP
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={handleChange('name')}
              required
              className="w-full bg-bg border border-border rounded px-3 py-2 text-sm text-text font-sans placeholder:text-text-muted focus:outline-none focus:border-amber/40 transition-colors"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange('email')}
            required
            className="w-full bg-bg border border-border rounded px-3 py-2 text-sm text-text font-sans placeholder:text-text-muted focus:outline-none focus:border-amber/40 transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange('password')}
            required
            minLength={6}
            className="w-full bg-bg border border-border rounded px-3 py-2 text-sm text-text font-sans placeholder:text-text-muted focus:outline-none focus:border-amber/40 transition-colors"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isLoading}
            className="w-full mt-2"
          >
            {isLoading ? 'PROCESSING_' : mode === 'login' ? 'SIGN IN →' : 'CREATE ACCOUNT →'}
          </Button>
        </form>
      </div>
    </div>
  );
}
