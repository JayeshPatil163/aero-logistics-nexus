
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([
      ...messages,
      { role: "user", content: input },
      { role: "bot", content: "Thank you for your message. This is a demo response." }
    ]);
    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-80 h-96 shadow-xl animate-fade-in">
          <CardHeader className="bg-gradient-to-r from-primary to-accent">
            <CardTitle className="text-white flex justify-between items-center">
              <span>Chat Assistant</span>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:text-primary">
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex flex-col h-[calc(100%-4rem)]">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-primary text-white"
                        : "bg-muted"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit">Send</Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg animate-bounce hover:animate-none"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default Chatbot;
