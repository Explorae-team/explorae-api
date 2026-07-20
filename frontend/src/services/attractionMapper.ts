import { getPublicImageUrl } from './supabase';

export interface Attraction {
  id: string;
  title: string;
  tagline: string;
  imageUrl: string;
  rating: number;
  distance: string;
  type: string;
  tags: string[];
  priceRange?: number;
  isPartner?: boolean;
}

export const mapBackendAttractionToFrontend = (item: any, defaultDistance = 'Localizando...'): Attraction => {
  const defaultTags = item.category === 'Praia' ? ['Mar', 'Verão', 'Lazer'] :
    item.category === 'Cultura' ? ['Arte', 'Museu', 'História'] :
      ['Exploração', 'Turismo', 'Aventura'];

  const rawImageUrl = item.mainImageUrl || (item.imageUrls && item.imageUrls[0]) || 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b';
  const resolvedUrl = getPublicImageUrl(rawImageUrl);
  const imageUrl = resolvedUrl && resolvedUrl.includes('unsplash.com') 
    ? `${resolvedUrl}?q=80&w=500&auto=format&fit=crop` 
    : resolvedUrl || rawImageUrl;

  return {
    id: item.id,
    title: item.name,
    tagline: item.shortDescription,
    imageUrl: imageUrl,
    rating: item.averageRating || 0.0,
    distance: item.distance || defaultDistance,
    type: item.category || 'Atração',
    tags: item.tags && item.tags.length > 0 ? item.tags : defaultTags,
    priceRange: item.priceRange || 2,
    isPartner: item.isPartner || false
  };
};
