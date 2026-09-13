import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

export function useQuery() {
  const [isPending, setIsPending] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [submittedQuestion, setSubmittedQuestion] = useState(null);
  const [conversation, setConversation] = useState([]);

  const submitQuery = useCallback(async (question) => {
    if (!question.trim()) {
      toast.error('Please enter a valid question.');
      return;
    }

    setIsPending(true);
    
    // Only update submittedQuestion if it's the start of a new query
    if (conversation.length === 0) {
      setSubmittedQuestion(question);
    }
    setAnswer(null);

    const newConversation = [...conversation, question];
    setConversation(newConversation);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      const response = await axios.post(`${backendUrl}/api/conversation/experiment`, {
        conversation: newConversation
      });
      
      const data = response.data;
      
      if (data.status === 'error') {
        toast.error(data.message || 'Something went wrong.');
        setConversation(conversation);
      } else if (data.status === 'invalid') {
        setAnswer({
          text: data.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
        toast.error('Invalid query format.');
        setConversation([]); // Clear for next time
      } else if (data.status === 'incomplete') {
        setAnswer({
          text: data.clarifyingQuestion,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
        // Append AI's question so backend has context next time
        setConversation([...newConversation, data.clarifyingQuestion]);
      } else if (data.status === 'complete') {
        const exp = data.experiment;
        const text = `Instrument: ${exp.instrument || 'Any'}\nTimeframe: ${exp.timeframe || 'Any'}\nEntry: ${exp.entryCondition}\nExit: ${exp.exitCondition || 'N/A'}\nHolding Period: ${exp.holdingPeriod || 'N/A'}\nFilters: ${exp.filters?.length ? exp.filters.join(', ') : 'None'}\n\nResearch Question: ${exp.researchQuestion}`;
        
        setAnswer({
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
        toast.success('Analysis complete');
        setConversation([]); // Clear for next time
      }
      
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate response. Please try again.');
      setConversation(conversation); // Revert
    } finally {
      setIsPending(false);
    }
  }, [conversation, answer]);

  const resetQuery = useCallback(() => {
    setAnswer(null);
    setSubmittedQuestion(null);
    setConversation([]);
    setIsPending(false);
  }, []);

  return {
    isPending,
    answer,
    submittedQuestion,
    submitQuery,
    resetQuery
  };
}
