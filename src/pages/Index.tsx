
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/ui/navbar";
import { Plane, Truck } from "lucide-react";

const Index = () => {
  const [textIndex, setTextIndex] = useState(0);
  const dynamicTexts = [
    "Global Logistics Solutions",
    "Real-Time Flight Tracking",
    "Efficient Cargo Management",
    "Seamless Transportation"
  ];
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % dynamicTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Aero Logistics Nexus
                  </h1>
                  <div className="h-12 md:h-16 overflow-hidden">
                    <p 
                      key={textIndex}
                      className="text-xl text-accent font-semibold animate-fade-in opacity-0 animation-delay-[500ms] animation-fill-mode-forwards"
                    >
                      {dynamicTexts[textIndex]}
                    </p>
                  </div>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Your comprehensive platform for airline and cargo logistics management. 
                    Access real-time schedules, track shipments, and manage your travel needs efficiently.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button 
                    size="lg" 
                    className="gap-1 bg-primary text-white hover:bg-primary/90 animate-pulse-soft" 
                    onClick={() => navigate("/airline")}
                  >
                    <Plane className="h-5 w-5 mr-1" />
                    Airline Portal
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="gap-1 animate-pulse-soft" 
                    onClick={() => navigate("/cargo")}
                  >
                    <Truck className="h-5 w-5 mr-1" />
                    Cargo Portal
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative aspect-video overflow-hidden rounded-xl sm:w-full lg:order-last lg:rounded-3xl">
                  <div className="bg-gradient-to-b from-accent to-accent/70 p-6 rounded-3xl flex items-center justify-center animate-float shadow-lg">
                    <div className="grid grid-cols-2 gap-4 w-full h-full text-white">
                      <div className="flex flex-col space-y-2 p-4 bg-black/20 rounded-xl">
                        <div className="text-sm font-bold">Popular Airlines</div>
                        <div className="text-xs opacity-75 animate-pulse-soft">
                          <div>• Emirates</div>
                          <div>• Lufthansa</div>
                          <div>• Qatar Airways</div>
                          <div>• Singapore Airlines</div>
                        </div>
                        <div className="mt-auto">
                          <div className="text-xs bg-white/10 p-1 rounded text-center animate-matrix-rain">
                            Real-time updates
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 p-4 bg-black/20 rounded-xl">
                        <div className="text-sm font-bold">Cargo Partners</div>
                        <div className="text-xs opacity-75 animate-pulse-soft">
                          <div>• DHL</div>
                          <div>• FedEx</div>
                          <div>• UPS</div>
                          <div>• Maersk</div>
                        </div>
                        <div className="mt-auto">
                          <div className="text-xs bg-white/10 p-1 rounded text-center animate-matrix-rain">
                            Global tracking
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-secondary/50 py-16">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight">Key Platform Features</h2>
              <p className="text-muted-foreground mt-2">
                Everything you need to manage airline and cargo logistics
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { 
                  title: "Real-time Schedules", 
                  desc: "Access up-to-date information on flights and cargo shipments" 
                },
                { 
                  title: "Booking Management", 
                  desc: "Simple and efficient booking process for airline tickets" 
                },
                { 
                  title: "Cargo Tracking", 
                  desc: "Track your cargo shipments across the global logistics network" 
                },
                { 
                  title: "Admin Controls", 
                  desc: "Comprehensive tools for administrators to manage schedules" 
                },
                { 
                  title: "Dynamic Filtering", 
                  desc: "Find exactly what you need with powerful filtering options" 
                },
                { 
                  title: "Secure Access", 
                  desc: "Role-based authentication ensures data security" 
                }
              ].map((feature, i) => (
                <div 
                  key={i} 
                  className="border bg-card rounded-lg p-6 hover:shadow-md transition-all duration-300 animate-fade-in opacity-0"
                  style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'forwards' }}
                >
                  <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-muted py-6 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex items-center gap-1">
              <Plane className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium">Aero Logistics Nexus</p>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2025 Aero Logistics Nexus. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
