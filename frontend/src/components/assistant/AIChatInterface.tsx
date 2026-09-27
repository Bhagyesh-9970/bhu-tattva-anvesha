import React, { useState } from 'react';
import { Bot, Send, ShieldCheck, Database, FileText, CheckCircle2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  evidence?: any[];
  confidence?: number;
  sources?: string[];
}

export const AIChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'Welcome to the BHŪ-TATTVA-ANVEṢA Decision Support Assistant. Ask any question regarding soil moisture, vegetation health, sensor fusion, climate scenarios, or data provenance in the Kabini Sub-basin.',
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const sampleQuestions = [
    'What is the soil moisture in this area?',
    'What sensors contributed to this estimate?',
    'What happens if rainfall decreases by 20%?',
    'What is the capital of Mars?'
  ];

  const handleSend = async (questionText: string) => {
    if (!questionText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: questionText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: questionText, watershed_id: 1 }),
      });
      const data = await res.json();

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.answer,
        evidence: data.supporting_evidence,
        confidence: data.confidence_score,
        sources: data.provenance?.grounded_sources,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: 'I do not have sufficient evidence to answer this from the available data.',
          confidence: 0,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-scientific-900 border border-scientific-800 rounded-lg p-5 shadow-sm space-y-4 flex flex-col h-[650px]">
      <div className="flex items-center justify-between border-b border-scientific-800 pb-3">
        <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
          <Bot className="w-4 h-4 text-emerald-400" />
          <span>Evidence-Grounded Environmental AI Decision Assistant</span>
        </h2>
        <span className="text-xs font-mono px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded border border-emerald-800/60">
          GROUNDED RAG ACTIVE
        </span>
      </div>

      {/* Preset Question Chips */}
      <div className="flex flex-wrap gap-2 text-xs">
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1 bg-scientific-950 hover:bg-scientific-800 border border-scientific-800 text-scientific-300 rounded-full text-[11px] transition-colors"
          >
            "{q}"
          </button>
        ))}
      </div>

      {/* Chat History Panel */}
      <div className="flex-1 overflow-y-auto space-y-4 p-3 bg-scientific-950 rounded-lg border border-scientific-800">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-2xl p-3.5 rounded-lg text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-emerald-700 text-white font-medium'
                  : 'bg-scientific-900 border border-scientific-800 text-scientific-100 space-y-3'
              }`}
            >
              <p>{msg.text}</p>

              {/* Supporting Evidence Card */}
              {msg.evidence && msg.evidence.length > 0 && (
                <div className="p-3 bg-scientific-950 rounded border border-scientific-800 font-mono text-[11px] space-y-1.5">
                  <div className="text-scientific-400 font-sans font-semibold text-[10px] uppercase flex items-center space-x-1">
                    <FileText className="w-3 h-3 text-cyan-400" />
                    <span>Supporting Evidence & Grounded Telemetry</span>
                  </div>
                  {msg.evidence.map((ev, idx) => (
                    <div key={idx} className="flex justify-between text-scientific-300">
                      <span>{ev.source}:</span>
                      <span className="text-emerald-400 font-bold">{ev.fused_value || ev.value || ev.relation || 'OK'}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Sources & Confidence Pill */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="flex items-center justify-between text-[10px] font-mono text-scientific-400 pt-1 border-t border-scientific-800">
                  <div className="flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Sources: {msg.sources.join(', ')}</span>
                  </div>
                  {msg.confidence !== undefined && (
                    <span className="text-emerald-400 font-bold">Conf: {(msg.confidence * 100).toFixed(0)}%</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-xs font-mono text-cyan-400 animate-pulse">
            Retrieving evidence context & evaluating RAG response...
          </div>
        )}
      </div>

      {/* Input Field */}
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Ask a question about the Kabini watershed environment..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(inputQuery)}
          className="flex-1 bg-scientific-950 border border-scientific-800 rounded px-4 py-2.5 text-xs text-white placeholder-scientific-400 focus:outline-none focus:border-cyan-500"
        />
        <button
          onClick={() => handleSend(inputQuery)}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center space-x-1.5 transition-colors"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
