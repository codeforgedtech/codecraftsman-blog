import { supabase } from '../../supabaseClient'; // Se till att vägen till supabaseClient är korrekt

export const fetchAdsByPlacement = async (placement: string) => {
  const { data, error } = await supabase
    .from('ads')
    .select('*')
    .eq('placement', placement);

  if (error) {
    console.error('Error fetching ads:', error);
    return [];
  }
  return data || [];
};
