import { supabase } from '@/integrations/supabase/client';

export const debugDatabaseConnection = async () => {
  try {
    console.log('🔍 Testing Supabase connection...');

    // Test basic connection with a simple query
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Database connection failed:', error);
      return { success: false, error };
    }

    console.log('✅ Database connection successful');
    return { success: true, data };
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return { success: false, error };
  }
};

export const debugUserAuthentication = async () => {
  try {
    console.log('🔍 Testing user authentication...');

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('❌ Authentication check failed:', error);
      return { success: false, error };
    }

    if (user) {
      console.log('✅ User authenticated:', user.email);
      return { success: true, user };
    } else {
      console.log('⚠️ No authenticated user');
      return { success: true, user: null };
    }
  } catch (error) {
    console.error('❌ Authentication test failed:', error);
    return { success: false, error };
  }
};

export const debugTableStructure = async (tableName: string) => {
  try {
    console.log(`🔍 Checking table structure for: ${tableName}`);

    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (error) {
      console.error(`❌ Table ${tableName} check failed:`, error);
      return { success: false, error };
    }

    const columns = Object.keys(data[0] || {});
    console.log(`✅ Table ${tableName} structure:`, columns);
    return { success: true, columns };
  } catch (error) {
    console.error(`❌ Table structure check failed:`, error);
    return { success: false, error };
  }
};

export const validateRequiredTables = async () => {
  const requiredTables = [
    'profiles',
    'companies',
    'policies',
    'sales_processes',
    'leads',
    'claims',
    'commissions',
    'invoices',
    'documents'
  ];

  const results: { [key: string]: { exists: boolean; error?: any } } = {};

  for (const table of requiredTables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('count')
        .limit(1);

      results[table] = { exists: !error };
      if (error) {
        results[table].error = error;
      }
    } catch (error) {
      results[table] = { exists: false, error };
    }
  }

  return results;
};

export const getDatabaseInfo = async () => {
  try {
    console.log('🔍 Getting database information...');

    const connectionTest = await debugDatabaseConnection();
    const authTest = await debugUserAuthentication();
    const tableValidation = await validateRequiredTables();

    return {
      connection: connectionTest,
      authentication: authTest,
      tables: tableValidation,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Database info retrieval failed:', error);
    return { error };
  }
};