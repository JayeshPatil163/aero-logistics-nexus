import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/ui/navbar";
import { Plane, Truck, ArrowRight } from "lucide-react";

const Index = () => {
  const [textIndex, setTextIndex] = useState(0);
  const [isTextChanging, setIsTextChanging] = useState(false);
  const dynamicTexts = [
    "Global Logistics Solutions",
    "Real-Time Flight Tracking",
    "Efficient Cargo Management",
    "Seamless Transportation"
  ];
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTextChanging(true);
      setTimeout(() => {
        setTextIndex((prevIndex) => (prevIndex + 1) % dynamicTexts.length);
        setIsTextChanging(false);
      }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-gradient-to-r from-primary via-accent to-primary bg-size-200 bg-pos-0 hover:bg-pos-100 text-transparent bg-clip-text transition-all duration-500">
                    AIRCARGO
                  </h1>
                  <div className="h-12 md:h-16">
                    <p 
                      key={textIndex}
                      className={`text-xl text-accent font-semibold transition-all duration-1000 ${
                        isTextChanging ? "opacity-0 transform -translate-y-2" : "opacity-100 transform translate-y-0"
                      }`}
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
                    className="group relative overflow-hidden bg-white hover:bg-gradient-to-r hover:from-primary hover:to-accent text-primary hover:text-white transition-all duration-500 shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0 [&:not(:hover)+button:hover]:bg-white [&:not(:hover)+button:hover]:text-primary" 
                    onClick={() => navigate("/airline")}
                  >
                    <span className="relative z-10 flex items-center">
                      <Plane className="h-5 w-5 mr-2 transition-transform group-hover:translate-x-1 duration-300" />
                      Airline Portal
                      <ArrowRight className="h-4 w-4 ml-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </span>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="group relative overflow-hidden bg-white hover:bg-gradient-to-r hover:from-primary hover:to-accent text-primary hover:text-white transition-all duration-500 shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0 [&:not(:hover)+button:hover]:bg-white [&:not(:hover)+button:hover]:text-primary" 
                    onClick={() => navigate("/cargo")}
                  >
                    <span className="relative z-10 flex items-center">
                      <Truck className="h-5 w-5 mr-2 transition-transform group-hover:translate-x-1 duration-300" />
                      Cargo Portal
                      <ArrowRight className="h-4 w-4 ml-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </span>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative aspect-video overflow-hidden rounded-xl sm:w-full lg:order-last lg:rounded-3xl">
                  <div className="bg-gradient-to-b from-accent to-accent/70 p-6 rounded-3xl flex items-center justify-center animate-float shadow-lg hover:shadow-xl transition-all duration-2000 transform hover:-translate-y-2">
                    <div className="grid grid-cols-2 gap-4 w-full h-full text-white">
                      <div className="flex flex-col space-y-2 p-4 bg-black/20 rounded-xl hover:bg-black/30 transition-all duration-300 transform hover:scale-[1.02]">
                        <div className="text-sm font-bold">Popular Airlines</div>
                        <div className="text-xs opacity-75 animate-pulse-soft">
                          <div>• Emirates</div>
                          <div>• Lufthansa</div>
                          <div>• Qatar Airways</div>
                          <div>• Singapore Airlines</div>
                        </div>
                        <div className="mt-auto">
                          <div className="text-xs bg-white/10 p-1 rounded text-center animate-matrix-rain hover:bg-white/20 transition-all duration-300">
                            Real-time updates
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 p-4 bg-black/20 rounded-xl hover:bg-black/30 transition-all duration-300 transform hover:scale-[1.02]">
                        <div className="text-sm font-bold">Cargo Partners</div>
                        <div className="text-xs opacity-75 animate-pulse-soft">
                          <div>• DHL</div>
                          <div>• FedEx</div>
                          <div>• UPS</div>
                          <div>• Maersk</div>
                        </div>
                        <div className="mt-auto">
                          <div className="text-xs bg-white/10 p-1 rounded text-center animate-matrix-rain hover:bg-white/20 transition-all duration-300">
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

        <section className="bg-secondary/50 py-16">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Key Platform Features</h2>
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
                  className="group border bg-card rounded-lg p-6 hover:shadow-md transition-all duration-300 animate-fade-in opacity-0 hover:bg-gradient-to-br hover:from-background hover:to-secondary/30 transform hover:-translate-y-1"
                  style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'forwards' }}
                >
                  <h3 className="text-lg font-medium mb-2 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                  <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-6 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex items-center gap-1">
              <Plane className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium">AIRCARGO</p>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2025 AIRCARGO. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
