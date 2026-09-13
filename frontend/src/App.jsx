import { Toaster } from 'react-hot-toast';
import { useQuery } from './features/query/hooks/useQuery';
import QueryInput from './features/query/components/QueryInput';
import AnswerDisplay from './features/query/components/AnswerDisplay';

export default function App() {
  const { isPending, answer, submittedQuestion, submitQuery, resetQuery } = useQuery();

  return (
    <div className='bg-stone-50 self-center w-[95%] h-[90%] rounded-xl p-8 flex items-center justify-center'>
      <div className="flex flex-col items-center justify-center h-full w-full bg-stone-50 text-stone-900 font-sans">
      
      {/* Minimal Header */}
      <header className="w-full py-8 flex items-center justify-between z-10 shrink-0 px-6 md:px-12 lg:px-20">
        <div 
          className="flex items-center cursor-pointer group"
          onClick={resetQuery}
        >
          <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 group-hover:text-stone-600 transition-colors">
            Trade Assist
          </span>
        </div>
        <nav className="hidden sm:flex items-center gap-10 font-serif text-md text-stone-500">
          <button className="hover:text-stone-900 cursor-pointer transition-colors">Methodology</button>
          <button className="hover:text-stone-900 cursor-pointer transition-colors">History</button>
          <button className="hover:text-stone-900 cursor-pointer transition-colors">Settings</button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full max-w-6xl mx-auto px-6 md:px-12 lg:px-20 overflow-hidden relative mt-8 md:mt-12">

        
        {/* Dynamic scrollable area for content */}
        <div className="flex-1 flex flex-col items-center overflow-y-auto no-scrollbar w-full pt-16 pb-32 space-y-12">
          {!submittedQuestion && !isPending && (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center mt-10 space-y-6">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-900 leading-tight max-w-3xl">
                Institutional-grade <br /> market analysis.
              </h1>
              <p className="font-serif text-xl text-stone-500 max-w-2xl">
                Define your parameters and let our models synthesize historical data, volatility trends, and risk metrics.
              </p>
            </div>
          )}

          <AnswerDisplay 
            question={submittedQuestion} 
            answer={answer} 
          />
        </div>

        {/* Floating Input Area at Bottom */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-stone-50 via-stone-50 to-transparent pt-12 pb-8 px-6 md:px-12 lg:px-20 flex justify-center">
          <div className="w-full max-w-2xl">
            <QueryInput 
            onSend={submitQuery} 
            isPending={isPending} 
            />
          </div>
        </div>
      </main>
      <div className="absolute bottom-5 right-5 text-[10px] text-stone-300 font-sans tracking-widest uppercase">
            Built By - Pranav Udiwal
          </div>
    </div>
    </div>
  );
}
