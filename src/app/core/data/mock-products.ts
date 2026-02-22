import { Product } from '../models/product.model';

const d = (daysAgo: number) => new Date(Date.now() - daysAgo * 86400000);

export const MOCK_PRODUCTS: Product[] = [
  // Lumber & Boards
  { id: 'p-1',  name: 'Pine Board 2x4x8', description: 'Standard pine lumber board, 8 feet', categoryId: 'cat-1', sku: 'LUM-PIN-248', unit: 'piece', currentStock: 120, minimumStock: 30, unitPrice: 5.50, location: 'Aisle A-1', createdAt: d(90), updatedAt: d(2) },
  { id: 'p-2',  name: 'Oak Plywood Sheet 4x8', description: 'Red oak veneer plywood, 3/4 inch', categoryId: 'cat-1', sku: 'LUM-OAK-PLY', unit: 'sheet', currentStock: 15, minimumStock: 10, unitPrice: 62.00, location: 'Aisle A-2', createdAt: d(90), updatedAt: d(5) },
  { id: 'p-3',  name: 'MDF Panel 4x8', description: 'Medium density fiberboard, 1/2 inch', categoryId: 'cat-1', sku: 'LUM-MDF-48', unit: 'sheet', currentStock: 25, minimumStock: 15, unitPrice: 35.00, location: 'Aisle A-2', createdAt: d(80), updatedAt: d(3) },
  { id: 'p-4',  name: 'Cedar Plank 1x6x8', description: 'Western red cedar, ideal for outdoor furniture', categoryId: 'cat-1', sku: 'LUM-CED-168', unit: 'piece', currentStock: 45, minimumStock: 20, unitPrice: 12.75, location: 'Aisle A-3', createdAt: d(75), updatedAt: d(7) },
  { id: 'p-5',  name: 'Walnut Board 1x8x6', description: 'Black walnut hardwood, premium grade', categoryId: 'cat-1', sku: 'LUM-WAL-186', unit: 'piece', currentStock: 8, minimumStock: 10, unitPrice: 42.00, location: 'Aisle A-4', createdAt: d(60), updatedAt: d(1) },
  { id: 'p-6',  name: 'Birch Plywood 4x8', description: 'Baltic birch plywood, 3/4 inch', categoryId: 'cat-1', sku: 'LUM-BIR-PLY', unit: 'sheet', currentStock: 18, minimumStock: 8, unitPrice: 55.00, location: 'Aisle A-2', createdAt: d(70), updatedAt: d(10) },
  { id: 'p-7',  name: 'Poplar Board 1x4x8', description: 'Tulip poplar, good for painting', categoryId: 'cat-1', sku: 'LUM-POP-148', unit: 'piece', currentStock: 60, minimumStock: 25, unitPrice: 7.25, location: 'Aisle A-1', createdAt: d(85), updatedAt: d(4) },
  { id: 'p-8',  name: 'Maple Hardwood 1x6x8', description: 'Hard maple, excellent for tabletops', categoryId: 'cat-1', sku: 'LUM-MAP-168', unit: 'piece', currentStock: 3, minimumStock: 12, unitPrice: 38.00, location: 'Aisle A-4', createdAt: d(50), updatedAt: d(1) },

  // Hardware & Fasteners
  { id: 'p-9',  name: 'Wood Screws #8 1.5"', description: 'Phillips head, zinc-coated, box of 100', categoryId: 'cat-2', sku: 'HDW-SCR-815', unit: 'box', currentStock: 35, minimumStock: 15, unitPrice: 8.50, location: 'Aisle B-1', createdAt: d(90), updatedAt: d(6) },
  { id: 'p-10', name: 'Finishing Nails 2"', description: 'Brad nails, 18 gauge, box of 500', categoryId: 'cat-2', sku: 'HDW-NAI-200', unit: 'box', currentStock: 20, minimumStock: 10, unitPrice: 12.00, location: 'Aisle B-1', createdAt: d(85), updatedAt: d(8) },
  { id: 'p-11', name: 'Cabinet Hinges (Pair)', description: 'Soft-close concealed hinges, nickel finish', categoryId: 'cat-2', sku: 'HDW-HNG-CAB', unit: 'piece', currentStock: 50, minimumStock: 20, unitPrice: 6.75, location: 'Aisle B-2', createdAt: d(70), updatedAt: d(5) },
  { id: 'p-12', name: 'Drawer Slides 18"', description: 'Full-extension ball bearing slides, pair', categoryId: 'cat-2', sku: 'HDW-SLD-18', unit: 'piece', currentStock: 2, minimumStock: 10, unitPrice: 14.50, location: 'Aisle B-2', createdAt: d(65), updatedAt: d(1) },
  { id: 'p-13', name: 'Wood Dowels 3/8" Pack', description: 'Fluted birch dowels, pack of 50', categoryId: 'cat-2', sku: 'HDW-DOW-38', unit: 'piece', currentStock: 30, minimumStock: 12, unitPrice: 5.25, location: 'Aisle B-3', createdAt: d(80), updatedAt: d(12) },
  { id: 'p-14', name: 'Corner Brackets L-Shape', description: 'Steel L-brackets, 2 inch, pack of 20', categoryId: 'cat-2', sku: 'HDW-BRK-LSH', unit: 'piece', currentStock: 15, minimumStock: 8, unitPrice: 9.00, location: 'Aisle B-3', createdAt: d(60), updatedAt: d(9) },
  { id: 'p-15', name: 'Door Knobs Oak', description: 'Solid oak round door knobs', categoryId: 'cat-2', sku: 'HDW-KNB-OAK', unit: 'piece', currentStock: 40, minimumStock: 15, unitPrice: 4.50, location: 'Aisle B-4', createdAt: d(55), updatedAt: d(7) },

  // Finishes & Coatings
  { id: 'p-16', name: 'Polyurethane Varnish 1qt', description: 'Oil-based clear satin finish', categoryId: 'cat-3', sku: 'FIN-VAR-PU1', unit: 'piece', currentStock: 12, minimumStock: 6, unitPrice: 18.50, location: 'Aisle C-1', createdAt: d(60), updatedAt: d(4) },
  { id: 'p-17', name: 'Wood Stain Walnut 1qt', description: 'Oil-based interior wood stain', categoryId: 'cat-3', sku: 'FIN-STN-WAL', unit: 'piece', currentStock: 8, minimumStock: 5, unitPrice: 14.00, location: 'Aisle C-1', createdAt: d(55), updatedAt: d(6) },
  { id: 'p-18', name: 'White Latex Paint 1gal', description: 'Interior/exterior semi-gloss latex', categoryId: 'cat-3', sku: 'FIN-PNT-WHT', unit: 'piece', currentStock: 6, minimumStock: 4, unitPrice: 32.00, location: 'Aisle C-2', createdAt: d(45), updatedAt: d(3) },
  { id: 'p-19', name: 'Tung Oil Finish 16oz', description: 'Natural pure tung oil for wood protection', categoryId: 'cat-3', sku: 'FIN-OIL-TNG', unit: 'piece', currentStock: 0, minimumStock: 4, unitPrice: 22.00, location: 'Aisle C-1', createdAt: d(40), updatedAt: d(1) },
  { id: 'p-20', name: 'Spray Lacquer Clear 12oz', description: 'Fast-drying nitrocellulose lacquer', categoryId: 'cat-3', sku: 'FIN-LAC-CLR', unit: 'piece', currentStock: 10, minimumStock: 6, unitPrice: 9.75, location: 'Aisle C-2', createdAt: d(50), updatedAt: d(8) },

  // Adhesives & Sealants
  { id: 'p-21', name: 'Wood Glue PVA 16oz', description: 'Titebond original wood glue', categoryId: 'cat-4', sku: 'ADH-GLU-PVA', unit: 'piece', currentStock: 18, minimumStock: 8, unitPrice: 7.50, location: 'Aisle C-3', createdAt: d(70), updatedAt: d(5) },
  { id: 'p-22', name: 'Epoxy Adhesive Kit', description: '2-part epoxy, 5-minute cure, 8oz', categoryId: 'cat-4', sku: 'ADH-EPX-5MN', unit: 'piece', currentStock: 5, minimumStock: 3, unitPrice: 12.50, location: 'Aisle C-3', createdAt: d(55), updatedAt: d(10) },
  { id: 'p-23', name: 'Contact Cement 1qt', description: 'Solvent-based contact adhesive for laminates', categoryId: 'cat-4', sku: 'ADH-CNT-1QT', unit: 'piece', currentStock: 4, minimumStock: 3, unitPrice: 15.00, location: 'Aisle C-3', createdAt: d(40), updatedAt: d(6) },

  // Tools & Accessories
  { id: 'p-24', name: 'Circular Saw Blade 10"', description: '60-tooth carbide tipped crosscut blade', categoryId: 'cat-5', sku: 'TLS-BLD-C10', unit: 'piece', currentStock: 4, minimumStock: 2, unitPrice: 35.00, location: 'Aisle D-1', createdAt: d(60), updatedAt: d(15) },
  { id: 'p-25', name: 'Sandpaper 80-Grit Pack', description: '9x11 aluminum oxide sheets, pack of 25', categoryId: 'cat-5', sku: 'TLS-SND-080', unit: 'piece', currentStock: 14, minimumStock: 5, unitPrice: 11.00, location: 'Aisle D-2', createdAt: d(50), updatedAt: d(3) },
  { id: 'p-26', name: 'Sandpaper 220-Grit Pack', description: '9x11 fine grit sheets, pack of 25', categoryId: 'cat-5', sku: 'TLS-SND-220', unit: 'piece', currentStock: 10, minimumStock: 5, unitPrice: 12.50, location: 'Aisle D-2', createdAt: d(50), updatedAt: d(4) },
  { id: 'p-27', name: 'Bar Clamps 24"', description: 'Quick-release F-style bar clamps', categoryId: 'cat-5', sku: 'TLS-CLP-24', unit: 'piece', currentStock: 8, minimumStock: 4, unitPrice: 18.00, location: 'Aisle D-3', createdAt: d(45), updatedAt: d(20) },
  { id: 'p-28', name: 'Router Bits Set (15pc)', description: 'Carbide tipped router bit set, 1/4" shank', categoryId: 'cat-5', sku: 'TLS-RTR-15S', unit: 'piece', currentStock: 1, minimumStock: 2, unitPrice: 45.00, location: 'Aisle D-1', createdAt: d(30), updatedAt: d(2) },

  // Finished Products
  { id: 'p-29', name: 'Custom Bookshelf Oak', description: '5-shelf bookshelf in red oak, 72"H x 36"W', categoryId: 'cat-6', sku: 'FIN-BSH-OAK', unit: 'piece', currentStock: 2, minimumStock: 1, unitPrice: 450.00, location: 'Showroom', createdAt: d(20), updatedAt: d(5) },
  { id: 'p-30', name: 'Dining Table Walnut 6ft', description: 'Solid walnut dining table, seats 6', categoryId: 'cat-6', sku: 'FIN-DTB-WAL', unit: 'piece', currentStock: 1, minimumStock: 1, unitPrice: 1200.00, location: 'Showroom', createdAt: d(15), updatedAt: d(3) },
  { id: 'p-31', name: 'Kitchen Cabinet Set', description: 'Maple kitchen cabinet set, 10 pieces', categoryId: 'cat-6', sku: 'FIN-KCB-MAP', unit: 'piece', currentStock: 0, minimumStock: 1, unitPrice: 2800.00, location: 'Workshop', createdAt: d(10), updatedAt: d(1) },
  { id: 'p-32', name: 'Floating Shelves Set (3)', description: 'Pine floating wall shelves, 24" each', categoryId: 'cat-6', sku: 'FIN-FSH-PIN', unit: 'piece', currentStock: 5, minimumStock: 2, unitPrice: 85.00, location: 'Showroom', createdAt: d(25), updatedAt: d(8) },
];
