'use client';
import { useState, useRef, useEffect } from 'react';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { useAuthStore } from '@/lib/store';
import { Send, Bot, User, Code2, Zap, BookOpen, GitBranch } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_ACTIONS = [
  { icon: <Code2 size={14} />, label: 'Debug Code' },
  { icon: <BookOpen size={14} />, label: 'Explain Concepts' },
  { icon: <GitBranch size={14} />, label: 'Review Project' },
  { icon: <Zap size={14} />, label: 'Career Strategy' },
];

const SYSTEM_PROMPT = `You are an expert AI coding mentor for FutureLearn Academy, a premium developer education platform. 
You help students with programming questions, debugging, architecture decisions, and career advice.
Be concise, technical, and encouraging. Format code with proper markdown code blocks.
You specialize in: React, Next.js, Node.js, NestJS, PostgreSQL, TypeScript, System Design, and Software Architecture.`;

export default function AIAssistantPage() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: `Hey ${user?.fullName?.split(' ')[0] ?? 'there'}! 👋 I'm your AI coding mentor. I can help you debug code, explain concepts, review your projects, or discuss career strategy. What are you working on today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = text ?? input.trim();
    if (!content || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: history,
        }),
      });

      const data = await res.json();
      const reply = data.content?.[0]?.text ?? "I couldn't generate a response. Please try again.";

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'assistant', content: reply, timestamp: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role="student" />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-border px-8 py-4 flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
            <Bot size={20} />
          </div>
          <div>
            <h1 className="font-bold text-sm">AI Coding Mentor</h1>
            <div className="flex items-center gap-1.5 text-xs text-accent-green">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
              Online · GPT-4 Active
            </div>
          </div>
          <div className="ml-auto">
            <div className="badge badge-purple text-xs">PRO FEATURE ACTIVE</div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="border-b border-border px-8 py-3 flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-text-muted mr-1">Quick Actions:</span>
          {QUICK_ACTIONS.map((a) => (
            <button
              key={a.label}
              onClick={() => sendMessage(`Help me with: ${a.label}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-text-secondary hover:border-primary/50 hover:text-white transition-all"
            >
              {a.icon} {a.label}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-5 flex-shrink-0">
          <div className="flex items-end gap-3 bg-card border border-border rounded-xl p-3 focus-within:border-primary/50 transition-colors">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything — code, architecture, career..."
              rows={1}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-text-muted resize-none focus:outline-none max-h-32"
              style={{ lineHeight: '1.5' }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send size={15} />
            </button>
          </div>
          <p className="text-xs text-text-muted mt-2 text-center">
            AI Mentor can make mistakes. Review important code carefully.
          </p>
        </div>
      </main>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  // Simple markdown-like rendering for code blocks
  const renderContent = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith('```')) {
        const lines = part.slice(3, -3).split('\n');
        const lang = lines[0];
        const code = lines.slice(1).join('\n');
        return (
          <div key={i} className="my-3 rounded-xl overflow-hidden border border-border">
            <div className="bg-surface px-4 py-2 text-xs text-text-muted font-mono flex items-center justify-between">
              <span>{lang || 'code'}</span>
              <Code2 size={12} />
            </div>
            <pre className="bg-background p-4 text-xs font-mono text-text-secondary overflow-x-auto leading-relaxed">
              {code}
            </pre>
          </div>
        );
      }
      return (
        <span key={i} className="whitespace-pre-wrap">
          {part}
        </span>
      );
    });
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-fade-in`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? 'bg-primary/20 text-primary' : 'bg-accent-blue/20 text-accent-blue'
      }`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-primary text-white rounded-tr-sm'
            : 'bg-card border border-border text-text-secondary rounded-tl-sm'
        }`}>
          {renderContent(message.content)}
        </div>
        <span className="text-xs text-text-muted px-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue flex-shrink-0">
        <Bot size={16} />
      </div>
      <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-text-muted animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
