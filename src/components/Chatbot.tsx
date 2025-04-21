
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Message = {
  role: "user" | "bot";
  content: string;
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hello! How can I help you today with AIRCARGO?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate a delay before the bot responds
    setTimeout(() => {
      const botResponse = getBotResponse(input.trim());
      setMessages(prev => [...prev, { role: "bot", content: botResponse }]);
      setIsTyping(false);
    }, 1000);
  };

  const getBotResponse = (query: string): string => {
    // Convert query to lowercase for easier matching
    const q = query.toLowerCase();

    // Match common questions and provide appropriate responses
    if (q.includes("how can i proceed") || q.includes("how to use") || q.includes("how do i start")) {
      return "You can start by selecting either the Airline Portal or Cargo Portal on our homepage. After logging in, you'll be able to view schedules, book tickets, or track shipments depending on your needs.";
    } 
    else if (q.includes("what does this platform offer") || q.includes("what can i do here") || q.includes("features")) {
      return "AIRCARGO offers comprehensive airline and cargo logistics management. You can view real-time flight schedules, book airline tickets, track cargo shipments, and manage your bookings. Our platform connects airlines, cargo companies, and customers in one seamless interface.";
    }
    else if (q.includes("book") && q.includes("ticket")) {
      return "To book a ticket, navigate to the Airline Portal, browse the available flights, select your preferred flight, and click the 'Book' button. Fill in the required details and complete the payment process to confirm your booking.";
    }
    else if (q.includes("track") && (q.includes("cargo") || q.includes("shipment"))) {
      return "To track your cargo, go to the Cargo Portal and enter your tracking number in the search bar. You can also view all shipments and filter them based on various criteria such as company, cargo type, and date.";
    }
    else if (q.includes("manage") && q.includes("booking")) {
      return "You can manage your bookings by logging in and navigating to the 'Manage Bookings' page. There, you'll see all your current bookings and options to view details, modify, or cancel them.";
    }
    else if (q.includes("refund") || q.includes("cancel")) {
      return "Refunds typically process within 5-7 business days after cancellation is confirmed. The exact timing may depend on your payment method and financial institution. You can cancel a booking from the 'Manage Bookings' page.";
    }
    else if (q.includes("login") || q.includes("sign in")) {
      return "You can log in by clicking the 'Login' button in the navigation bar. We support email/password authentication and Google login for your convenience.";
    }
    else if (q.includes("admin") || q.includes("schedule management")) {
      return "Admin users can access the schedule management system after logging in. This allows you to add, modify, or remove flight and cargo schedules. The system is only accessible to authenticated admin users.";
    }
    else if (q.includes("contact") || q.includes("support") || q.includes("help")) {
      return "For additional support, you can reach our customer service team at support@aircargo.com or call our 24/7 helpline at +1-800-AIRCARGO.";
    }
    else if (q.includes("thank")) {
      return "You're welcome! Is there anything else I can help you with regarding AIRCARGO?";
    }
    else if (q.includes("hi") || q.includes("hello")) {
      return "Hello! Welcome to AIRCARGO. How can I assist you today?";
    }
    else {
      return "I'm not sure I understand your question. Could you please rephrase or ask about specific features like booking tickets, tracking cargo, managing bookings, or using our platform?";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-80 h-96 shadow-xl animate-fade-in">
          <CardHeader className="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]">
            <CardTitle className="text-white flex justify-between items-center">
              <span>AIRCARGO Assistant</span>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:text-primary-foreground">
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex flex-col h-[calc(100%-4rem)]">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white"
                        : "bg-muted"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-muted">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '200ms'}}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '400ms'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#9b87f5]"
              />
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] hover:opacity-90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] hover:opacity-90 transition-all duration-300 hover:shadow-xl hover:scale-105"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}
    </div>
  );
};

export default Chatbot;
