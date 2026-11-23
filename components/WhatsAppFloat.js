import { site } from "@/data/site";
import { WhatsAppIcon } from "./Icons";

export default function WhatsAppFloat() {
  const text = encodeURIComponent(`Hello ${site.shortName}, I would like a quote for your chemicals.`);
  return (
    <a
      href={`https://wa.me/${site.whatsapp}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition hover:scale-105"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
