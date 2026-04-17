import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Copy, Check, Loader2, ArrowRight, Clock, ChevronDown,
  Award, Camera, Smartphone, ZoomIn, Scale, ArrowRightLeft, 
  ThumbsUp, Flame, Network, Key, LayoutGrid, PackageOpen, 
  Hammer, Zap, Sun, FileDown, Trash2
} from 'lucide-react';
import { playClickSound } from './lib/audio';

interface HistoryItem {
  id: string;
  angle: string;
  product: string;
  style: string;
  typography: string;
  prompt: string;
  timestamp: Date;
}

const ANGLES = [
  { id: 'hero', icon: Award, label: 'Hero Image / Glamour Shot', description: 'El producto es la estrella absoluta. Imagina una foto de estudio impecable donde el artículo destaca por sí solo sobre un fondo limpio, captando la atención de inmediato.', type: 'Producto' },
  { id: 'lifestyle_premium', icon: Camera, label: 'Lifestyle Premium', description: 'Mostramos tu producto en un entorno aspiracional y lujoso. Queremos que el usuario se visualice a sí mismo disfrutando de la vida que este producto hace posible.', type: 'Producto' },
  { id: 'ugc_organico', icon: Smartphone, label: 'UGC / Estilo Orgánico', description: 'Es como si un amigo te recomendara el producto por WhatsApp. Foto auténtica, estilo celular, sin poses perfectas. Conecta a nivel humano y genera confianza inmediata.', type: 'Producto' },
  { id: 'macro_sensorial', icon: ZoomIn, label: 'Macro Sensorial', description: 'Un primer plano que invita a tocar. Nos centramos en texturas, gotas, detalles mínimos que despiertan el deseo físico y hacen que el usuario quiera experimentar el producto.', type: 'Producto' },
  { id: 'nosotros_vs_ellos', icon: Scale, label: 'Nosotros vs Ellos', description: 'Jugamos con el contraste total. Mostramos la frustración de usar la competencia frente a la claridad y elegancia de tu solución. Es la mejor forma de demostrar superioridad.', type: 'Ambos' },
  { id: 'antes_despues', icon: ArrowRightLeft, label: 'Antes vs Después (Resultados)', description: 'El argumento definitivo: el resultado visual. Dividimos la imagen para que el contraste entre "el problema" y "la solución" sea innegable y contundente.', type: 'Ambos' },
  { id: 'prueba_social', icon: ThumbsUp, label: 'Prueba Social (Social Proof)', description: '¿Qué dicen los demás? Validamos tu marca mostrando personas reales felices junto a estrellas, reseñas, sellos de autoridad o testimonios que calman cualquier duda.', type: 'Ambos' },
  { id: 'urgencia_escasez', icon: Flame, label: 'Urgencia / FOMO (Flash Sale)', description: 'Activamos el miedo a perderse la oportunidad. Un diseño directo, colores vibrantes y una promesa de tiempo limitado que impulsa al usuario a comprar ya.', type: 'Ambos' },
  { id: 'anatomia_infografia', icon: Network, label: 'Anatomía del Producto', description: 'Explicamos la inteligencia detrás del objeto. Despiezamos el producto para que el usuario entienda los beneficios técnicos de cada parte de forma visual.', type: 'Producto' },
  { id: 'secreto_revelado', icon: Key, label: 'El Secreto / El Hack', description: 'Transformamos tu producto en un "descubrimiento". Es ese ingrediente mágico, el truco que nadie conoce y que soluciona los problemas de nuestros clientes.', type: 'Ambos' },
  { id: 'flatlay_estetico', icon: LayoutGrid, label: 'Flatlay Estético (Vista Cenital)', description: 'Todo está perfectamente orquestado desde arriba. El producto rodeado de sus complementos, creando una atmósfera equilibrada, deseable y muy compartible.', type: 'Producto' },
  { id: 'unboxing_experiencia', icon: PackageOpen, label: 'Experiencia Unboxing', description: 'Revivimos la emoción de abrir un regalo. Perspectiva desde los ojos del usuario, capturando ese momento íntimo y satisfactorio de ver el producto por primera vez.', type: 'Producto' },
  { id: 'detras_escena', icon: Hammer, label: 'Detrás de Escena (Craftsmanship)', description: 'Humanizamos la marca mostrando la artesanía. Un vistazo al taller, a las manos que crean o al proceso de trabajo, transmitiendo calidad y dedicación real.', type: 'Ambos' },
  { id: 'problema_agitado', icon: Zap, label: 'Agitar el Problema', description: 'No vendemos una solución sin antes entender el dolor. Mostramos la frustración de forma dramática para que la aparición de tu producto sea el alivio esperado.', type: 'Ambos' },
  { id: 'climax_alivio', icon: Sun, label: 'Clímax y Alivio', description: 'El momento posterior a la calma. Capturamos la expresión de alivio y felicidad total cuando el problema desaparece, gracias a tu producto.', type: 'Ambos' },
];

const STYLE_PRESETS = [
  { label: 'Cinematográfico', value: 'Cinematic lighting, dramatic shadows, 8k resolution, highly detailed volumetric lighting', description: 'Atmosfera de película de alto presupuesto con contraste dramático.' },
  { label: 'Minimalista', value: 'Minimalist, clean background, negative space, soft studio lighting, Apple style presentation', description: 'Simplicidad máxima y espacios abiertos para un enfoque limpio.' },
  { label: 'Vibrante / Pop', value: 'Vibrant neon colors, highly saturated, vivid, energetic lighting, pop-art infused', description: 'Colores neón y alta saturación para máxima energía.' },
  { label: 'Editorial / Vogue', value: 'Editorial photography, Vogue style, high fashion, softbox lighting, magazine cover aesthetic', description: 'Sofisticación de alta moda con iluminación suave y elegante.' },
  { label: 'Glow Oscuro', value: 'Dark mode ambiance, low-key lighting, subtle rim light highlighting edges, moody', description: 'Ambiente nocturno con iluminación de borde para un estilo misterioso.' },
  { label: 'Aesthetic Natural', value: 'Earthy tones, golden hour sunlight, organic textures, warm atmosphere, linen and wood elements', description: 'Tonos cálidos y naturales propios de la hora dorada.' },
  { label: 'Estudio Brillante', value: 'Bright and airy photo studio, seamless white backdrop, soft diffused flat lighting', description: 'Estilo comercial brillante, perfecto para productos claros.' },
  { label: 'Granular Analógico', value: 'Vintage film camera grain, Kodak Portra 400 aesthetic, nostalgic, slight vignette', description: 'Textura nostálgica de película antigua con grano sutil.' },
  { label: 'Humo y Sombras', value: 'Mysterious atmosphere, heavy fog, silhouetted shapes, cinematic rim lighting', description: 'Atmósfera cinematográfica con niebla y siluetas dramáticas.' },
  { label: 'Arquitectura Brutalista', value: 'Brutalist concrete textures, stark angles, industrial aesthetic, dramatic lighting, high contrast', description: 'Texturas de hormigón crudo y ángulos marcados industriales.' },
  { label: '3D Renderizado Suave', value: 'Soft 3D render, clay texture, pastel colors, isometric view, soft diffused lighting, surreal and playful', description: 'Estilo 3D lúdico con texturas suaves y colores pastel.' },
  { label: 'Sostenible / ECO', value: 'Sustainable eco-friendly aesthetic, lush greenery, natural sunlight, paper textures, warm and inviting atmosphere', description: 'Enfoque orgánico y natural centrado en la sostenibilidad.' },
  { label: 'Bohemio Chic', value: 'Bohemian style, warm natural light, macrame decor, indoor plants, cozy and relaxed atmosphere', description: 'Estilo relajado con elementos naturales y plantas.' },
  { label: 'Soft Glam', value: 'Soft blur effect, dreamy lighting, flattering skin tones, delicate shadows, elegant and romantic', description: 'Look romántico y favorecedor con iluminación suave.' },
  { label: 'Vintage Polaroid', value: 'Faded colors, overexposed highlights, classic white frame aesthetic, nostalgic 90s feel', description: 'Toque nostálgico con la estética clásica de Polaroid.' },
  { label: 'Zen / Japandi', value: 'Japandi style, light wood, clean lines, neutral colors, calm and orderly balance', description: 'Fusión minimalista entre estilo japonés y escandinavo.' },
  { label: 'Noir Contemporáneo', value: 'High contrast black and white, dramatic hard light, classic film noir modern interpretation', description: 'Estilo blanco y negro de alto contraste con toque moderno.' },
  { label: 'Clínico Premium', value: 'Pristine white clinical environment, sterile aesthetic, razor-sharp focus, bright clean softbox lighting, high-end professional healthcare feel', description: 'Estética clínica impecable, limpia y profesional.' },
  { label: 'Gastronómico Gourmet', value: 'Rich deep contrast, moody lighting focused on food textures, warm rim light, fine dining aesthetic, professional food photography', description: 'Enfoque profesional para gastronomía, resaltando texturas y luz cálida.' },
  { label: 'Retrato Ejecutivo', value: 'Professional headshot style, clean blurred office background, soft three-point lighting, authoritative and approachable, corporate portraiture', description: 'Ideal para perfiles corporativos, iluminación profesional favorecedora.' },
  { label: 'Hotel Boutique / Lujo', value: 'High-end interior photography, wide angle, soft architectural lighting, gold accents, opulent and inviting, residential architectural style', description: 'Lujo residencial, perfecto para arquitectura y servicios de alta gama.' },
  { label: 'Minimalismo Médico', value: 'Ethical and professional medical aesthetic, soft blues and whites, focused lighting on human interaction, trust-inspiring, clean composition', description: 'Minimalismo enfocado en la empatía y confianza profesional.' },
  { label: 'Culinary Artisan', value: 'Rustic artisan aesthetic, overhead natural lighting, raw ingredients, flour dust, focus on craftsmanship, warm and wholesome', description: 'Enfoque artesanal y orgánico para restaurantes y cocina.' },
  { label: 'Lifestyle Servicios', value: 'Dynamic storytelling, real-world application of service, bright natural lighting, authentic human interaction, professional but approachable', description: 'Captura el servicio en acción con un estilo auténtico y dinámico.' },
  { label: 'Foto Estudio Personal', value: 'Classic studio portrait, solid neutral backdrop, precise lighting, timeless composition, focus on facial clarity, professional retouching aesthetic', description: 'Retrato de estudio personal, clásico, atemporal y pulido.' }
];

const TYPOGRAPHY_PRESETS = [
  { label: 'Gigante y Gruesa', value: 'Massive Modern Grotesk bold sans-serif, screen-filling typography' },
  { label: 'Lujo / Serif', value: 'Elegant Serif high-end font, gold foil texture, lavish' },
  { label: 'Neón 3D', value: 'Futuristic neon 3D font, glowing text effect, volumetric light bleed' },
  { label: 'Escrito a Mano', value: 'Messy handwritten marker font, authentic feel, ink bleed' },
  { label: 'Vintage 70s', value: 'Vintage 70s chunky retro font, distressed texture' },
  { label: 'Cristal Esmerilado', value: 'Frosted glassmorphism text overlay, subtle drop shadow, blurred background behind text' },
  { label: 'Revista de Moda', value: 'Thin elegant editorial serif font, lots of kerning, sophisticated' },
  { label: 'Urbano / Grafiti', value: 'Gritty street style graffiti font, spray paint texture' },
  { label: 'Minimalismo Futuro', value: 'Ultra-thin geometric sans-serif, high tracking, clean, airy, luxurious tech vibe' },
  { label: 'Bauhaus Moderno', value: 'Geometric bold typography, primary shapes, structured layout, clean industrial aesthetic' },
  { label: 'Tipografía Kinetic', value: 'Kinetic typography, motion blur effect on text, dynamic, energetic composition' },
  { label: 'Relieve Profundo', value: 'Deep embossed 3D text, hard shadows, metallic finish, tactile high-contrast effect' },
  { label: 'Estética Web3', value: 'Monospace clean font, glitch effect, tech-inspired, digital interface aesthetic' }
];

export default function App() {
  const [angle, setAngle] = useState(() => localStorage.getItem('angle') || ANGLES[0].label);
  const [productTitle, setProductTitle] = useState(() => localStorage.getItem('productTitle') || '');
  const [productSubtitle, setProductSubtitle] = useState(() => localStorage.getItem('productSubtitle') || '');
  const [skinTone, setSkinTone] = useState(() => localStorage.getItem('skinTone') || '');
  const [facialFeatures, setFacialFeatures] = useState(() => localStorage.getItem('facialFeatures') || '');
  const [hair, setHair] = useState(() => localStorage.getItem('hair') || '');
  const [bodyType, setBodyType] = useState(() => localStorage.getItem('bodyType') || '');
  const [ethnicity, setEthnicity] = useState(() => localStorage.getItem('ethnicity') || '');
  const [expression, setExpression] = useState(() => localStorage.getItem('expression') || '');
  const [age, setAge] = useState(() => localStorage.getItem('age') || '');
  const [position, setPosition] = useState(() => localStorage.getItem('position') || '');
  const [scenery, setScenery] = useState(() => localStorage.getItem('scenery') || '');
  const [productDescriptionCtx, setProductDescriptionCtx] = useState(() => localStorage.getItem('productDescriptionCtx') || '');
  const [style, setStyle] = useState(() => localStorage.getItem('style') || '');
  const [selectedStylePresets, setSelectedStylePresets] = useState<string[]>(() => JSON.parse(localStorage.getItem('selectedStylePresets') || '[]'));
  const [typography, setTypography] = useState(() => localStorage.getItem('typography') || '');
  const [selectedTypographyPresets, setSelectedTypographyPresets] = useState<string[]>(() => JSON.parse(localStorage.getItem('selectedTypographyPresets') || '[]'));
  
  // Persist form state
  useEffect(() => {
    localStorage.setItem('angle', angle);
    localStorage.setItem('productTitle', productTitle);
    localStorage.setItem('productSubtitle', productSubtitle);
    localStorage.setItem('skinTone', skinTone);
    localStorage.setItem('facialFeatures', facialFeatures);
    localStorage.setItem('hair', hair);
    localStorage.setItem('bodyType', bodyType);
    localStorage.setItem('ethnicity', ethnicity);
    localStorage.setItem('expression', expression);
    localStorage.setItem('age', age);
    localStorage.setItem('position', position);
    localStorage.setItem('scenery', scenery);
    localStorage.setItem('productDescriptionCtx', productDescriptionCtx);
    localStorage.setItem('style', style);
    localStorage.setItem('selectedStylePresets', JSON.stringify(selectedStylePresets));
    localStorage.setItem('typography', typography);
    localStorage.setItem('selectedTypographyPresets', JSON.stringify(selectedTypographyPresets));
  }, [angle, productTitle, productSubtitle, skinTone, facialFeatures, hair, bodyType, ethnicity, expression, age, position, scenery, productDescriptionCtx, style, selectedStylePresets, typography, selectedTypographyPresets]);

  const handleClearAll = () => {
    if (window.confirm("Esta acción eliminará permanentemente todo tu progreso actual, incluyendo el historial. ¿Estás seguro?")) {
      setHistory([]);
      localStorage.clear();
      window.location.reload();
    }
  };

  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const savedHistory = localStorage.getItem('prompt_history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        return parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
      } catch (e) {
        console.error("Error loading history", e);
      }
    }
    return [];
  });
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

  useEffect(() => {
    localStorage.setItem('prompt_history', JSON.stringify(history));
  }, [history]);

  const handleGenerate = async () => {
    playClickSound();
    if (!style || !typography) {
      setError('Por favor, completa, al menos, Estilo Visual y Diseño de Títulos.');
      return;
    }
    
    setError('');
    setIsGenerating(true);
    setGeneratedPrompt('');

    // Simulate network delay for effect
    await new Promise(resolve => setTimeout(resolve, 800));

    const selectedAngle = ANGLES.find(a => a.label === angle);
    
    const isNoText = typography.toLowerCase() === 'sin texto';
    const tOverlay = isNoText ? "STRICTLY NO TEXT" : typography;
    
    // Construct prompt locally based on selections
    const protagonistDetails = [age, skinTone, ethnicity, bodyType, hair, expression, position, facialFeatures].filter(Boolean).join(', ');
    const prompt = `Professional digital advertisement ${productTitle ? `for a ${productTitle} ${productSubtitle}` : `showcasing a professional product/service`}. 
    
    ${protagonistDetails ? `Protagonista: ${protagonistDetails}.` : ''}
    ${scenery ? `Escenario: ${scenery}.` : ''}
    
    Composition Strategy: ${selectedAngle?.label || angle} shot. ${selectedAngle?.description || ''}
Visual Style & Environment: ${style}
Typography & Graphic Overlay: ${isNoText ? tOverlay : `text overlay: "${tOverlay}"`}

Technical Specifications: 
- High-conversion social media advertisement layout.
- Hyper-detailed image quality with professional lighting and textures.
- Clear visual hierarchy with appropriate negative space for CTA placement.
${isNoText ? "" : `- IMPORTANT: All text overlay elements must be rendered in Spanish: "${tOverlay}". `}
- Optimized for modern AI image synthesis, high-impact branding. --v 6.0 --ar 4:5 --style raw

Context: ${productDescriptionCtx}`;

    setGeneratedPrompt(prompt);
    setActiveTab('current');
    
    const newHistoryItem: HistoryItem = {
      id: crypto.randomUUID(),
      angle,
      product: productTitle,
      style,
      typography,
      prompt: prompt,
      timestamp: new Date()
    };
    setHistory(prev => [newHistoryItem, ...prev]);
    setIsGenerating(false);
  };

  const copyToClipboard = async () => {
    if (!generatedPrompt) return;
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback
      console.error("Failed to copy", err);
    }
  };

  const handleExport = () => {
    if (!generatedPrompt) return;
    const element = document.createElement("a");
    const file = new Blob([generatedPrompt], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `prompt_${productTitle?.replace(/\s+/g, '_') || 'generado'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-ink font-sans p-4 md:p-10 flex flex-col selection:bg-theme-accent/30 selection:text-theme-ink">
      {/* Header */}
      <header className="flex justify-between items-center mb-[40px] p-6 bg-white rounded-2xl shadow-sm border border-[#eee]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center shadow-md">
            <span className="text-2xl">🍌</span>
          </div>
          <div>
            <h1 className="text-xl font-medium tracking-tight text-theme-ink uppercase">
              Sistema Modular de Prompts
            </h1>
            <p className="text-xs font-medium uppercase tracking-[2px] text-theme-accent">
              Powered by Nano Banana
            </p>
          </div>
        </div>
        <div className="hidden sm:block text-[10px] uppercase tracking-[2px] font-bold text-[#aaa] bg-[#f8f8f8] px-3 py-1 rounded-full border border-[#eee]">
          Engine: Gemini Driven
        </div>
      </header>

      <main className="flex flex-col gap-10 flex-1 w-full mx-auto md:max-w-none">
        
       {/* Controls Panel (Workbench) */}
        <div className="p-0 space-y-6">
          {error && <p className="text-red-500 text-sm mb-4 text-center font-bold bg-white/50 p-2 rounded">{error}</p>}
          <div className="mb-[25px] p-5 bg-white border border-[#eee] rounded-xl shadow-sm">
            <span className="text-base font-bold uppercase tracking-[1px] mb-[15px] block text-theme-ink flex items-center">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse mr-2"></span>
              1) Ángulo de Venta
            </span>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              {ANGLES.map(a => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.id}
                    onClick={() => {
                        playClickSound();
                        setAngle(a.label);
                    }}
                    title={a.description}
                    className={`p-4 text-xs border flex flex-col items-center justify-center space-y-2 cursor-pointer transition ${angle === a.label ? 'bg-theme-ink text-theme-bg border-theme-ink shadow-sm' : 'bg-transparent text-theme-ink border-[#ccc] hover:bg-black/5'}`}
                  >
                    <Icon className={`w-6 h-6 ${angle === a.label ? 'opacity-100 text-theme-accent' : 'opacity-60 text-theme-ink'}`} />
                    <span className="text-center font-medium">[ {a.label} ]</span>
                  </button>
                );
              })}
            </div>
            <div className="bg-[#f4f4f4] border-l-4 border-theme-accent p-4 mt-3 rounded-r-md">
              <p className="text-theme-ink text-sm italic font-serif leading-relaxed">
                {ANGLES.find(a => a.label === angle)?.description}
              </p>
              <div className="mt-2">
                <span className="text-[10px] uppercase tracking-[1px] font-bold bg-white px-2 py-0.5 rounded shadow-sm border border-[#ddd]">
                  {ANGLES.find(a => a.label === angle)?.type}
                </span>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="mb-[25px] p-5 bg-white border border-[#eee] rounded-xl shadow-sm space-y-4">
            <span className="text-base font-bold uppercase tracking-[1px] block text-theme-ink flex items-center">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse mr-2"></span>
              2) Detalles del Diseño (Producto o Servicio)
            </span>
            <input
              type="text"
              placeholder="Título principal"
              value={productTitle}
              onChange={(e) => setProductTitle(e.target.value)}
              className="w-full p-3 border border-dashed border-[#ccc] text-sm text-[#444] bg-transparent outline-none focus:border-theme-ink placeholder-[#aaa]"
            />
            <input
              type="text"
              placeholder="Subtítulo"
              value={productSubtitle}
              onChange={(e) => setProductSubtitle(e.target.value)}
              className="w-full p-3 border border-dashed border-[#ccc] text-sm text-[#444] bg-transparent outline-none focus:border-theme-ink placeholder-[#aaa]"
            />
            <div className="grid grid-cols-2 gap-2">
              <select value={skinTone} onChange={(e) => setSkinTone(e.target.value)} className="w-full p-3 border border-dashed border-[#ccc] text-sm text-[#444] bg-white outline-none focus:border-theme-ink">
                <option value="">Tono de Piel</option>
                {['Claro', 'Bronceado', 'Oliva', 'Marrón Claro', 'Marrón Oscuro', 'Profundo'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <select value={bodyType} onChange={(e) => setBodyType(e.target.value)} className="w-full p-3 border border-dashed border-[#ccc] text-sm text-[#444] bg-white outline-none focus:border-theme-ink">
                <option value="">Contextura personal</option>
                {['Promedio', 'Alta', 'Delgada', 'Atlética', 'Curvilínea', 'Musculosa'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <select value={hair} onChange={(e) => setHair(e.target.value)} className="w-full p-3 border border-dashed border-[#ccc] text-sm text-[#444] bg-white outline-none focus:border-theme-ink">
                <option value="">Cabello</option>
                {['Corto', 'Largo', 'Rizado', 'Ondulado', 'Lacio', 'Calvo', 'Teñido', 'Rubio', 'Moreno', 'Pelirrojo', 'Castaño Claro', 'Castaño Oscuro', 'Degradado', 'Tupé', 'Corte pixie'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <select value={ethnicity} onChange={(e) => setEthnicity(e.target.value)} className="w-full p-3 border border-dashed border-[#ccc] text-sm text-[#444] bg-white outline-none focus:border-theme-ink">
                <option value="">Etnia</option>
                {['Europea', 'Africana', 'Asiática', 'Latina', 'Oriente Medio', 'Mixta'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <select value={expression} onChange={(e) => setExpression(e.target.value)} className="w-full p-3 border border-dashed border-[#ccc] text-sm text-[#444] bg-white outline-none focus:border-theme-ink">
                <option value="">Expresión</option>
                {['Feliz', 'Serio', 'Entusiasta', 'Sorprendido', 'Pensativo', 'Elegante', 'Confiado'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <select value={age} onChange={(e) => setAge(e.target.value)} className="w-full p-3 border border-dashed border-[#ccc] text-sm text-[#444] bg-white outline-none focus:border-theme-ink">
                <option value="">Edad</option>
                {['Niño', 'Niña', 'Adolescente (Hombre)', 'Adolescente (Mujer)', 'Adulto Joven (Hombre)', 'Adulto Joven (Mujer)', 'Adulto (Hombre)', 'Adulto (Mujer)', 'Adulto Mayor (Hombre)', 'Adulto Mayor (Mujer)'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Pómulos marcados', value: 'high cheekbones' },
                { label: 'Pecas', value: 'freckles' },
                { label: 'Gafas', value: 'glasses' },
                { label: 'Barba', value: 'beard' },
                { label: 'Cicatrices', value: 'scars' },
                { label: 'Ojos brillantes', value: 'bright-eyes' },
                { label: 'Hoyuelos', value: 'dimples' },
                { label: 'Tatuajes faciales', value: 'face tattoos' },
                { label: 'Bigote', value: 'mustache' },
                { label: 'Piercing', value: 'piercing' },
                { label: 'Maquillaje pronunciado', value: 'strong makeup' },
                { label: 'Cejas pobladas', value: 'thick eyebrows' },
                { label: 'Piel bronceada', value: 'sun-kissed skin' },
              ].map((feature) => {
                const isSelected = facialFeatures.split(', ').includes(feature.value);
                return (
                  <button
                    key={feature.value}
                    type="button"
                    onClick={() => {
                      const current = facialFeatures ? facialFeatures.split(', ').filter(Boolean) : [];
                      if (isSelected) {
                        setFacialFeatures(current.filter((item) => item !== feature.value).join(', '));
                      } else {
                        setFacialFeatures([...current, feature.value].join(', '));
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      isSelected 
                        ? 'bg-black text-white border-black' 
                        : 'bg-white text-gray-700 border-[#ccc] hover:border-black'
                    }`}
                  >
                    {feature.label}
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              placeholder="Escenario o ambiente..."
              value={scenery}
              onChange={(e) => setScenery(e.target.value)}
              className="w-full p-3 border border-dashed border-[#ccc] text-sm text-[#444] bg-transparent outline-none focus:border-theme-ink placeholder-[#aaa]"
            />
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Sentado', value: 'sitting' },
                { label: 'Sentado en el suelo', value: 'sitting on floor' },
                { label: 'Parado', value: 'standing' },
                { label: 'De espaldas', value: 'back view' },
                { label: 'Acostado', value: 'lying down' },
                { label: 'Caminando', value: 'walking' },
                { label: 'Corriendo', value: 'running' },
                { label: 'En movimiento', value: 'in motion' },
                { label: 'Inclinado', value: 'leaning' },
                { label: 'Recostado en la pared', value: 'leaning against a wall' },
                { label: 'De perfil', value: 'profile view' },
                { label: 'En cuclillas', value: 'squatting' },
                { label: 'Arrodillado', value: 'kneeling' },
                { label: 'Saltando', value: 'jumping' },
                { label: 'Bailando', value: 'dancing' },
                { label: 'Cruzado de brazos', value: 'arms crossed' },
                { label: 'Manos en la cintura', value: 'hands on hips' },
                { label: 'Hablando', value: 'talking' },
                { label: 'Extendiendo la mano', value: 'reaching out' },
                { label: 'Mirando hacia otro lado', value: 'looking away' },
                { label: 'Mirando al espectador', value: 'looking at viewer' },
                { label: 'Durmiendo', value: 'sleeping' },
                { label: 'Meditando', value: 'meditating' },
                { label: 'Trabajando', value: 'working' },
              ].map((pos) => {
                const isSelected = position.split(', ').includes(pos.value);
                return (
                  <button
                    key={pos.value}
                    type="button"
                    onClick={() => {
                      const current = position ? position.split(', ').filter(Boolean) : [];
                      if (isSelected) {
                        setPosition(current.filter((item) => item !== pos.value).join(', '));
                      } else {
                        setPosition([...current, pos.value].join(', '));
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      isSelected 
                        ? 'bg-black text-white border-black' 
                        : 'bg-white text-gray-700 border-[#ccc] hover:border-black'
                    }`}
                  >
                    {pos.label}
                  </button>
                );
              })}
            </div>
            <textarea
              placeholder="Descripción principal del Producto o Servicio (para el promt)"
              value={productDescriptionCtx}
              onChange={(e) => setProductDescriptionCtx(e.target.value)}
              className="w-full h-20 p-3 border border-dashed border-[#ccc] text-sm text-[#444] bg-transparent outline-none focus:border-theme-ink placeholder-[#aaa] resize-none"
            />
          </div>

          {/* Step 3 */}
          <div className="mb-[25px] p-5 bg-white border border-[#eee] rounded-xl shadow-sm">
            <span className="text-base font-bold uppercase tracking-[1px] mb-[10px] block text-theme-ink flex items-center">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse mr-2"></span>
              3) Estilo Visual y Entorno
            </span>
            <div className="flex flex-wrap gap-2 mb-[10px]">
              {STYLE_PRESETS.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => {
                    playClickSound();
                    if (selectedStylePresets.includes(preset.label)) {
                      setSelectedStylePresets(prev => prev.filter(l => l !== preset.label));
                      setStyle(prev => prev.replace(new RegExp(`(, )?${preset.value}`, 'g'), '').replace(/^, /, ''));
                    } else {
                      setSelectedStylePresets(prev => [...prev, preset.label]);
                      setStyle(prev => prev ? `${prev}, ${preset.value}` : preset.value);
                    }
                  }}
                  className={`px-4 py-2 text-xs uppercase tracking-[1px] border transition cursor-pointer ${selectedStylePresets.includes(preset.label) ? 'bg-theme-ink text-white border-theme-ink' : 'border-[#ccc] text-theme-ink bg-transparent hover:bg-theme-ink hover:text-white'}`}
                  title={preset.description}
                >
                  + {preset.label}
                </button>
              ))}
            </div>
            <textarea
              placeholder="Ej. Fotografía editorial, luz de atardecer, grano de película fino. Cinematic lighting, dramatic shadows."
              rows={3}
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full p-2.5 border border-dashed border-[#ccc] font-serif italic text-sm text-[#444] bg-transparent outline-none focus:border-theme-ink placeholder-[#aaa] resize-none"
            />
            {selectedStylePresets.length > 0 && (
              <div className="bg-[#f4f4f4] border-l-4 border-theme-accent p-3 mt-3 rounded-r-md">
                <p className="text-theme-ink text-xs font-serif leading-relaxed">
                  {selectedStylePresets.map(label => {
                    const preset = STYLE_PRESETS.find(p => p.label === label);
                    return preset ? <span key={label} className="block mb-1"><strong>{label}:</strong> {preset.description}</span> : null;
                  })}
                </p>
              </div>
            )}
            <div className="mt-3 text-[11px] text-theme-muted font-sans bg-[#f9f9f9] p-2 rounded">
              <strong>Tip:</strong> Puedes combinar estilos o escribir especificaciones personalizadas.
            </div>
          </div>

          {/* Step 4 */}
          <div className="mb-[25px] p-5 bg-white border border-[#eee] rounded-xl shadow-sm">
            <span className="text-base font-bold uppercase tracking-[1px] mb-[10px] block text-theme-ink flex items-center">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse mr-2"></span>
              4) Diseño de Títulos y Tipografía
            </span>
            <div className="flex flex-wrap gap-2 mb-[10px]">
              <button
                onClick={() => {
                    playClickSound();
                    setSelectedTypographyPresets([]);
                    setTypography('sin texto');
                }}
                className={`px-4 py-2 text-xs uppercase tracking-[1px] border transition cursor-pointer ${typography.toLowerCase() === 'sin texto' ? 'bg-theme-ink text-white border-theme-ink' : 'border-[#ccc] text-theme-ink bg-transparent hover:bg-theme-ink hover:text-white'}`}
              >
                  Sin estilo de texto
              </button>
              {TYPOGRAPHY_PRESETS.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => {
                    playClickSound();
                    if (selectedTypographyPresets.includes(preset.label)) {
                      setSelectedTypographyPresets(prev => prev.filter(l => l !== preset.label));
                      setTypography(prev => prev.replace(new RegExp(`(, )?${preset.value}`, 'g'), '').replace(/^, /, ''));
                    } else {
                      setSelectedTypographyPresets(prev => [...prev, preset.label]);
                      setTypography(prev => prev ? `${prev}, ${preset.value}` : preset.value);
                    }
                  }}
                  className={`px-4 py-2 text-xs uppercase tracking-[1px] border transition cursor-pointer ${selectedTypographyPresets.includes(preset.label) ? 'bg-theme-ink text-white border-theme-ink' : 'border-[#ccc] text-theme-ink bg-transparent hover:bg-theme-ink hover:text-white'}`}
                  title={preset.value}
                >
                  + {preset.label}
                </button>
              ))}
            </div>
            <textarea
              placeholder="Ej. Text overlay 'OFERTA' in Modern Grotesk, bold. Glassmorphism effect, subtle shadow."
              rows={3}
              value={typography}
              onChange={(e) => setTypography(e.target.value)}
              className="w-full p-2.5 border border-dashed border-[#ccc] font-serif italic text-sm text-[#444] bg-transparent outline-none focus:border-theme-ink placeholder-[#aaa] resize-none"
            />
            <div className="mt-2 text-[10px] text-theme-muted font-sans leading-relaxed">
              <strong>Tip:</strong> Especifica el diseño para lograr un impacto tipográfico profesional.<br/>
              • <em>Estilos:</em> "Modern Grotesk, bold", "Elegant Serif gold font", "Futuristic neon 3D"<br/>
              • <em>Efectos de texto:</em> "creamy studio lighting on text", "glowing neon shadows", "embossed text"
            </div>
          </div>

          {/* Live Preview of Input Structure */}
          <div className="mt-[30px] p-[20px] bg-[#0a0a0a] rounded-[8px] shadow-lg border border-[#222]">
            <div className="fixed bottom-0 left-0 w-full p-4 bg-[#0a0a0a] border-t border-[#222] flex space-x-4 z-50">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-1 bg-theme-accent text-theme-ink border-none p-[15px] font-bold text-[12px] uppercase tracking-[2px] cursor-pointer flex items-center justify-center space-x-2 transition opacity-90 hover:opacity-100 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generar Mega-Prompt</span>
                  </>
                )}
              </button>

              {generatedPrompt && (
                <>
                  <button
                    onClick={copyToClipboard}
                    className="flex-[0.5] bg-[#222] text-white border border-[#333] p-[15px] text-[12px] uppercase tracking-[2px] cursor-pointer flex items-center justify-center space-x-2 transition hover:bg-[#333] font-bold"
                    title="Copiar al portapapeles"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="hidden sm:inline">{copied ? 'Copiado' : 'Copiar'}</span>
                  </button>
                  <button
                    onClick={handleExport}
                    className="flex-[0.5] bg-[#222] text-white border border-[#333] p-[15px] text-[12px] uppercase tracking-[2px] cursor-pointer flex items-center justify-center space-x-2 transition hover:bg-[#333] font-bold"
                    title="Exportar a archivo"
                  >
                    <FileDown className="w-4 h-4" />
                    <span className="hidden sm:inline">Exportar</span>
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center justify-between mb-[15px]">
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-[#888] tracking-tight">Mega-Prompt Maestro</h2>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                </div>
                <span className="text-[10px] font-mono text-[#666] ml-2">preview.mdj</span>
              </div>
            </div>
            
            <div className="flex items-center justify-end mb-[15px]">
              <span className="text-[9px] uppercase tracking-[1px] text-[#888] font-bold flex items-center">
                 <div className="w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse mr-2"></div>
                 Sintaxis en Vivo
                 <button 
                  onClick={async () => {
                    const previewText = `/imagine prompt: ${angle ? `${ANGLES.find(a => a.label === angle)?.id || angle} shot` : '[Ángulo]'} of ${productTitle ? (productSubtitle ? `${productTitle} ${productSubtitle}` : productTitle) : '[Producto/Servicio]'}, ${style || '[Estilo Visual]'}, text overlay: "${typography || '[Tipografía y Textos]'}" --v 6.0 --ar 4:5 --style raw\n\nContexto: ${productDescriptionCtx}`;
                    await navigator.clipboard.writeText(previewText);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="ml-3 px-2 py-0.5 bg-[#ffbd2e] text-black text-[9px] font-bold uppercase tracking-[1px] rounded hover:bg-[#ffbd2e]/90 transition px-2"
                 >
                   {copied ? 'Copiado!' : 'Copiar'}
                 </button>
              </span>
            </div>
            
            <div className="font-mono text-[11.5px] leading-[2] break-words text-[#aaa] bg-[#111] p-4 rounded-md border border-[#1a1a1a]">
              <span className="text-theme-accent font-bold">/imagine prompt:</span>{' '}
              
              {/* Angle */}
              <span className={`px-1.5 py-0.5 rounded ${angle ? 'bg-[#2a2a2a] text-[#fff]' : 'border border-dashed border-[#444] text-[#555]'}`}>
                 {angle ? `${ANGLES.find(a => a.label === angle)?.id || angle} shot` : '[Ángulo]'}
              </span>
              <span className="text-[#666]"> of </span>
              
              {/* Product */}
              <span className={`px-1.5 py-0.5 font-bold rounded ${productTitle ? 'text-[#fff] border-b border-[#fff]' : 'border border-dashed border-[#444] text-[#555]'}`}>
                 {productTitle || '[Producto/Servicio]'}
              </span>
              <span className="text-[#666]">, </span>
              
              {/* Style */}
              <span className={`px-1.5 py-0.5 rounded ${style ? 'bg-[#1a2b3c] text-[#8ab4f8]' : 'border border-dashed border-[#444] text-[#555]'}`}>
                 {style || '[Entorno y Estilo Visual]'}
              </span>
              <span className="text-[#666]">, </span>
              
              {/* Typography */}
              <span className={`px-1.5 py-0.5 italic rounded ${typography ? 'bg-[#3c2a1a] text-[#f8b48a]' : 'border border-dashed border-[#444] text-[#555]'}`}>
                 text overlay: "{typography || '[Tipografía y Textos]'}"
              </span>
              {' '}
              
              {/* Params */}
              <span className="text-[#555] bg-[#1a1a1a] px-1.5 py-0.5 rounded">
                 --v 6.0 --ar 4:5 --style raw
              </span>
            </div>
            
            {/* Status indicators */}
            <div className="mt-4 pt-4 border-t border-[#222] flex justify-between items-center">
               <div className="flex space-x-4 text-[9px] uppercase tracking-[2px] font-mono">
                 <span className={`${productTitle ? "text-[#27c93f]" : "text-[#555]"} flex items-center`}>
                    <Check className={`w-3 h-3 mr-1 ${productTitle ? 'opacity-100' : 'opacity-0'}`} /> SUJETO
                 </span>
                 <span className={`${style ? "text-[#27c93f]" : "text-[#555]"} flex items-center`}>
                    <Check className={`w-3 h-3 mr-1 ${style ? 'opacity-100' : 'opacity-0'}`} /> ESTILO
                 </span>
                 <span className={`${typography ? "text-[#27c93f]" : "text-[#555]"} flex items-center`}>
                    <Check className={`w-3 h-3 mr-1 ${typography ? 'opacity-100' : 'opacity-0'}`} /> TEXTOS
                 </span>
               </div>
               <span className={`text-[9px] uppercase tracking-[1px] font-bold ${productTitle && style && typography ? 'text-theme-accent' : 'text-[#555]'}`}>
                 {productTitle && style && typography ? 'Listo para Compilar' : 'Bloques Incompletos'}
               </span>
            </div>
          </div>
        </div>

        {/* Result Panel (Output Area) */}
        <div className="flex flex-col">
          <div className="flex justify-between items-end mb-[15px]">
            <span className="text-[11px] font-bold uppercase tracking-[1px] text-theme-accent">
              {activeTab === 'current' ? 'Mega-Prompt Maestro' : 'Historial de Prompts'}
            </span>
            <div className="flex space-x-2">
               <button 
                onClick={() => setActiveTab('current')} 
                className={`text-[10px] uppercase tracking-[1px] pb-1 border-b-2 transition ${activeTab === 'current' ? 'border-theme-accent text-theme-ink' : 'border-transparent text-theme-muted hover:text-theme-ink'}`}
               >
                 Actual
               </button>
               <button 
                onClick={() => setActiveTab('history')} 
                className={`text-[10px] uppercase tracking-[1px] pb-1 border-b-2 transition ${activeTab === 'history' ? 'border-theme-accent text-theme-ink' : 'border-transparent text-theme-muted hover:text-theme-ink'}`}
               >
                 Historial ({history.length})
               </button>
            </div>
          </div>

          <div className="bg-[#111] text-[#a0a0a0] p-[30px] rounded-[8px] font-mono text-[12px] leading-[1.6] relative flex-1 min-h-[400px] flex flex-col">
            {activeTab === 'current' ? (
              <>
                <div className="absolute top-2.5 right-[15px] text-[8px] text-theme-accent">MASTER_PROMPT_v2.0</div>
                <div className="flex-1 overflow-y-auto">
                  {generatedPrompt ? (
                    <div className="whitespace-pre-wrap break-words">
                      {generatedPrompt}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-50 space-y-4">
                      <p className="text-center max-w-sm">
                        A la espera de variables para generar código...
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {history.length > 0 ? (
                  history.map((item) => (
                    <details key={item.id} className="group border border-[#333] mb-4 bg-[#1a1a1a] rounded-[6px] overflow-hidden list-none [&::-webkit-details-marker]:hidden">
                      <summary className="flex items-center justify-between p-3 cursor-pointer bg-[#222] hover:bg-[#2a2a2a] transition list-none outline-none">
                         <div className="flex items-center space-x-3 overflow-hidden">
                           <span className="text-[#a0a0a0] flex items-center space-x-1 text-[10px] shrink-0">
                             <Clock className="w-3 h-3" /> 
                             <span>{item.timestamp.toLocaleTimeString()}</span>
                           </span>
                           <span className="text-[#111] bg-theme-accent px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold shrink-0">
                             {item.angle}
                           </span>
                           <span className="text-[11px] font-sans text-white font-medium truncate max-w-[120px] sm:max-w-[200px]">
                             {item.product || 'Sin producto'}
                           </span>
                         </div>
                         
                         <div className="flex items-center space-x-3 shrink-0">
                           <div className="hidden lg:flex items-center space-x-2">
                              {item.style && (
                                <span className="text-[9px] text-[#aaa] bg-[#111] px-1.5 py-0.5 rounded border border-[#333] truncate max-w-[120px]" title={item.style}>
                                  Es: {item.style}
                                </span>
                              )}
                              {item.typography && (
                                <span className="text-[9px] text-[#aaa] bg-[#111] px-1.5 py-0.5 rounded border border-[#333] truncate max-w-[120px]" title={item.typography}>
                                  Ty: {item.typography}
                                </span>
                              )}
                           </div>
                           <span className="text-[#666] group-open:rotate-180 transition-transform">
                             <ChevronDown className="w-4 h-4" />
                           </span>
                         </div>
                      </summary>
                      
                      <div className="p-4 border-t border-[#333] bg-[#1a1a1a]">
                        {/* Meta Tags Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[10px] text-[#888] mb-4 font-sans bg-[#111] p-3 rounded border border-[#2a2a2a]">
                           <div>
                             <span className="text-[#bbb] block mb-1 uppercase tracking-wider text-[8px] font-bold">1. Producto/Servicio</span>
                             <span className="block text-white" title={item.product}>{item.product || '-'}</span>
                           </div>
                           <div>
                             <span className="text-[#bbb] block mb-1 uppercase tracking-wider text-[8px] font-bold">2. Estilo Visual</span>
                             <span className="block text-white line-clamp-3" title={item.style}>{item.style || '-'}</span>
                           </div>
                           <div>
                             <span className="text-[#bbb] block mb-1 uppercase tracking-wider text-[8px] font-bold">3. Tipografía</span>
                             <span className="block text-white line-clamp-3" title={item.typography}>{item.typography || '-'}</span>
                           </div>
                        </div>
                        
                        {/* Prompt Body */}
                        <div className="relative">
                          <label className="text-[9px] text-[#888] uppercase tracking-[2px] mb-2 block">Prompt Generado</label>
                          <div className="whitespace-pre-wrap break-words text-[#e0e0e0] font-mono text-[11px] bg-black p-3.5 rounded border border-[#333] selection:bg-theme-accent/30 leading-[1.8] shadow-inner">
                            {item.prompt}
                          </div>
                          <button
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(item.prompt);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                              } catch (err) {
                                console.error("Failed to copy", err);
                              }
                            }}
                            className="absolute top-6 right-2 text-[10px] uppercase tracking-[1px] text-theme-ink hover:text-white hover:bg-theme-ink transition flex items-center space-x-1.5 bg-theme-accent px-2 py-1.5 rounded font-bold"
                          >
                             <Copy className="w-3 h-3" /> <span>Copiar</span>
                          </button>
                        </div>
                      </div>
                    </details>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-50 space-y-4">
                    <p className="text-center max-w-sm">
                      Aún no hay prompts en el historial.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
      </main>

      {/* Footer */}
      <footer className="mt-[40px] mb-[60px] text-[10px] text-theme-muted flex flex-col items-center gap-4">
        <div className="flex justify-between w-full">
          <div>Diseñado para Directores de Arte y Creadores de Contenido</div>
          <div>© 2026 Mesa de Trabajo Modular</div>
        </div>
        <button 
          onClick={handleClearAll} 
          className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded text-[12px] uppercase tracking-wider font-bold hover:bg-red-700 hover:scale-105 transition-all duration-200 ease-in-out shadow-md"
        >
          <Trash2 className="w-4 h-4"/> <span>Borrar todo</span>
        </button>
        <p className="max-w-md text-center">
          <strong>Nota:</strong> "Borrar todo" elimina permanentemente todo tu progreso actual, incluyendo campos del formulario e historial almacenado en el navegador. Utilízalo solo para reiniciar el sistema desde cero.
        </p>
      </footer>
    </div>
  );
}
