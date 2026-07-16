export type ConciergeMessage = { role: "user" | "assistant"; content: string };

export const conciergeSystemPrompt = `You are Luminix AI Concierge, the virtual design concierge for Luminix Shades, a premium architectural window-treatment company serving Miami and South Florida.

Reply in the language used by the visitor. Be concise, polished, helpful, and conversational. Use short paragraphs. Never use emojis or casual slang. Do not pretend to be a human employee.

Help visitors understand and choose among:
- Smart Film: switchable privacy glass; transparent when powered on and frosted/private when powered off; appropriate for glass partitions, conference rooms, offices, bathrooms, bedrooms, and modern residential or commercial interiors. Never describe it as full blackout.
- Motorized Roller Shades: light control, privacy, heat management, and automation; blackout, screen, and translucent fabrics; suitable for bedrooms, living rooms, offices, media rooms, and commercial spaces. Smart-home integration depends on selected hardware and must be confirmed.
- Custom Drapery: tailored sheer, linen, silk, velvet, or blackout materials for softness, elegance, acoustics, privacy, and layered design; can be paired with roller shades.
- Commercial applications: offices, conference rooms, hospitality, restaurants, retail, medical spaces, executive offices, open workspaces, and glass partitions.
- Residential applications: bedrooms, living rooms, home offices, nurseries, media rooms, and contemporary luxury residences.

Ask only one focused qualification question when more context would improve the recommendation. Useful context includes residential or commercial, room or space, main priority, South Florida location, and whether they are considering film, shades, drapery, or still deciding. Explain why a recommendation fits.

Never invent prices, discounts, availability, warranties, lead times, installation dates, or technical compatibility. Never guarantee electrical, structural, architectural, code-compliance, or product-fit details. When measurements, material selection, site conditions, wiring, integration, or scope matter, say: "A Luminix specialist can confirm that detail after reviewing your space and project requirements."

Help first. Offer the project consultation form when the visitor asks for a quote or appointment, shows clear intent, or has enough project context. Recommend WhatsApp when human assistance is more appropriate. Never say a consultation is booked unless the visitor completes the booking flow. Keep the brand name exactly as "Luminix Shades."`;

const includesAny = (value: string, terms: string[]) => terms.some((term) => value.includes(term));

export function conciergeFallbackReply(message: string) {
  const text = message.toLocaleLowerCase();
  const spanish = /[¿¡áéíóúñ]|\b(quiero|necesito|cómo|como|cotización|precio|cortina|persiana|película|proyecto|casa|oficina)\b/i.test(message);

  if (includesAny(text, ["schedule", "consultation", "appointment", "book", "cita", "consulta", "agendar", "reservar"])) {
    return spanish
      ? "Puedes iniciar una consulta desde el botón “Start Your Project”. Allí podrás compartir el tipo de espacio, la solución que te interesa y los detalles básicos del proyecto. Un especialista de Luminix Shades revisará la información antes de confirmar los próximos pasos."
      : "You can start a consultation through the “Start Your Project” button. There you can share your space type, preferred solution, and basic project details. A Luminix Shades specialist will review the information before confirming the next steps.";
  }

  if (includesAny(text, ["price", "pricing", "cost", "quote", "estimate", "precio", "costo", "cotización", "cotizacion", "presupuesto", "cuánto", "cuanto", "cuesta", "valor"])) {
    return spanish
      ? "El precio depende de las medidas, el material, el sistema seleccionado, la instalación y las condiciones del espacio. Luminix Shades prepara cada propuesta según el proyecto. ¿Buscas Smart Film, cortinas motorizadas o drapería personalizada?"
      : "Pricing depends on measurements, material, selected hardware, installation, and site conditions. Luminix Shades prepares each proposal for the specific project. Are you considering Smart Film, Motorized Shades, or Custom Drapery?";
  }

  if (includesAny(text, ["smart film", "privacy film", "switchable", "película", "pelicula", "vidrio inteligente"])) {
    return spanish
      ? "Smart Film transforma el vidrio entre transparente y esmerilado para ofrecer privacidad inmediata. Es ideal para divisiones de oficinas, salas de conferencia, baños, dormitorios y espacios modernos; no funciona como blackout total. ¿Es para un proyecto residencial o comercial?"
      : "Smart Film changes glass from transparent to frosted for instant privacy. It works well for office partitions, conference rooms, bathrooms, bedrooms, and modern interiors; it is not a full blackout solution. Is your project residential or commercial?";
  }

  if (includesAny(text, ["drapery", "draperies", "curtain", "cortina", "drapería", "draperia", "sheer", "linen", "velvet"])) {
    return spanish
      ? "La drapería personalizada aporta suavidad, elegancia, privacidad y mejor control acústico. Podemos trabajar con telas sheer, lino, seda, velvet o blackout, y combinarla con roller shades para un diseño en capas. ¿En qué habitación o espacio deseas instalarla?"
      : "Custom Drapery adds softness, elegance, privacy, and acoustic comfort. It can be tailored in sheer, linen, silk, velvet, or blackout materials and layered with roller shades. Which room or space are you planning to furnish?";
  }

  if (includesAny(text, ["motorized", "roller shade", "roller shades", "shade", "shades", "persiana", "motorizada", "motorizado", "blackout", "screen fabric"])) {
    return spanish
      ? "Las cortinas roller motorizadas ofrecen control de luz, privacidad, manejo del calor y automatización. Hay telas blackout, screen y translúcidas; la integración con sistemas inteligentes depende del hardware seleccionado. ¿Cuál es tu prioridad principal: privacidad, oscuridad, control solar o automatización?"
      : "Motorized Roller Shades provide light control, privacy, heat management, and automation. Blackout, screen, and translucent fabrics are available; smart-home compatibility depends on the selected hardware. Is your main priority privacy, room darkening, solar control, or automation?";
  }

  if (includesAny(text, ["commercial", "office", "restaurant", "hotel", "retail", "medical", "comercial", "oficina", "restaurante", "hotel", "tienda", "médico", "medico"])) {
    return spanish
      ? "Para espacios comerciales, Luminix Shades puede combinar Smart Film, cortinas motorizadas y drapería según las necesidades de privacidad, luz, imagen y operación. Trabajamos con oficinas, hospitality, restaurantes, retail y espacios médicos. ¿Qué tipo de espacio estás planificando?"
      : "For commercial spaces, Luminix Shades can combine Smart Film, Motorized Shades, and Drapery around privacy, daylight, design, and operational needs. Applications include offices, hospitality, restaurants, retail, and medical spaces. What type of space are you planning?";
  }

  if (includesAny(text, ["automation", "smart home", "alexa", "control4", "lutron", "automatización", "automatizacion", "casa inteligente"])) {
    return spanish
      ? "Podemos considerar automatización y control inteligente para las cortinas motorizadas. La compatibilidad exacta depende del motor, el sistema de control y la infraestructura del proyecto. Un especialista de Luminix puede confirmarla después de revisar tu espacio y requisitos. ¿Qué sistema utilizas actualmente?"
      : "Automation and smart control can be considered for motorized shades. Exact compatibility depends on the motor, control platform, and project infrastructure. A Luminix specialist can confirm it after reviewing your space and requirements. Which system do you currently use?";
  }

  return spanish
    ? "Luminix Shades diseña soluciones de Smart Film, cortinas roller motorizadas y drapería personalizada para espacios residenciales y comerciales en el sur de Florida. Cuéntame qué espacio deseas mejorar y si tu prioridad es privacidad, control de luz, automatización o estética."
    : "Luminix Shades designs Smart Film, Motorized Roller Shades, and Custom Drapery solutions for residential and commercial spaces across South Florida. Tell me which space you want to improve and whether your priority is privacy, light control, automation, or design.";
}
