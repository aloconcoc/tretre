"use client";

import { useState, useRef, useEffect, Fragment } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useAuth } from "@/context/auth-context";
import { useSellerChat } from "@/hooks/use-seller-chat";

type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
};

// Renders text containing Markdown-style [label](url) links as clickable
// Next.js Links, leaving everything else as plain text.
function MessageText({ text }: { text: string }) {
  const linkPattern = /\[([^\]]+)\]\((\/[^\s)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = linkPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<Fragment key={key++}>{text.slice(lastIndex, match.index)}</Fragment>);
    }
    parts.push(
      <Link key={key++} href={match[2]} className="font-semibold text-comay-green underline underline-offset-2">
        {match[1]}
      </Link>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(<Fragment key={key++}>{text.slice(lastIndex)}</Fragment>);
  }

  return <p className="whitespace-pre-wrap">{parts}</p>;
}

function AiTab() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Xin chào! Tôi là trợ lý ảo AI của TRETRE. Tôi có thể giúp gì cho bạn hôm nay?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInputValue("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });
      const data = await res.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: res.ok ? data.reply : (data.error ?? "Xin lỗi, trợ lý đang gặp sự cố. Vui lòng thử lại sau."),
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "Xin lỗi, không thể kết nối trợ lý lúc này. Vui lòng thử lại sau.",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <div
        ref={messagesContainerRef}
        className="h-[360px] overflow-y-auto bg-[var(--color-comay-cream-light)] p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                msg.sender === "user"
                  ? "bg-[var(--color-comay-green)] text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
              }`}
            >
              <MessageText text={msg.text} />
              <p className={`mt-1 text-[10px] ${msg.sender === "user" ? "text-white/70" : "text-gray-400"}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm">
              <div className="flex space-x-1">
                <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 bg-white p-3">
        <div className="flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2 border border-gray-200 focus-within:border-[var(--color-comay-green)] focus-within:ring-1 focus-within:ring-[var(--color-comay-green)]/20 transition-all">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Nhập tin nhắn..."
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              inputValue.trim()
                ? "bg-[var(--color-comay-green)] text-white hover:bg-[#27452b]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Icon icon="mingcute:send-fill" className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 text-center text-[10px] text-gray-400">Powered by TRETRE Intelligence</div>
      </div>
    </>
  );
}

function SellerTab() {
  const { user } = useAuth();
  const { messages, isLoading, sendMessage, isReady } = useSellerChat();
  const [inputValue, setInputValue] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  if (!user) {
    return (
      <div className="h-[360px] flex flex-col items-center justify-center gap-3 bg-[var(--color-comay-cream-light)] p-6 text-center">
        <Icon icon="solar:chat-round-line-linear" className="h-10 w-10 text-gray-300" />
        <p className="text-sm text-gray-500">Đăng nhập để nhắn tin trực tiếp với người bán.</p>
        <Link
          href="/login"
          className="text-sm font-semibold text-white bg-[var(--color-comay-green)] px-5 py-2 rounded-full hover:opacity-90 transition-opacity"
        >
          Đăng nhập
        </Link>
      </div>
    );
  }

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  return (
    <>
      <div
        ref={messagesContainerRef}
        className="h-[360px] overflow-y-auto bg-[var(--color-comay-cream-light)] p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      >
        {isLoading ? (
          <div className="text-center text-sm text-gray-400 pt-8">Đang tải...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-sm text-gray-400 pt-8">
            Gửi tin nhắn cho TRETRE, chúng tôi sẽ phản hồi sớm nhất có thể!
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender_role === "customer" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                  msg.sender_role === "customer"
                    ? "bg-[var(--color-comay-green)] text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.body}</p>
                <p className={`mt-1 text-[10px] ${msg.sender_role === "customer" ? "text-white/70" : "text-gray-400"}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-gray-100 bg-white p-3">
        <div className="flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2 border border-gray-200 focus-within:border-[var(--color-comay-green)] focus-within:ring-1 focus-within:ring-[var(--color-comay-green)]/20 transition-all">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={!isReady}
            placeholder="Nhập tin nhắn cho người bán..."
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none disabled:opacity-60"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || !isReady}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              inputValue.trim() && isReady
                ? "bg-[var(--color-comay-green)] text-white hover:bg-[#27452b]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Icon icon="mingcute:send-fill" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"ai" | "seller">("ai");

  useEffect(() => {
    const openSellerChat = () => {
      setActiveTab("seller");
      setIsOpen(true);
    };
    window.addEventListener("open-seller-chat", openSellerChat);
    return () => window.removeEventListener("open-seller-chat", openSellerChat);
  }, []);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none ${
          isOpen ? "scale-0 opacity-0 pointer-events-none" : "bg-[var(--color-comay-green)] scale-100 opacity-100"
        }`}
        aria-label="Chat with AI"
      >
        <Icon icon={isOpen ? "mingcute:close-line" : "mingcute:chat-4-fill"} className="h-8 w-8 text-white" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-40 w-full max-w-[360px] transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 origin-bottom-right border border-gray-100 ${
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="bg-[var(--color-comay-green)] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm">
                <Icon icon={activeTab === "ai" ? "mingcute:ai-fill" : "mingcute:user-4-fill"} className="h-6 w-6 text-white" />
              </div>
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-[var(--color-comay-green)]"></span>
            </div>
            <div>
              <h3 className="font-semibold text-lg leading-tight">CSKH TRETRE</h3>
              <p className="text-xs text-white/80 flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></span>
                Đang hoạt động
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <Icon icon="mingcute:close-line" className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-white">
          <button
            onClick={() => setActiveTab("ai")}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors relative ${
              activeTab === "ai" ? "text-comay-green" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Trợ Lý AI
            {activeTab === "ai" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-comay-green" />}
          </button>
          <button
            onClick={() => setActiveTab("seller")}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors relative ${
              activeTab === "seller" ? "text-comay-green" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Chat Người Bán
            {activeTab === "seller" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-comay-green" />}
          </button>
        </div>

        {activeTab === "ai" ? <AiTab /> : <SellerTab />}
      </div>
    </>
  );
}
