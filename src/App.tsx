import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Copy, Check, Loader2, ArrowRight, Clock, ChevronDown,
  Award, Camera, Smartphone, ZoomIn, Scale, ArrowRightLeft, 
  ThumbsUp, Flame, Network, Key, LayoutGrid, PackageOpen, 
  Hammer, Zap, Sun, FileDown, Trash2, Heart, RefreshCcw, HelpCircle, X, Image,
  MessageSquareWarning, Target, BookOpen, ShieldAlert, HeartPulse, Utensils, Droplets
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
  { id: 'authority_mentor', icon: Award, label: 'Mentoría / Autoridad', description: 'Te posicionas como el guía que ayuda al usuario a llegar a su objetivo. Demuestras tu experiencia resolviendo retos complejos con sabiduría.', type: 'Ambos' },
  { id: 'authenticity_daily', icon: Smartphone, label: 'Día a Día / Autenticidad', description: 'Humaniza tu marca con momentos reales, sin guion y sin filtros. Fortalece la conexión emocional al mostrarte tal cual eres, sin poses corporativas.', type: 'Ambos' },
  { id: 'journey_growth', icon: ArrowRight, label: 'Tu Transformación / Viaje', description: 'Muestra tu progreso. De dónde venías a dónde estás hoy. Esto prueba que el cambio es posible y posiciona tu marca como un faro de esperanza.', type: 'Ambos' },
  { id: 'bold_opinion', icon: MessageSquareWarning, label: 'Rompiendo Mitos', description: 'Cuestiona las normas de tu industria. Di la verdad incómoda que nadie quiere admitir. Es el ángulo perfecto para establecer liderazgo de opinión.', type: 'Ambos' },
  { id: 'mission_purpose', icon: Target, label: 'El "Por Qué" (Propósito)', description: 'Conecta a tu audiencia con tus valores fundamentales. No se trata de qué haces, sino de por qué lo haces. Crea tribus y seguidores leales.', type: 'Ambos' },
  { id: 'health_translator', icon: BookOpen, label: 'El Traductor de Ciencia', description: 'Tomas conceptos médicos o fisiológicos complejos y los traduces a lenguaje sencillo, práctico y accionable. Empoderas al paciente explicándole el "porqué" de su salud.', type: 'Ambos' },
  { id: 'health_mythbuster', icon: ShieldAlert, label: 'El Desmitificador', description: 'Desmontas mitos populares de salud, dietas milagro o tratamientos sin base científica. Construyes autoridad protegiendo a tu audiencia de desinformación peligrosa.', type: 'Ambos' },
  { id: 'patient_journey', icon: HeartPulse, label: 'Caso Clínico Humano', description: 'Enfocado en la transformación de vida más allá del diagnóstico. Muestras la mejora tangible en la calidad de vida, conectando salud y bienestar emocional.', type: 'Ambos' },
  { id: 'food_sensorial', icon: Utensils, label: 'Sensorial & Antojo (Craving)', description: 'Primeros planos extremos que destacan texturas, humeantes, ingredientes frescos y detalles que despiertan el hambre emocional. Esencial para captar la atención en el feed.', type: 'Producto' },
  { id: 'fastfood_messy', icon: Droplets, label: 'Realismo Irresistible (The Sauce Shot)', description: 'En la comida rápida, el desorden es un activo. Capturamos la salsa goteando, el queso estirándose o el ingrediente desbordándose. Estimulación visual directa que rompe la frialdad de una foto perfecta.', type: 'Producto' },
  { id: 'fastfood_dynamic', icon: Clock, label: 'Ritmo Dinámico (On-the-Go/Lifestyle)', description: 'Posiciona la comida rápida como combustible esencial de una vida a mil por hora. Producto en contextos activos: en la mano mientras caminas, en el coche o en un break rápido. Vendes tiempo y agilidad.', type: 'Ambos' },
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

const STYLE_TRANSLATIONS: Record<string, string> = {
  'Cinematográfico': 'Cinematic',
  'Minimalista': 'Minimalist',
  'Vibrante / Pop': 'Vibrant / Pop',
  'Editorial / Vogue': 'Editorial / Vogue',
  'Glow Oscuro': 'Dark Glow',
  'Aesthetic Natural': 'Natural Aesthetic',
  'Estudio Brillante': 'Bright Studio',
  'Granular Analógico': 'Analog Granular',
  'Humo y Sombras': 'Smoke & Shadows',
  'Arquitectura Brutalista': 'Brutalist Arch',
  '3D Renderizado Suave': 'Soft 3D',
  'Sostenible / ECO': 'Sustainable / ECO',
  'Bohemio Chic': 'Bohemian Chic',
  'Soft Glam': 'Soft Glam',
  'Vintage Polaroid': 'Vintage Polaroid',
  'Zen / Japandi': 'Zen / Japandi',
  'Noir Contemporáneo': 'Contemporary Noir',
  'Clínico Premium': 'Premium Clinical',
  'Gastronómico Gourmet': 'Gourmet Gastronomic',
  'Retrato Ejecutivo': 'Executive Portrait',
  'Hotel Boutique / Lujo': 'Boutique Hotel / Luxury',
  'Minimalismo Médico': 'Medical Minimalism',
  'Culinary Artisan': 'Culinary Artisan',
  'Lifestyle Servicios': 'Lifestyle Services',
  'Foto Estudio Personal': 'Personal Studio Photo'
};

const ANGLE_IMAGES: Record<string, string> = {
  'hero': 'https://lh3.googleusercontent.com/d/1pKt5BZ5fsRIKv5-l5iyb7uWTWgQWZIIb=w700',
  'lifestyle_premium': 'https://lh3.googleusercontent.com/d/1mqhYsgiEfZUUs-7ROMW3Y0kfodO8woGE=w700',
  'ugc_organico': 'https://lh3.googleusercontent.com/d/1JwM00ZShFM8p501eaSJ1ZOZ6ar-R6jmH=w700',
  'macro_sensorial': 'https://lh3.googleusercontent.com/d/1LJUgsz5FX-13BEhGpRUCZBHAmv6CVKT3=w700',
  'nosotros_vs_ellos': 'https://lh3.googleusercontent.com/d/1OKWkN6ndUSprdEMTahRrsuONVd1iSyv8=w700',
  'antes_despues': 'https://lh3.googleusercontent.com/d/1qkE8NfVVEVqdMQBeDerogdgeFaFobOuy=w700',
  'prueba_social': 'https://lh3.googleusercontent.com/d/1rWP1nnRBE3KtA91B7HISTgLI70FHbXni=w700',
  'urgencia_escasez': 'https://lh3.googleusercontent.com/d/1gxzdm92lDUxFs5LRguAF54RbGe8mfXYJ=w700',
  'anatomia_infografia': 'https://lh3.googleusercontent.com/d/1xKa-ICZSSzqFyg51Uvnz7VncRhwlrKbU=w700',
  'secreto_revelado': 'https://lh3.googleusercontent.com/d/1wDTPqhHKVFlinyvDzolvY87iD13pwlWt=w700',
  'flatlay_estetico': 'https://lh3.googleusercontent.com/d/1T58ZgNOfDTeOMc5N8uKCZijXGkSa_RjW=w700',
  'unboxing_experiencia': 'https://lh3.googleusercontent.com/d/1YLshzsGWLSIHZesQ5uNGf23BhNdXmUck=w700',
};

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

const VEO_SCENE_DESCRIPTIONS: Record<string, string> = {
  'Caminar hacia cámara': 'El sujeto se aproxima progresivamente, creando una sensación de encuentro directo.',
  'Correr de perfil': 'Movimiento dinámico lateral, ideal para transmitir velocidad y energía.',
  'Giro 360 grados': 'Cámara rotando alrededor de un sujeto u objeto para una perspectiva completa.',
  'Acción de señalar producto': 'El sujeto dirige la atención del espectador hacia el producto de forma clara.',
  'Salto de entusiasmo': 'Movimiento explosivo hacia arriba que transmite alegría o euforia.',
  'Zoom in lento a rostro': 'Enfoque gradual hacia los rasgos faciales para capturar emociones.',
  'Zoom out rápido a escena': 'Apertura de plano para revelar el contexto o escenario tras ver al sujeto.',
  'Panorámica de paisaje': 'Movimiento fluido de cámara para mostrar la amplitud del entorno.',
  'Acción de beber/comer': 'Acción cotidiana que humaniza al sujeto frente al producto.',
  'Uso de producto con manos': 'Primer plano enfocado en la interacción táctil con el producto.',
  'Bailar con energía': 'Movimiento libre y dinámico para transmitir vitalidad.',
  'Pose estática a movimiento': 'Contraste entre pausa y comienzo de acción para generar impacto.',
  'Carrera hacia el horizonte': 'Movimiento alejado que evoca superación o metas.',
  'Objeto interactuando con sujeto': 'El objeto cobra vida en manos del sujeto.',
  'Sujeto mirando al infinito': 'Transmite profundidad, pensamiento o aspiración.',
  'Acción de escribir/trabajar': 'Muestra el producto en un contexto de productividad o utilidad.',
  'Transición rápida de escena': 'Cambio dinámico para mantener el ritmo del vídeo.',
  'Movimiento en cámara lenta': 'Ideal para dramatizar momentos y resaltar detalles.',
  'Gestos de sorpresa': 'Captura emoción intensa ante el descubrimiento del producto.',
  'Mirada directa a cámara': 'Crea una conexión personal e inmediata con el usuario.',
  'Apertura de puerta': 'Acción de entrada o revelación de un espacio.',
  'Caída de producto': 'Atractivo visual si el producto es sólido o estético.',
  'Escalada de sujeto': 'Movimiento vertical que evoca superación o esfuerzo.',
  'Caminar bajo lluvia': 'Añade atmósfera, realismo y carga emocional.',
  'Sujeto saltando obstáculos': 'Demuestra superación de retos mediante el producto.'
};

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
  const [typography, setTypography] = useState(() => localStorage.getItem('typography') || 'sin texto');

  const [selectedTypographyPresets, setSelectedTypographyPresets] = useState<string[]>(() => JSON.parse(localStorage.getItem('selectedTypographyPresets') || '[]'));
  const [favoriteStyles, setFavoriteStyles] = useState<string[]>(() => JSON.parse(localStorage.getItem('favoriteStyles') || '[]'));
  const [activeModalAngle, setActiveModalAngle] = useState<any>(null);
  
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
    localStorage.setItem('favoriteStyles', JSON.stringify(favoriteStyles));
  }, [angle, productTitle, productSubtitle, skinTone, facialFeatures, hair, bodyType, ethnicity, expression, age, position, scenery, productDescriptionCtx, style, selectedStylePresets, typography, selectedTypographyPresets, favoriteStyles]);

  const toggleFavoriteStyle = (label: string) => {
    setFavoriteStyles(prev => 
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };
  
  const sortedStylePresets = [...STYLE_PRESETS].sort((a, b) => {
    const aFav = favoriteStyles.includes(a.label);
    const bFav = favoriteStyles.includes(b.label);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });

  const handleClearAll = () => {
    if (window.confirm("Esta acción eliminará permanentemente todo tu progreso actual, incluyendo el historial. ¿Estás seguro?")) {
      setHistory([]);
      localStorage.clear();
      window.location.reload();
    }
  };

  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [generatedPromptTranslation, setGeneratedPromptTranslation] = useState('');
  const [generatedVideoPrompt, setGeneratedVideoPrompt] = useState('');
  const [generatedVideoPromptTranslation, setGeneratedVideoPromptTranslation] = useState('');
  const [voiceOver, setVoiceOver] = useState(() => localStorage.getItem('voiceOver') || '');
  const [videoScene, setVideoScene] = useState(() => localStorage.getItem('videoScene') || '');
  const [copied, setCopied] = useState(false);
  const [videoCopied, setVideoCopied] = useState(false);
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
    
    ${protagonistDetails ? `Protagonist: ${protagonistDetails}.` : ''}
    ${scenery ? `Scenery: ${scenery}.` : ''}
    
    Composition Strategy: ${selectedAngle?.id || angle} shot.
Visual Style & Environment: ${style}
Typography & Graphic Overlay: ${isNoText ? tOverlay : `text overlay: "${tOverlay}"`}

Technical Specifications: 
- High-conversion social media advertisement layout.
- Hyper-detailed image quality with professional lighting and textures.
- Clear visual hierarchy with appropriate negative space for CTA placement.
${isNoText ? "" : `- IMPORTANT: All text overlay elements must be rendered in Spanish: "${tOverlay}". `}
- Optimized for modern AI image synthesis, high-impact branding. --v 6.0 --ar 4:5 --style raw

Context: ${productDescriptionCtx}`;

    const translation = `===== TRADUCCIÓN / ESTRUCTURA =====
    
Anuncio digital profesional ${productTitle ? `para un/a ${productTitle} ${productSubtitle}` : `mostrando un producto/servicio profesional`}. 

${protagonistDetails ? `Protagonista: ${protagonistDetails}.` : ''}
${scenery ? `Escenario: ${scenery}.` : ''}

Estrategia de Composición: Plano tipo ${selectedAngle?.label || angle}.
Estilo Visual y Entorno: ${STYLE_PRESETS.find(s => s.value === style)?.label || style}
Tipografía y Textos: ${isNoText ? "SIN TEXTO" : `Texto superpuesto: "${tOverlay}"`}

Especificaciones Técnicas:
- Diseño orientado a alta conversión en redes sociales.
- Calidad de imagen hiperdetallada con iluminación y texturas profesionales.
- Jerarquía visual clara con espacio negativo p/ Call to Action.
- Optimizado para alto impacto visual y branding de marca.

Contexto Adicional: ${productDescriptionCtx || "No especificado."}`;

    setGeneratedPrompt(prompt);
    setGeneratedPromptTranslation(translation);
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

  const handleGenerateVideo = () => {
    playClickSound();
    if (!style) {
      setError('Por favor, completa al menos el Estilo Visual.');
      return;
    }
    
    setError('');
    
    const selectedAngle = ANGLES.find(a => a.label === angle);
    const protagonistDetails = [age, skinTone, ethnicity, bodyType, hair, expression, position, facialFeatures].filter(Boolean).join(', ');
    
    // Construct prompt for Veo 3.1 Pro in Spanish with structured blocks
    const prompt = `Cinematic Video Script (optimized for Veo 3.1 Pro / Sora):

### 1. Product Context
- Context: ${productDescriptionCtx || 'High-end promotional video.'}
- Product: ${productTitle || 'Product'} - ${productSubtitle || ''}

### 2. Subject & Action Details
- Protagonist(s): ${protagonistDetails || 'Not specified.'}
- Posture/Position: ${position || 'Not specified.'}
- Expression: ${expression || 'Not specified.'}
- Motion Action: ${VEO_SCENE_DESCRIPTIONS[videoScene] || videoScene || 'Generic smooth motion.'}

### 3. Scenic Configuration
- Environment: ${scenery || 'Professional studio'}
- Lighting: ${style}

### 4. Cinematography & Style
- Camera Angle: ${selectedAngle?.id || angle} shot
- Visual Style: ${style}

---

### 5. Scene Chronology

[00s - 02s] Initial framing: ${selectedAngle?.id || angle} view. Establishing shot showing ${protagonistDetails.split(', ')[0] || 'the subject'} interacting with ${productTitle}. Action: ${VEO_SCENE_DESCRIPTIONS[videoScene] || videoScene || 'Starting action'}.

[02s - 05s] Action development: ${protagonistDetails} in motion. Fluid camera movement tracking the subject. Aesthetic: ${style}.

[05s - 08s] Resolution: Detailed product focus with integrated typography/text overlay: "${typography || 'clean minimalist aesthetic'}".

---

### 6. Audio & Voice (Voiceover)
- Voiceover Script: ${voiceOver ? `"${voiceOver}"` : 'No voice (ambient/musical video).'}

### 7. Technical Specifications
- High quality, hyper-realistic, 4k resolution, fluid motion, photorealistic lighting, professional color grading.
- Film format.`;

    const translation = `===== TRADUCCIÓN / ESTRUCTURA DE GUION =====
    
Guion Cinematográfico para Vídeo (Veo 3.1 Pro):

### 1. Contexto del Producto
- Contexto: ${productDescriptionCtx || 'Vídeo promocional de alta calidad.'}
- Producto: ${productTitle || 'Producto'} - ${productSubtitle || ''}

### 2. Información de Sujetos y Acciones
- Protagonistas: ${protagonistDetails || 'No especificado.'}
- Posición: ${position || 'No especificado.'}
- Expresión: ${expression || 'No especificado.'}
- Escena de Movimiento: ${videoScene || 'Acción genérica.'}

### 3. Configuración Escénica
- Entorno: ${scenery || 'Estudio profesional'}
- Estilo Visual: ${STYLE_PRESETS.find(s => s.value === style)?.label || style}

### 4. Cinematografía y Estilo
- Ángulo principal: ${selectedAngle?.label || angle}

---

### 5. Cronología de Escenas

[00s - 02s] Encuadre inicial: Plano general mostrando a ${protagonistDetails.split(', ')[0] || 'el sujeto'} con el producto.
[02s - 05s] Desarrollo: Movimiento fluido de cámara capturando la acción.
[05s - 08s] Cierre: Enfoque en el producto (Textos: ${typography || 'limpio/minimalista'}). 

---

### 6. Audio y Voz (Voiceover)
- Guion sugerido: ${voiceOver ? `"${voiceOver}"` : 'Sin voz (Vídeo musical/ambiente).'}

### 7. Especificaciones Técnicas
- Alta calidad, hiperrealista, 4k, movimiento fluido, gradación de color profesional.`;

    setGeneratedVideoPrompt(prompt);
    setGeneratedVideoPromptTranslation(translation);
    setActiveTab('current');
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

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };
  
  const loadHistoryItem = (item: HistoryItem) => {
    setAngle(item.angle);
    setProductTitle(item.product);
    setStyle(item.style);
    setTypography(item.typography);
    setActiveTab('current');
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-ink font-sans p-4 md:p-10 flex flex-col selection:bg-theme-accent/30 selection:text-theme-ink">
      {/* Header */}
      <header className="flex flex-col items-center justify-center mb-[40px] p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm border border-[#eee] text-center">
        <div className="w-16 h-16 rounded-2xl bg-yellow-400 flex items-center justify-center shadow-lg mb-4 transform rotate-3 hover:rotate-0 transition-transform">
          <span className="text-3xl">🍌</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tighter text-theme-ink uppercase mb-1">
          Sistema Modular de Prompts
        </h1>
        <p className="text-[10px] font-bold uppercase tracking-[3px] text-theme-accent bg-theme-accent/10 px-3 py-1 rounded-full">
          Powered by Nano Banana
        </p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ANGLES.map(a => {
                const Icon = a.icon;
                const isSelected = angle === a.label;
                return (
                  <button
                    key={a.id}
                    onClick={() => {
                        playClickSound();
                        setAngle(a.label);
                    }}
                    className={`group relative p-5 border rounded-2xl flex flex-col items-start text-left transition-all duration-300 ${isSelected 
                      ? 'bg-theme-ink text-white border-theme-ink shadow-lg scale-[1.02]' 
                      : 'bg-white text-theme-ink border-gray-200 hover:border-theme-accent hover:shadow-md'}`}
                  >
                    <div className="flex justify-between w-full items-start mb-3">
                      {!ANGLE_IMAGES[a.id] && (
                        <div className={`p-2 rounded-xl transition ${isSelected ? 'bg-white/10' : 'bg-gray-100 group-hover:bg-theme-accent/10'}`}>
                          <Icon className={`w-6 h-6 ${isSelected ? 'text-theme-accent' : 'text-theme-ink'}`} />
                        </div>
                      )}
                      {!ANGLE_IMAGES[a.id] && (
                        <div 
                          onClick={(e) => { e.stopPropagation(); setActiveModalAngle(a); }}
                          className="text-gray-400 hover:text-theme-accent bg-gray-100 p-1.5 rounded-full cursor-pointer transition hover:bg-theme-accent/10 border border-gray-200"
                        >
                          <Image size={14} />
                        </div>
                      )}
                    </div>
                    {ANGLE_IMAGES[a.id] && (
                        <div 
                          className="mb-2 w-full aspect-[4/3] overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveModalAngle(a);
                          }}
                        >
                          <img src={ANGLE_IMAGES[a.id]} alt={a.label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                    )}
                    <span className="font-bold text-sm mb-1">{a.label}</span>
                    <span className={`text-[14px] leading-relaxed line-clamp-3 ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                      {a.description}
                    </span>
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

          {/* Estilo Visual y Entorno */}
          <div className="mb-[25px] p-5 bg-white border border-[#eee] rounded-xl shadow-sm">
            <span className="text-base font-bold uppercase tracking-[1px] mb-[15px] block text-theme-ink flex items-center">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse mr-2"></span>
              3) Estilo Visual y Entorno
            </span>
            <div className="flex flex-wrap gap-2 mb-[10px]">
              {sortedStylePresets.map((preset) => (
                <div key={preset.label} className="relative inline-flex">
                  <button
                    type="button"
                    onClick={() => toggleFavoriteStyle(preset.label)}
                    className="absolute -top-1 -right-1 p-0.5 z-10 bg-white rounded-full border border-gray-200"
                  >
                    <Heart size={10} className={favoriteStyles.includes(preset.label) ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                  </button>
                  <button
                    // When clicking a style, we need to handle the Spanish to English mapping
                    onClick={() => {
                        playClickSound();
                        const englishValue = STYLE_TRANSLATIONS[preset.label] || preset.label;
                        if (selectedStylePresets.includes(preset.label)) {
                          setSelectedStylePresets(prev => prev.filter(l => l !== preset.label));
                          setStyle(prev => prev.replace(new RegExp(`(, )?${preset.value}`, 'g'), '').replace(/^, /, ''));
                        } else {
                          setSelectedStylePresets(prev => [...prev, preset.label]);
                          setStyle(prev => prev ? `${prev}, ${preset.value}` : preset.value);
                        }
                    }}
                    className={`pl-3 pr-6 py-2 text-xs uppercase tracking-[1px] border transition cursor-pointer ${selectedStylePresets.includes(preset.label) ? 'bg-theme-ink text-white border-theme-ink' : 'border-[#ccc] text-theme-ink bg-transparent hover:bg-theme-ink hover:text-white'}`}
                    title={preset.description}
                  >
                    + {preset.label}
                  </button>
                </div>
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
              placeholder="Ej. Estudio iluminado cálidamente al atardecer, condiciones atmosféricas, luz lateral dramática..."
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
              placeholder="IMPORTANTE: Describe que es el Producto o Servicio (para el promt final)"
              value={productDescriptionCtx}
              onChange={(e) => setProductDescriptionCtx(e.target.value)}
              className="w-full h-24 p-4 border-2 border-theme-accent rounded-xl bg-white text-sm text-gray-800 font-bold outline-none focus:border-theme-accent focus:ring-4 focus:ring-theme-accent/10 placeholder-gray-400 resize-none shadow-md"
            />
          </div>


          {/* Step 4 */}
          <div className="mb-[25px] p-5 bg-white border border-[#eee] rounded-xl shadow-sm">
            <span className="text-base font-bold uppercase tracking-[1px] mb-[10px] block text-theme-ink flex items-center">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse mr-2"></span>
              4) Estilo de Títulos (Tipografía)
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

          {/* Step 5 */}
          <div className="mb-[25px] p-5 bg-white border border-[#eee] rounded-xl shadow-sm space-y-4">
             <span className="text-base font-bold uppercase tracking-[1px] block text-theme-ink flex items-center">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse mr-2"></span>
              5) Secuencia para VEO 3.1 Pro
            </span>
            <div className="flex flex-wrap gap-2">
              {['Caminar hacia cámara', 'Correr de perfil', 'Giro 360 grados', 'Acción de señalar producto', 'Salto de entusiasmo', 'Zoom in lento a rostro', 'Zoom out rápido a escena', 'Panorámica de paisaje', 'Acción de beber/comer', 'Uso de producto con manos', 'Bailar con energía', 'Pose estática a movimiento', 'Carrera hacia el horizonte', 'Objeto interactuando con sujeto', 'Sujeto mirando al infinito', 'Acción de escribir/trabajar', 'Transición rápida de escena', 'Movimiento en cámara lenta', 'Gestos de sorpresa', 'Mirada directa a cámara', 'Apertura de puerta', 'Caída de producto', 'Escalada de sujeto', 'Caminar bajo lluvia', 'Sujeto saltando obstáculos'].map((scene) => (
                <button
                  key={scene}
                  onClick={() => setVideoScene(scene)}
                  className={`px-3 py-2 text-xs font-medium border transition-colors ${
                    videoScene === scene 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white text-gray-700 border-[#ccc] hover:border-black'
                  }`}
                >
                  {scene}
                </button>
              ))}
            </div>
            {videoScene && (
              <div className="mt-3 p-3 bg-theme-accent/10 border border-theme-accent/20 rounded-md">
                <p className="text-xs font-semibold text-theme-ink leading-relaxed">
                  <span className="text-theme-accent uppercase tracking-wider">Acción: </span>
                  {VEO_SCENE_DESCRIPTIONS[videoScene]}
                </p>
              </div>
            )}
            <div className="mt-4">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-[1px] mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                Guion de voz (Voiceover)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <span className="text-xs">🎤</span>
                </div>
                <input
                  type="text"
                  placeholder="Ej. 'Descubre la revolución que cambiará tu rutina...'"
                  value={voiceOver}
                  onChange={(e) => setVoiceOver(e.target.value)}
                  className="w-full pl-9 p-3 border border-[#ccc] text-sm text-[#444] bg-white outline-none focus:border-theme-ink focus:ring-1 focus:ring-theme-ink transition-all placeholder-[#aaa]"
                />
              </div>
            </div>
            <div className="mt-2 text-[10px] text-theme-muted font-sans leading-relaxed">
              <strong>Nota:</strong> Selecciona el movimiento que quieres que realice tu protagonista o producto en el vídeo. Si agregas un guion de voz, este se incorporará al prompt para guiar la intención comunicativa de VEO 3.1 Pro.
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
              <button
                onClick={() => {
                  playClickSound();
                  handleGenerateVideo();
                }}
                disabled={isGenerating}
                className="flex-1 bg-gray-700 text-white border-none p-[15px] font-bold text-[12px] uppercase tracking-[2px] cursor-pointer flex items-center justify-center space-x-2 transition opacity-90 hover:opacity-100 disabled:opacity-50 active:scale-95"
              >
                <span>Generar Vídeo Prompt (Veo)</span>
              </button>

              {generatedPrompt && (
                <>
                  <button
                    onClick={copyToClipboard}
                    className="flex-1 bg-theme-accent text-white border-none p-[15px] text-xs font-bold uppercase tracking-[2px] cursor-pointer flex items-center justify-center space-x-2 transition hover:opacity-90 active:scale-95"
                    title="Copiar al portapapeles"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    <span>{copied ? '¡Copiado!' : 'Copiar Prompt'}</span>
                  </button>
                  <button
                    onClick={handleExport}
                    className="flex-[0.2] bg-[#222] text-white border border-[#333] px-3 p-[15px] text-[12px] uppercase tracking-[2px] cursor-pointer flex items-center justify-center transition hover:bg-[#333] font-bold"
                    title="Exportar a archivo"
                  >
                    <FileDown className="w-4 h-4" />
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
                  className="ml-3 px-4 py-1.5 bg-theme-accent text-white text-[10px] font-bold uppercase tracking-[1px] rounded hover:opacity-90 transition active:scale-95"
                 >
                   {copied ? '¡Copiado!' : 'Copiar Prompt'}
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
            </div>
            
            {generatedPrompt && (
              <div className="font-mono text-[11.5px] leading-[2] break-words text-[#aaa] bg-[#1a1a1a] p-4 rounded-md border border-[#333] mt-4 mb-4 whitespace-pre-wrap">
                 <div className="flex justify-between items-center mb-2 border-b border-[#333] pb-2">
                   <span className="text-white font-bold">Prompt Final (Inglés):</span>
                 </div>
                 {generatedPrompt}
              </div>
            )}
            
            {generatedPromptTranslation && (
              <div className="font-sans text-[12px] leading-relaxed break-words text-gray-300 bg-[#222] p-4 rounded-md border border-theme-accent/20 mb-4 whitespace-pre-wrap">
                 <div className="flex items-center mb-2">
                   <span className="text-theme-accent font-bold uppercase tracking-wider text-[10px]">Traducción Automática (Español):</span>
                 </div>
                 {generatedPromptTranslation}
              </div>
            )}
            
            {/* Display generated video prompt */}
            {generatedVideoPrompt && (
              <div className="font-mono text-[11.5px] leading-[2] break-words text-[#8ab4f8] bg-[#0c1622] p-4 rounded-md border border-[#1a2b3c] mt-4 mb-4 whitespace-pre-wrap">
                 <div className="flex justify-between items-center mb-2 border-b border-[#1a2b3c] pb-2">
                   <span className="text-white font-bold">Veo 3.1 Pro Video Prompt (Inglés):</span>
                   <button
                    onClick={async () => {
                        await navigator.clipboard.writeText(generatedVideoPrompt);
                        setVideoCopied(true);
                        setTimeout(() => setVideoCopied(false), 2000);
                    }}
                    className="px-4 py-1.5 bg-theme-accent text-white text-[10px] font-bold uppercase tracking-[1px] rounded transition hover:opacity-90 active:scale-95"
                  >
                    {videoCopied ? '¡Copiado!' : 'Copiar Vídeo Prompt'}
                  </button>
                 </div>
                 {generatedVideoPrompt}
              </div>
            )}

            {generatedVideoPromptTranslation && (
              <div className="font-sans text-[12px] leading-relaxed break-words text-blue-200 bg-[#16273b] p-4 rounded-md border border-blue-500/20 mb-4 whitespace-pre-wrap">
                 <div className="flex items-center mb-2">
                   <span className="text-blue-400 font-bold uppercase tracking-wider text-[10px]">Traducción Automática (Español):</span>
                 </div>
                 {generatedVideoPromptTranslation}
              </div>
            )}

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
                            <button
                                onClick={() => loadHistoryItem(item)}
                                className="text-gray-400 hover:text-white p-1"
                                title="Cargar prompt"
                            >
                                <RefreshCcw size={14} />
                            </button>
                            <button
                                onClick={() => deleteHistoryItem(item.id)}
                                className="text-gray-400 hover:text-red-500 p-1"
                                title="Eliminar del historial"
                            >
                                <Trash2 size={14} />
                            </button>
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
      {/* Modal for Angles Description */}
      {activeModalAngle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setActiveModalAngle(null)}>
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">{activeModalAngle.label}</h3>
              <button className="text-gray-500 hover:text-black p-1" onClick={() => setActiveModalAngle(null)}><X size={20}/></button>
            </div>
            {ANGLE_IMAGES[activeModalAngle.id] && (
              <img 
                src={ANGLE_IMAGES[activeModalAngle.id]} 
                alt={activeModalAngle.label} 
                className="w-full rounded-lg shadow-sm"
                referrerPolicy="no-referrer"
              />
            )}
            <p className="text-sm text-gray-700 leading-relaxed">{activeModalAngle.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
