/**
 * Verify the Supabase Auth API without reading or writing application data.
 * Environment variables are read at call time so dotenv has already loaded.
 */
export async function verifySupabaseConnection(): Promise<{
  connected: boolean;
  message: string;
}> {
  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const supabaseKey = process.env.SUPABASE_KEY?.trim();

  if (!supabaseUrl || !supabaseKey) {
    return {
      connected: false,
      message: 'Supabase credentials are not configured',
    };
  }

  try {
    const response = await fetch(
      `${supabaseUrl.replace(/\/+$/, '')}/auth/v1/settings`,
      {
        method: 'GET',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        signal: AbortSignal.timeout(5000),
      },
    );

    if (!response.ok) {
      return {
        connected: false,
        message: `Supabase Auth API returned HTTP ${response.status}`,
      };
    }

    return {
      connected: true,
      message: 'Supabase connected successfully',
    };
  } catch (error) {
    return {
      connected: false,
      message:
        error instanceof Error ? error.message : 'Unknown connection error',
    };
  }
}
