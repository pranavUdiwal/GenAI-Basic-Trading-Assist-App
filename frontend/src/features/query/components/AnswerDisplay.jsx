import { motion, AnimatePresence } from 'framer-motion';

export default function AnswerDisplay({ question, answer }) {
  if (!question && !answer) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl mx-auto mt-8 md:mt-16 mb-24 px-4 sm:px-0"
      >
        <div className="self-center flex flex-col space-y-12">
          {/* Question Section */}
          <div className='self-center'>
            <h2 className="font-serif text-sm font-semibold tracking-widest uppercase text-stone-400 mb-4">
              Research Query
            </h2>
            <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 leading-tight">
              {question}
            </h1>
          </div>

          {/* Answer Section */}
          {answer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className='self-center w-full max-w-2xl'
            >
              <div className="w-12 h-[1px] bg-stone-300 mb-10 mx-auto" />
              
              <h2 className="font-serif text-sm font-semibold tracking-widest uppercase text-stone-400 mb-6">
                Findings
              </h2>
              
              <div className="prose prose-stone prose-lg max-w-none font-sans text-stone-700 leading-relaxed whitespace-pre-wrap">
                {answer.text}
              </div>
              
              <div className="mt-8 flex items-center justify-between border-t border-stone-200 pt-6">
                <span className="text-xs font-mono text-stone-400">
                  Generated at {answer.timestamp}
                </span>
                <button 
                  className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                  onClick={() => navigator.clipboard.writeText(answer.text)}
                >
                  Copy Report
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
