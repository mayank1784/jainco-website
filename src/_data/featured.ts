// featuredProductsData.ts
export interface Product {
    id: string;
    name: string;
    image: string;
    description: string;
    category: string;
  }
  
  export const featuredProducts: Product[] = [
    // Living Room Category
    {
      id: "lv-001",
      name: "Modern Velvet Sofa",
      image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
      description: "Luxurious velvet upholstery with gold-finished legs",
      category: "Living Room"
    },
    {
      id: "lv-002",
      name: "Contemporary Coffee Table",
      image: "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg",
      description: "Minimalist marble top with brass accents",
      category: "Living Room"
    },
    {
      id: "lv-003",
      name: "Geometric Wall Art",
      image: "https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg",
      description: "Abstract geometric patterns in metallic finish",
      category: "Living Room"
    },
    {
      id: "lv-004",
      name: "Designer Floor Lamp",
      image: "https://images.pexels.com/photos/1571461/pexels-photo-1571461.jpeg",
      description: "Architectural lighting with adjustable arm",
      category: "Living Room"
    },
    {
      id: "lv-005",
      name: "Accent Armchair",
      image: "https://images.pexels.com/photos/1571452/pexels-photo-1571452.jpeg",
      description: "Mid-century modern design in premium leather",
      category: "Living Room"
    },
  
    // Dining Room Category
    {
      id: "dr-001",
      name: "Executive Dining Table",
      image: "https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg",
      description: "Solid wood with tempered glass top",
      category: "Dining Room"
    },
    {
      id: "dr-002",
      name: "Designer Dining Chairs",
      image: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg",
      description: "Ergonomic design with premium upholstery",
      category: "Dining Room"
    },
    {
      id: "dr-003",
      name: "Crystal Chandelier",
      image: "https://images.pexels.com/photos/1080692/pexels-photo-1080692.jpeg",
      description: "Hand-cut crystal with chrome finish",
      category: "Dining Room"
    },
    {
      id: "dr-004",
      name: "Buffet Cabinet",
      image: "https://images.pexels.com/photos/1080724/pexels-photo-1080724.jpeg",
      description: "Contemporary storage with artistic inlays",
      category: "Dining Room"
    },
    {
      id: "dr-005",
      name: "Wall Mirror Set",
      image: "https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg",
      description: "Geometric mirrors with gold frames",
      category: "Dining Room"
    },
  
    // Office Category
    {
      id: "of-001",
      name: "Executive Desk",
      image: "https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg",
      description: "Premium workspace solution with storage",
      category: "Office"
    },
    {
      id: "of-002",
      name: "Ergonomic Chair",
      image: "https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg",
      description: "Full adjustable with premium leather",
      category: "Office"
    },
    {
      id: "of-003",
      name: "Bookshelf System",
      image: "https://images.pexels.com/photos/1957479/pexels-photo-1957479.jpeg",
      description: "Modular design with adjustable shelves",
      category: "Office"
    },
    {
      id: "of-004",
      name: "Task Lighting",
      image: "https://images.pexels.com/photos/1957476/pexels-photo-1957476.jpeg",
      description: "LED technology with multiple settings",
      category: "Office"
    },
    {
      id: "of-005",
      name: "Filing Cabinet",
      image: "https://images.pexels.com/photos/1957475/pexels-photo-1957475.jpeg",
      description: "Modern storage with biometric lock",
      category: "Office"
    }
  ];
  
  export default featuredProducts;