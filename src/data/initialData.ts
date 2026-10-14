import { GalleryPhoto, CategoryItem, ContactEnquiry, WebsiteSettings } from '../types';

export const INITIAL_SETTINGS: WebsiteSettings = {
  business_name: 'MANDAVKAR CREATION',
  tagline: 'Capturing Moments, Creating Memories.',
  introduction:
    'We are fine-art visual storytellers specializing in luxury wedding documentation, emotive black-and-white portraits, and timeless candid moments. Based in Maharashtra and capturing celebrations worldwide.',
  phone_number: '+91 98234 56789',
  business_email: 'info@mandavkarcreation.com',
  whatsapp_number: '+919823456789',
  instagram_url: 'https://instagram.com/mandavkarcreation',
  hero_image_url:
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
  hero_badge_label: 'Signature Wedding Series',
  hero_subtitle: 'The Royal Heritage Union',
  updated_at: new Date().toISOString(),
};

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-weddings',
    name: 'Weddings',
    slug: 'weddings',
    description: 'Opulent royal nuptials, sacred rituals, and grand celebration moments.',
    cover_image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-10-01T08:00:00Z',
  },
  {
    id: 'cat-prewedding',
    name: 'Pre-Wedding',
    slug: 'pre-wedding',
    description: 'Poetic romantic sessions amidst historic forts, serene lakes, and scenic vistas.',
    cover_image:
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-10-02T08:00:00Z',
  },
  {
    id: 'cat-portraits',
    name: 'Portraits',
    slug: 'portraits',
    description: 'Studio documentary portraiture with high-contrast chiaroscuro lighting.',
    cover_image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-10-03T08:00:00Z',
  },
  {
    id: 'cat-candid',
    name: 'Candid',
    slug: 'candid',
    description: 'Unrehearsed laughter, joyful tears, and honest human emotion.',
    cover_image:
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-10-04T08:00:00Z',
  },
  {
    id: 'cat-cinematic',
    name: 'Cinematics',
    slug: 'cinematics',
    description: 'Architectural grandeur, slow-motion teasers, and timeless film frames.',
    cover_image:
      'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-10-05T08:00:00Z',
  },
  {
    id: 'cat-maternity',
    name: 'Maternity & Baby',
    slug: 'maternity-baby',
    description: 'Tender parenthood milestones and serene newborn fine-art captures.',
    cover_image:
      'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&q=80',
    created_at: '2026-10-06T08:00:00Z',
  },
];

export const INITIAL_PHOTOS: GalleryPhoto[] = [
  {
    id: 'photo-1',
    title: 'The Royal Vows',
    description: 'An intimate black-and-white moment during the sacred pheras under the mandap chandelier.',
    category: 'Weddings',
    image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80',
    is_published: true,
    featured: true,
    created_at: '2026-10-01T10:00:00Z',
  },
  {
    id: 'photo-2',
    title: 'Bridal Chiaroscuro',
    description: 'Sculptural side lighting capturing the intricate heirloom jewellery and introspective bridal grace.',
    category: 'Portraits',
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    is_published: true,
    featured: true,
    created_at: '2026-10-03T14:30:00Z',
  },
  {
    id: 'photo-3',
    title: 'Whispers at Dusk',
    description: 'Cinematic pre-wedding silhouette against ancient heritage stone arches at sunset.',
    category: 'Pre-Wedding',
    image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=80',
    is_published: true,
    featured: true,
    created_at: '2026-10-05T09:15:00Z',
  },
  {
    id: 'photo-4',
    title: 'Unscripted Laughter',
    description: 'Pure spontaneous joy during the varmala celebration as rose petals fill the air.',
    category: 'Candid',
    image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    is_published: true,
    featured: false,
    created_at: '2026-10-07T16:45:00Z',
  },
  {
    id: 'photo-5',
    title: 'Monochrome Majesty',
    description: 'The regal architecture of the palace courtyard framing the couple in high-contrast symmetry.',
    category: 'Cinematics',
    image_url: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1200&q=80',
    is_published: true,
    featured: false,
    created_at: '2026-10-09T11:20:00Z',
  },
  {
    id: 'photo-6',
    title: 'The Gaze',
    description: 'Studio documentary portrait capturing raw emotion with 85mm shallow depth of field.',
    category: 'Portraits',
    image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80',
    is_published: true,
    featured: false,
    created_at: '2026-10-10T08:00:00Z',
  },
  {
    id: 'photo-7',
    title: 'Dawn Embrace',
    description: 'Lake Pichola at 6 AM, mist over water with traditional wooden boat.',
    category: 'Pre-Wedding',
    image_url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1400&q=80',
    is_published: true,
    featured: false,
    created_at: '2026-10-11T06:30:00Z',
  },
  {
    id: 'photo-8',
    title: 'Parenthood Bliss',
    description: 'Soft warm window light capturing gentle early days.',
    category: 'Maternity & Baby',
    image_url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&q=80',
    is_published: true,
    featured: false,
    created_at: '2026-10-12T10:15:00Z',
  },
  {
    id: 'photo-9',
    title: 'Groom Preparation',
    description: 'Tying the safa in quiet anticipation before the baraat procession begins.',
    category: 'Weddings',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    is_published: false, // Draft photo
    featured: false,
    created_at: '2026-10-12T13:00:00Z',
  },
];

export const INITIAL_ENQUIRIES: ContactEnquiry[] = [
  {
    id: 'enquiry-1',
    name: 'Aarav & Rhea Sharma',
    phone: '+91 98111 22334',
    email: 'aarav.sharma@example.com',
    message:
      'Hello Mandavkar Creation team, we are planning a 3-day royal destination wedding in Udaipur this coming December. Loved your high-contrast monochrome style! Could you please share your availability and package details?',
    status: 'new',
    created_at: '2026-10-13T09:30:00Z',
  },
  {
    id: 'enquiry-2',
    name: 'Priya Desai',
    phone: '+91 98222 33445',
    email: 'priyadesai@example.com',
    message:
      'Looking for an outdoor pre-wedding cinematic shoot in Mahabaleshwar or Alibaug in November. Need guidance on wardrobe and creative direction.',
    status: 'contacted',
    notes: 'Called on Oct 13. Sent portfolio brochure over WhatsApp.',
    created_at: '2026-10-12T15:15:00Z',
  },
  {
    id: 'enquiry-3',
    name: 'Sameer Kulkarni',
    phone: '+91 98333 44556',
    email: 'sameer.k@example.com',
    message: 'Inquiring for baby milestone and family fine art portrait session in Pune studio.',
    status: 'completed',
    notes: 'Shot and delivered 20 fine art gallery prints.',
    created_at: '2026-10-10T11:00:00Z',
  },
];
