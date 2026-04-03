import { BackButton } from "@/components/BackButton";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full">
        <div className="mb-6">
          <BackButton />
        </div>
        <div className="glass-card p-8 space-y-6">
          <h1 className="text-3xl font-bold gradient-text">Contact Us</h1>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground/70">Email</p>
                <p className="text-foreground font-medium">stayfinder@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground/70">Phone</p>
                <p className="text-foreground font-medium">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground/70">Location</p>
                <p className="text-foreground font-medium">Chennai, India</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground/70 pt-4 border-t border-border">
            Feel free to contact us for any queries or support.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
