export const CATEGORIES = [
  { id: 'Electronics', name: 'Electronics', icon: 'Laptop', color: 'indigo', count: 42 },
  { id: 'ID Cards', name: 'ID Cards', icon: 'CreditCard', color: 'rose', count: 18 },
  { id: 'Keys', name: 'Keys', icon: 'Key', color: 'amber', count: 27 },
  { id: 'Bags', name: 'Bags & Backpacks', icon: 'Briefcase', color: 'purple', count: 31 },
  { id: 'Books', name: 'Books & Notes', icon: 'BookOpen', color: 'blue', count: 19 },
  { id: 'Clothing', name: 'Clothing & Wearables', icon: 'Shirt', color: 'emerald', count: 35 },
  { id: 'Accessories', name: 'Accessories & Jewelry', icon: 'Watch', color: 'pink', count: 22 },
  { id: 'Other', name: 'Other Items', icon: 'HelpCircle', color: 'slate', count: 14 }
];

export const CATEGORY_NAMES = CATEGORIES.map(c => c.name);
export const CATEGORY_IDS = CATEGORIES.map(c => c.id);
