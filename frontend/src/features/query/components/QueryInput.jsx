import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const UpArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"/>
    <polyline points="5 12 12 5 19 12"/>
  </svg>
);

export default function QueryInput({ onSend, isPending }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isPending) {
      inputRef.current?.focus();
    }
  }, [isPending]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim() || isPending) return;
    onSend(value);
    setValue('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-3xl mx-auto"
    >
      <form 
        onSubmit={handleSubmit} 
        className="relative flex items-center bg-white border border-stone-200 rounded-lg shadow-sm focus-within:border-stone-400 focus-within:ring-1 focus-within:ring-stone-400 transition-all overflow-hidden"
      >
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isPending}
          placeholder={isPending ? 'Analyzing data...' : 'What is your research question?'}
          className="flex-1 w-full bg-transparent text-stone-800 text-lg sm:text-xl font-sans placeholder:text-stone-400 resize-none py-4 pl-6 pr-16 min-h-[64px] focus:outline-none disabled:opacity-50"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        
        <button
          type="submit"
          disabled={isPending || !value.trim()}
          className="absolute right-3 bottom-3 w-10 h-10 flex items-center justify-center bg-stone-900 text-white rounded-md hover:bg-stone-800 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {isPending ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <UpArrowIcon />
          )}
        </button>
      </form>
      <div className="mt-3 flex items-center gap-4 text-sm text-stone-500 font-sans">
        <span>Press <kbd className="font-mono bg-stone-100 border border-stone-200 rounded px-1.5 py-0.5 text-xs">Enter</kbd> to submit</span>
        <span>•</span>
        <span><kbd className="font-mono bg-stone-100 border border-stone-200 rounded px-1.5 py-0.5 text-xs">Shift</kbd> + <kbd className="font-mono bg-stone-100 border border-stone-200 rounded px-1.5 py-0.5 text-xs">Enter</kbd> for new line</span>
      </div>
    </motion.div>
  );
}
