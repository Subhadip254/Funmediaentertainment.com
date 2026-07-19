import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Sparkles } from "lucide-react";

type Message = {
  sender: "user" | "bot";
  text: string;
  time: string;
};

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! I am the Fun Media AI Assistant. How can I help you explore our creative animation studio today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsgText = input.trim();
    const userMsg: Message = {
      sender: "user",
      text: userMsgText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulated network delay for AI thinking
    setTimeout(() => {
      let botResponseText = "";
      const text = userMsgText.toLowerCase();

      if (text.includes("ceo") || text.includes("founder") || text.includes("subhadip")) {
        botResponseText = "Subhadip Bera is the CEO & Founder of Fun Media Entertainment. Under his leadership, we create imaginative worlds and animations. You can view his full biography in the Crew section!";
      } else if (text.includes("crew") || text.includes("team") || text.includes("members")) {
        botResponseText = "Our core team consists of Subhadip Bera (CEO & Founder), Sagar Das (Co-Founder & Technical Director), Lipika Gayen (HR Executive), and Sujit Sasmal (Web Developer). We also have a brilliant roster of 3D Modelers, Riggers, Animators, and Texture Artists!";
      } else if (text.includes("service") || text.includes("offer") || text.includes("what do you do")) {
        botResponseText = "We specialize in professional 3D Modeling, Texturing, 3D & 2D Animation, Rigging, and Product Lighting & Rendering. You can check out all details on our Services page.";
      } else if (text.includes("contact") || text.includes("email") || text.includes("phone") || text.includes("reach")) {
        botResponseText = "You can reach us directly at contact@funmediaentertainment.com, or submit a message on our Contact page. For specific crew members, check their profile page for their LinkedIn link!";
      } else if (text.includes("hiring") || text.includes("career") || text.includes("job") || text.includes("join")) {
        botResponseText = "We are always on the lookout for creative talent! While we don't have immediate openings, you can submit your details and portfolio link directly via our Careers page.";
      } else if (text.includes("investor") || text.includes("partner") || text.includes("aarav")) {
        botResponseText = "Aarav Mehta is our Venture Partner and Investor, helping us scale our pipelines and creative technologies.";
      } else if (text.includes("portfolio") || text.includes("work") || text.includes("showcase") || text.includes("project")) {
        botResponseText = "You can explore our showcase on the Portfolio page, or view specific artist works directly on their profile pages (e.g. Neha Sharma, Rohan Verma, and other artists in our Crew section).";
      } else if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
        botResponseText = "Hello! Hope you're having a wonderful day. Ask me anything about Fun Media Entertainment's services, team, or portfolios!";
      } else {
        botResponseText = "That's an interesting question! I am currently in demo mode, but feel free to explore our pages (Services, Portfolio, Crew, Careers) or contact us directly at contact@funmediaentertainment.com for more info.";
      }

      const botMsg: Message = {
        sender: "bot",
        text: botResponseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans">
      {/* ── Chat Window ── */}
      {isOpen && (
        <div className="glass mb-4 flex h-[480px] w-[340px] flex-col rounded-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)] animate-fade-up md:w-[380px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/8 bg-white/3 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="relative rounded-lg bg-primary/10 p-1.5 border border-primary/20">
                <Bot className="h-4 w-4 text-primary" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-background animate-pulse" />
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold text-white leading-tight flex items-center gap-1">
                  Fun Media AI <Sparkles className="h-3 w-3 text-accent" />
                </h3>
                <span className="text-[10px] text-muted-foreground">Virtual Assistant</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col max-w-[85%] ${
                  msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                }`}
              >
                <div
                  className={`rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-primary text-black font-medium rounded-tr-none"
                      : "bg-white/5 border border-white/8 text-white/90 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="mt-1 text-[9px] text-muted-foreground/60 px-1">
                  {msg.time}
                </span>
              </div>
            ))}
            {isTyping && (
              <div className="flex flex-col items-start max-w-[80%]">
                <div className="bg-white/5 border border-white/8 rounded-2xl rounded-tl-none px-3 py-2.5 text-xs text-muted-foreground flex gap-1.5 items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/70 animate-bounce" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="border-t border-white/8 bg-white/2 p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about services, crew, careers..."
              className="flex-1 rounded-xl border border-white/10 bg-background/50 px-3.5 py-2 text-xs text-white placeholder-muted-foreground/60 outline-none focus:border-primary transition-colors"
            />
            <button
              type="submit"
              className="rounded-xl btn-neon p-2 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5 text-black" />
            </button>
          </form>
        </div>
      )}

      {/* ── Floating Launcher Button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI chat assistant"
        className="group relative flex h-12 w-12 items-center justify-center rounded-full btn-neon shadow-[0_0_20px_oklch(0.72_0.18_240/0.45)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
      >
        {/* Pulsing glow ring */}
        <span className="absolute -inset-1 rounded-full bg-primary/20 border border-primary/40 animate-ping opacity-60 pointer-events-none group-hover:animate-none" />
        {isOpen ? (
          <X className="h-5 w-5 text-black" />
        ) : (
          <MessageSquare className="h-5 w-5 text-black fill-current" />
        )}
      </button>
    </div>
  );
}
