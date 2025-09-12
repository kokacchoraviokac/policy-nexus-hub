# Database Integration Plan

## 🎯 Overview

This document outlines the database schema mismatches identified during debugging and provides a plan for resolving them when transitioning from mock data to real database integration.

## 🔍 Identified Schema Mismatches

### 1. Activity Logs (Audit Trail) Issues

**File**: [`src/hooks/useAuditTrail.ts:117`](../src/hooks/useAuditTrail.ts:117)

**Issue**: Manual `created_at` insertion conflicts with auto-generated timestamps
```typescript
// Current problematic code:
.insert({
  // ... other fields
  created_at: new Date().toISOString()  // ❌ Should be auto-generated
})
```

**Database Schema**: 
```sql
-- activity_logs table has created_at with default value
created_at: string (auto-generated)
```

**Solution**: Remove manual `created_at` insertion
```typescript
// Fixed code:
.insert({
  action,
  entity_type,
  entity_id,
  user_id: user.id,
  company_id,
  details,
  // ✅ Remove created_at - let database handle it
})
```

### 2. Missing Fields in Audit Trail Interface

**File**: [`src/hooks/useAuditTrail.ts:14-15`](../src/hooks/useAuditTrail.ts:14)

**Issue**: Interface defines fields not used in database insert
```typescript
// Interface defines these fields:
ip_address?: string;
user_agent?: string;

// But they're not inserted into database
```

**Solution**: Either add fields to insert or remove from interface

### 3. Invoice Creation Schema Mismatch

**File**: [`src/hooks/finances/useInvoiceMutations.ts:62-66`](../src/hooks/finances/useInvoiceMutations.ts:62)

**Issue**: Missing database fields in invoice creation
```typescript
// Current code missing:
invoice_type: params.invoice_type,           // ❌ Not in database schema
invoice_category: params.invoice_category,   // ❌ Not in database schema
calculation_reference: params.calculation_reference, // ❌ Not in database schema
```

**Database Schema Check Needed**: Verify if these fields exist in `invoices` table

## 🛠️ Resolution Plan

### Phase 1: Audit Trail Fixes (High Priority)
1. **Remove Manual Timestamps**
   - Update [`useAuditTrail.ts`](../src/hooks/useAuditTrail.ts) to remove `created_at` insertion
   - Let database handle timestamp generation

2. **Add Missing Fields or Clean Interface**
   - Either implement `ip_address` and `user_agent` tracking
   - Or remove from interface if not needed

### Phase 2: Invoice Schema Validation (Medium Priority)
1. **Verify Database Schema**
   - Check if `invoice_type`, `invoice_category`, `calculation_reference` exist
   - Add fields to database if needed, or remove from code

2. **Update Type Definitions**
   - Ensure TypeScript types match actual database schema
   - Update [`src/integrations/supabase/types.ts`](../src/integrations/supabase/types.ts) if needed

### Phase 3: Document Management Schema (Low Priority)
1. **EntityType Consistency**
   - Resolve import conflicts between [`documents.ts`](../src/utils/documents.ts) and [`documentUploadUtils.ts`](../src/utils/documentUploadUtils.ts)
   - Ensure all document tables support required entity types

## 🔧 Implementation Steps

### Step 1: Fix Audit Trail (Ready to implement)
```typescript
// In useAuditTrail.ts, replace:
const { data, error } = await supabase
  .from('activity_logs')
  .insert({
    action,
    entity_type,
    entity_id,
    user_id: user.id,
    company_id,
    details,
    // ✅ Remove this line:
    // created_at: new Date().toISOString()
  })
  .select()
  .single();
```

### Step 2: Validate Invoice Schema
```sql
-- Check if these columns exist in invoices table:
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'invoices' 
AND column_name IN ('invoice_type', 'invoice_category', 'calculation_reference');
```

### Step 3: Test Database Integration
1. **Mock Data Transition**: Gradually replace mock data with real database calls
2. **Schema Validation**: Ensure all inserts/updates match database schema
3. **Error Handling**: Add proper error handling for schema mismatches

## 📊 Current Status

- **Mock Data**: ✅ Intentionally used for development
- **Schema Analysis**: ✅ Completed
- **Issues Identified**: ✅ 3 main categories documented
- **Resolution Plan**: ✅ Created with priorities
- **Ready for Implementation**: ✅ When transitioning from mock data

## 🚨 Critical Notes

1. **Don't Fix Yet**: These issues should be addressed during database integration phase
2. **Mock Data Strategy**: Current mock data approach is intentional and working
3. **TypeScript Compatibility**: All fixes maintain current TypeScript strict mode
4. **Zero Breaking Changes**: All fixes are backward compatible

## 📅 Timeline

- **Phase 1**: During database integration sprint
- **Phase 2**: After database schema finalization  
- **Phase 3**: During production preparation

---

**Last Updated**: January 2025  
**Status**: Ready for Database Integration Phase  
**Owner**: PolicyHub Development Team