import { Phone } from 'lucide-react';
import './FloatingWhatsApp.css';

export default function FloatingWhatsApp() {
  const waNumber = import.meta.env.VITE_WA_NUMBER || '6281394373007';
  const waLink = `https://wa.me/${waNumber}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-wa"
      aria-label="Chat WhatsApp"
    >
      <Phone size={28} />
      <span className="floating-wa-text">Chat Kami</span>
    </a>
  );
}
