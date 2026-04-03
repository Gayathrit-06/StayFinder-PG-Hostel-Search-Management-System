import { BackButton } from "@/components/BackButton";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Search, Eye, CalendarCheck, Building2, ClipboardList } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full">
        <div className="mb-6">
          <BackButton />
        </div>
        <div className="glass-card p-8 space-y-6">
          <h1 className="text-3xl font-bold gradient-text">About StayFinder</h1>
          <p className="text-muted-foreground leading-relaxed">
            StayFinder is a smart PG and hostel searching platform designed to help students and professionals find the best accommodation easily.
          </p>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">Our platform allows users to:</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-muted-foreground">
                <Search className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                Search hostels based on location, gender, and budget
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <Eye className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                View detailed facilities like food, WiFi, AC, laundry
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <CalendarCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                Book rooms easily with approval system
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">For owners:</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-muted-foreground">
                <Building2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                Add and manage hostels
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <ClipboardList className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                View and manage booking requests
              </li>
            </ul>
          </div>

          <p className="text-muted-foreground italic border-l-4 border-primary pl-4">
            Our goal is to make hostel searching simple, fast, and reliable.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
