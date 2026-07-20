import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_KEY || 'placeholder-key';

if (!process.env.EXPO_PUBLIC_SUPABASE_URL || !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('Supabase configuration missing in .env file, using placeholders');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Gera a URL pública para uma imagem no bucket do Supabase
 * @param path Caminho relativo da imagem (ex: 'attractions/cristo.jpg')
 * @param bucket Nome do bucket (padrão: 'explorae-images')
 */
export const getPublicImageUrl = (path: string, bucket: string = 'explorae-images') => {
  if (!path) return null;
  
  // Se já for uma URL completa, retorna ela mesma
  if (path.startsWith('http')) return path;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};
