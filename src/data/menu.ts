import { MenuItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  // --- Specialty Coffee ---
  {
    id: 'c1',
    name: 'Rose Cardamom Latte',
    description: 'Double espresso pulled with organic cardamom pods, rosewater-infused velvet steamed milk, dusted with organic rose petals.',
    price: 6.5,
    category: 'coffee',
    tags: ['Signature', 'Hot or Iced'],
    imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
    isPopular: true
  },
  {
    id: 'c2',
    name: 'Kafeno Cloud Cortado',
    description: 'Equal parts velvety microfoamed oat milk and rich double espresso, crowned with a dollop of maple cold foam and orange zest.',
    price: 5.5,
    category: 'coffee',
    tags: ['Signature', 'Vegan Capable'],
    imageUrl: 'https://images.unsplash.com/photo-151097252790b-af4f902c2127?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'c3',
    name: 'Espresso Tonic No. 10',
    description: 'Fever-Tree Mediterranean tonic water, cold brew concentrate, fresh lime wheel, and a sprig of rosemary over crushed ice.',
    price: 6.0,
    category: 'coffee',
    tags: ['Iced', 'Refreshing'],
    imageUrl: 'https://images.unsplash.com/photo-1513530534585-c7b1394c6d51?auto=format&fit=crop&w=600&q=80',
    isPopular: true
  },
  {
    id: 'c4',
    name: 'Classic Flat White',
    description: 'Distinctive double ristretto shot blended with microfoamed whole milk to create a seamless, creamy velvety texture.',
    price: 4.75,
    category: 'coffee',
    tags: ['Classic'],
    imageUrl: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80'
  },

  // --- Slow Bar ---
  {
    id: 's1',
    name: 'Ethiopia Yirgacheffe V60',
    description: 'Single-origin heirloom coffee. Delicate notes of jasmine, lemon blossom, and sweet black tea with a refined, sparkling acidity.',
    price: 7.0,
    category: 'slowbar',
    tags: ['Single Origin', 'Pour-over'],
    imageUrl: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?auto=format&fit=crop&w=600&q=80',
    isPopular: true
  },
  {
    id: 's2',
    name: 'Slow-Drip Kyoto Cold Brew',
    description: 'Brewed drop-by-drop through custom handblown glass towers over 12 hours. Smooth, chocolatey body, with no bitter edge.',
    price: 6.5,
    category: 'slowbar',
    tags: ['Kyoto System', 'Limited Daily'],
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80'
  },

  // --- Artisanal Tea & Matchas ---
  {
    id: 't1',
    name: 'Ceremonial Uji Matcha Latte',
    description: 'Stone-ground green tea sourced from Uji, Kyoto, frothed with house-made vanilla bean syrup and dense steamed milk.',
    price: 6.25,
    category: 'tea',
    tags: ['Kyoto Matcha', 'Antioxidant'],
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
    isPopular: true
  },
  {
    id: 't2',
    name: 'Lavender Chamomile Fog',
    description: 'Relaxing herbal blend steep, with lavender concentrate, frothed local honey, oat milk, and dry lavender blossoms.',
    price: 5.75,
    category: 'tea',
    tags: ['Caffeine-Free', 'Calming'],
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80'
  },

  // --- Gourmet Bistro Plates ---
  {
    id: 'p1',
    name: 'Truffle & Avocado Tartine',
    description: 'Crisp artisanal sourdough slathered with Haas avocado mash, white truffle oil drizzle, organic microgreens, and a soft-poached egg.',
    price: 14.5,
    category: 'plates',
    tags: ['All-Day Brunch', 'House Special'],
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    isVegetarian: true,
    isPopular: true
  },
  {
    id: 'p2',
    name: 'Smoked Salmon & Capers Flatbread',
    description: 'Norwegian smokehouse salmon over house-made herbed labneh cream, pickled shallots, baby capers, and dill on a stone-baked base.',
    price: 16.0,
    category: 'plates',
    tags: ['Savory', 'Fresh'],
    imageUrl: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'p3',
    name: 'Brioche French Toast & Lilac',
    description: 'Thick hand-sliced sweet brioche soaked in vanilla custard, lightly pan-seared. Drizzled with lilac syrup, mascarpone whip, and summer berries.',
    price: 13.5,
    category: 'plates',
    tags: ['Sweet', 'All-Day Brunch'],
    imageUrl: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=600&q=80',
    isVegetarian: true
  },

  // --- Exquisite Pastries ---
  {
    id: 'pa1',
    name: 'Aerosmith Pistachio Croissant',
    description: 'Double-baked buttery croissant shell stuffed with dense pistachio frangipane, topped with chopped toasted Sicilian pistachios and snow sugar.',
    price: 7.25,
    category: 'pastries',
    tags: ['Artisanal', 'Nuts'],
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
    isPopular: true
  },
  {
    id: 'pa2',
    name: 'Meyer Lemon-Vanilla Tartlet',
    description: 'Velvety curd made from coastal Meyer lemons in a crisp sable shell, finished with toasted Italian meringue rosettes and vanilla bean glaze.',
    price: 6.5,
    category: 'pastries',
    tags: ['Egg-Free', 'Fruity'],
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pa3',
    name: 'Cardamom Espresso Babka',
    description: 'Braided brioche dough filled with dark chocolate cocoa ganache, espresso grinds, and fresh ground green cardamom. Baked Daily.',
    price: 5.75,
    category: 'pastries',
    tags: ['Chef Recommendation'],
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'
  }
];
