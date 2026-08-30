/** Fixed catalogue. Prices in rupiah, formatted with Intl at the call site. */

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  was?: number;
  rating: number;
  reviews: number;
  colour: string;
  size: string[];
  condition: 'new' | 'used';
  stock: number;
  blurb: string;
}

export const products: Product[] = [
  {
    id: 'kacamata-bulat',
    name: 'Kacamata Bulat',
    brand: 'Senja',
    price: 289000,
    was: 349000,
    rating: 4.6,
    reviews: 128,
    colour: 'Emas',
    size: ['S', 'M'],
    condition: 'new',
    stock: 6,
    blurb: 'Thin metal frame, spring hinges, and a case that survives a rucksack.',
  },
  {
    id: 'topi-bucket',
    name: 'Topi Bucket Kanvas',
    brand: 'Rimba',
    price: 165000,
    rating: 4.2,
    reviews: 64,
    colour: 'Hijau',
    size: ['M', 'L'],
    condition: 'new',
    stock: 22,
    blurb: 'Heavy canvas, unlined, and it packs flat.',
  },
  {
    id: 'tas-selempang',
    name: 'Tas Selempang Harian',
    brand: 'Senja',
    price: 420000,
    rating: 4.8,
    reviews: 311,
    colour: 'Hitam',
    size: ['M'],
    condition: 'new',
    stock: 3,
    blurb: 'Two compartments, one of them padded for a 13-inch laptop.',
  },
  {
    id: 'sepatu-kanvas',
    name: 'Sepatu Kanvas Rendah',
    brand: 'Langkah',
    price: 535000,
    was: 640000,
    rating: 4.4,
    reviews: 92,
    colour: 'Putih',
    size: ['S', 'M', 'L'],
    condition: 'new',
    stock: 11,
    blurb: 'Vulcanised sole, cotton laces, and a toe box that is actually wide.',
  },
  {
    id: 'jaket-denim',
    name: 'Jaket Denim Klasik',
    brand: 'Rimba',
    price: 725000,
    rating: 4.1,
    reviews: 47,
    colour: 'Biru',
    size: ['M', 'L', 'XL'],
    condition: 'used',
    stock: 1,
    blurb: 'Rigid denim, unwashed, and it will fade exactly where you bend.',
  },
  {
    id: 'kaos-polos',
    name: 'Kaos Polos Katun',
    brand: 'Langkah',
    price: 119000,
    rating: 4.0,
    reviews: 508,
    colour: 'Putih',
    size: ['S', 'M', 'L', 'XL'],
    condition: 'new',
    stock: 84,
    blurb: 'Combed cotton, side-seamed, and it does not twist in the wash.',
  },
  {
    id: 'celana-kargo',
    name: 'Celana Kargo',
    brand: 'Rimba',
    price: 389000,
    rating: 3.9,
    reviews: 73,
    colour: 'Krem',
    size: ['M', 'L'],
    condition: 'new',
    stock: 9,
    blurb: 'Six pockets, and two of them fit a phone the right way up.',
  },
  {
    id: 'dompet-kulit',
    name: 'Dompet Kulit Lipat',
    brand: 'Senja',
    price: 245000,
    rating: 4.7,
    reviews: 154,
    colour: 'Cokelat',
    size: ['M'],
    condition: 'new',
    stock: 17,
    blurb: 'Vegetable-tanned, four card slots, and no coin pocket on purpose.',
  },
  {
    id: 'syal-rajut',
    name: 'Syal Rajut',
    brand: 'Langkah',
    price: 179000,
    rating: 4.3,
    reviews: 38,
    colour: 'Merah',
    size: ['M'],
    condition: 'used',
    stock: 4,
    blurb: 'Lambswool, ribbed, and long enough to actually wrap twice.',
  },
];

export const colours = ['Emas', 'Hijau', 'Hitam', 'Putih', 'Biru', 'Krem', 'Cokelat', 'Merah'];
export const brands = ['Senja', 'Rimba', 'Langkah'];
export const sizes = ['S', 'M', 'L', 'XL'];

export const rupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
