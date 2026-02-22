import { Category } from '../models/category.model';

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Lumber & Boards', description: 'Raw wood boards, plywood, MDF panels', color: '#8B5E3C', productCount: 8 },
  { id: 'cat-2', name: 'Hardware & Fasteners', description: 'Screws, nails, bolts, hinges, drawer slides', color: '#6B7280', productCount: 7 },
  { id: 'cat-3', name: 'Finishes & Coatings', description: 'Varnish, paint, stain, lacquer, sealers', color: '#F59E0B', productCount: 5 },
  { id: 'cat-4', name: 'Adhesives & Sealants', description: 'Wood glue, silicone, epoxy, contact cement', color: '#10B981', productCount: 3 },
  { id: 'cat-5', name: 'Tools & Accessories', description: 'Saw blades, sandpaper, drill bits, clamps', color: '#3B82F6', productCount: 5 },
  { id: 'cat-6', name: 'Finished Products', description: 'Completed furniture and custom pieces', color: '#8B5CF6', productCount: 4 },
];
