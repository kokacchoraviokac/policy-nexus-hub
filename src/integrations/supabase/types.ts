export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          company_id: string
          created_at: string
          details: Json | null
          entity_id: string
          entity_type: string
          id: string
          user_id: string
        }
        Insert: {
          action: string
          company_id: string
          created_at?: string
          details?: Json | null
          entity_id: string
          entity_type: string
          id?: string
          user_id: string
        }
        Update: {
          action?: string
          company_id?: string
          created_at?: string
          details?: Json | null
          entity_id?: string
          entity_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      agent_payouts: {
        Row: {
          agent_id: string
          calculated_by: string
          company_id: string
          created_at: string
          id: string
          payment_date: string | null
          payment_reference: string | null
          period_end: string
          period_start: string
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          agent_id: string
          calculated_by: string
          company_id: string
          created_at?: string
          id?: string
          payment_date?: string | null
          payment_reference?: string | null
          period_end: string
          period_start: string
          status: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          agent_id?: string
          calculated_by?: string
          company_id?: string
          created_at?: string
          id?: string
          payment_date?: string | null
          payment_reference?: string | null
          period_end?: string
          period_start?: string
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_payouts_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_payouts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          bank_account: string | null
          company_id: string
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          status: string
          tax_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          bank_account?: string | null
          company_id: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          status: string
          tax_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          bank_account?: string | null
          company_id?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          status?: string
          tax_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_statements: {
        Row: {
          account_number: string
          bank_name: string
          company_id: string
          created_at: string
          ending_balance: number
          file_path: string | null
          id: string
          processed_by: string | null
          starting_balance: number
          statement_date: string
          status: string
          updated_at: string
        }
        Insert: {
          account_number: string
          bank_name: string
          company_id: string
          created_at?: string
          ending_balance: number
          file_path?: string | null
          id?: string
          processed_by?: string | null
          starting_balance: number
          statement_date: string
          status: string
          updated_at?: string
        }
        Update: {
          account_number?: string
          bank_name?: string
          company_id?: string
          created_at?: string
          ending_balance?: number
          file_path?: string | null
          id?: string
          processed_by?: string | null
          starting_balance?: number
          statement_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_statements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_transactions: {
        Row: {
          amount: number
          company_id: string
          created_at: string
          description: string
          id: string
          matched_at: string | null
          matched_by: string | null
          matched_invoice_id: string | null
          matched_policy_id: string | null
          reference: string | null
          statement_id: string
          status: string
          transaction_date: string
          updated_at: string
        }
        Insert: {
          amount: number
          company_id: string
          created_at?: string
          description: string
          id?: string
          matched_at?: string | null
          matched_by?: string | null
          matched_invoice_id?: string | null
          matched_policy_id?: string | null
          reference?: string | null
          statement_id: string
          status: string
          transaction_date: string
          updated_at?: string
        }
        Update: {
          amount?: number
          company_id?: string
          created_at?: string
          description?: string
          id?: string
          matched_at?: string | null
          matched_by?: string | null
          matched_invoice_id?: string | null
          matched_policy_id?: string | null
          reference?: string | null
          statement_id?: string
          status?: string
          transaction_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_transactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_transactions_matched_invoice_id_fkey"
            columns: ["matched_invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_transactions_matched_policy_id_fkey"
            columns: ["matched_policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_transactions_statement_id_fkey"
            columns: ["statement_id"]
            isOneToOne: false
            referencedRelation: "bank_statements"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_documents: {
        Row: {
          claim_id: string
          company_id: string
          created_at: string
          document_name: string
          document_type: string
          file_path: string
          id: string
          updated_at: string
          uploaded_by: string
        }
        Insert: {
          claim_id: string
          company_id: string
          created_at?: string
          document_name: string
          document_type: string
          file_path: string
          id?: string
          updated_at?: string
          uploaded_by: string
        }
        Update: {
          claim_id?: string
          company_id?: string
          created_at?: string
          document_name?: string
          document_type?: string
          file_path?: string
          id?: string
          updated_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "claim_documents_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claim_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      claims: {
        Row: {
          approved_amount: number | null
          assigned_to: string | null
          claim_number: string
          claimed_amount: number
          company_id: string
          created_at: string
          damage_description: string
          id: string
          incident_date: string
          incident_location: string | null
          policy_id: string
          reported_by: string
          status: string
          updated_at: string
        }
        Insert: {
          approved_amount?: number | null
          assigned_to?: string | null
          claim_number: string
          claimed_amount: number
          company_id: string
          created_at?: string
          damage_description: string
          id?: string
          incident_date: string
          incident_location?: string | null
          policy_id: string
          reported_by: string
          status: string
          updated_at?: string
        }
        Update: {
          approved_amount?: number | null
          assigned_to?: string | null
          claim_number?: string
          claimed_amount?: number
          company_id?: string
          created_at?: string
          damage_description?: string
          id?: string
          incident_date?: string
          incident_location?: string | null
          policy_id?: string
          reported_by?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "claims_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claims_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      client_commissions: {
        Row: {
          agent_id: string
          client_id: string
          company_id: string
          created_at: string
          created_by: string
          effective_from: string
          effective_to: string | null
          id: string
          rate: number
          updated_at: string
        }
        Insert: {
          agent_id: string
          client_id: string
          company_id: string
          created_at?: string
          created_by: string
          effective_from: string
          effective_to?: string | null
          id?: string
          rate: number
          updated_at?: string
        }
        Update: {
          agent_id?: string
          client_id?: string
          company_id?: string
          created_at?: string
          created_by?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          rate?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_commissions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_commissions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_commissions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          city: string | null
          company_id: string
          contact_person: string | null
          country: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          name: string
          notes: string | null
          phone: string | null
          postal_code: string | null
          registration_number: string | null
          tax_id: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_id: string
          contact_person?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          registration_number?: string | null
          tax_id?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          company_id?: string
          contact_person?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          registration_number?: string | null
          tax_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          base_amount: number
          calculated_amount: number
          company_id: string
          created_at: string
          id: string
          paid_amount: number | null
          payment_date: string | null
          policy_id: string
          rate: number
          status: string
          updated_at: string
        }
        Insert: {
          base_amount: number
          calculated_amount: number
          company_id: string
          created_at?: string
          id?: string
          paid_amount?: number | null
          payment_date?: string | null
          policy_id: string
          rate: number
          status: string
          updated_at?: string
        }
        Update: {
          base_amount?: number
          calculated_amount?: number
          company_id?: string
          created_at?: string
          id?: string
          paid_amount?: number | null
          payment_date?: string | null
          policy_id?: string
          rate?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string
          id: string
          name: string
          phone: string | null
          postal_code: string | null
          registration_number: string | null
          seats_limit: number
          tax_id: string | null
          updated_at: string
          used_seats: number
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          name: string
          phone?: string | null
          postal_code?: string | null
          registration_number?: string | null
          seats_limit?: number
          tax_id?: string | null
          updated_at?: string
          used_seats?: number
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
          postal_code?: string | null
          registration_number?: string | null
          seats_limit?: number
          tax_id?: string | null
          updated_at?: string
          used_seats?: number
        }
        Relationships: []
      }
      company_email_settings: {
        Row: {
          company_id: string
          created_at: string
          default_bcc: string | null
          email_signature: string | null
          from_email: string | null
          from_name: string | null
          id: string
          smtp_password: string | null
          smtp_port: number | null
          smtp_server: string | null
          smtp_use_ssl: boolean | null
          smtp_username: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          default_bcc?: string | null
          email_signature?: string | null
          from_email?: string | null
          from_name?: string | null
          id?: string
          smtp_password?: string | null
          smtp_port?: number | null
          smtp_server?: string | null
          smtp_use_ssl?: boolean | null
          smtp_username?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          default_bcc?: string | null
          email_signature?: string | null
          from_email?: string | null
          from_name?: string | null
          id?: string
          smtp_password?: string | null
          smtp_port?: number | null
          smtp_server?: string | null
          smtp_use_ssl?: boolean | null
          smtp_username?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_email_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_settings: {
        Row: {
          company_id: string
          created_at: string
          date_format: string
          default_currency: string
          default_language: string
          enable_notifications: boolean
          fiscal_year_start: string
          id: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          date_format?: string
          default_currency?: string
          default_language?: string
          enable_notifications?: boolean
          fiscal_year_start?: string
          id?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          date_format?: string
          default_currency?: string
          default_language?: string
          enable_notifications?: boolean
          fiscal_year_start?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      fixed_commissions: {
        Row: {
          agent_id: string
          company_id: string
          created_at: string
          created_by: string
          effective_from: string
          effective_to: string | null
          id: string
          rate: number
          updated_at: string
        }
        Insert: {
          agent_id: string
          company_id: string
          created_at?: string
          created_by: string
          effective_from: string
          effective_to?: string | null
          id?: string
          rate: number
          updated_at?: string
        }
        Update: {
          agent_id?: string
          company_id?: string
          created_at?: string
          created_by?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          rate?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fixed_commissions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fixed_commissions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      instructions: {
        Row: {
          company_id: string
          content: string
          created_at: string
          created_by: string
          id: string
          module: string
          title: string
          updated_at: string
        }
        Insert: {
          company_id: string
          content: string
          created_at?: string
          created_by: string
          id?: string
          module: string
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          module?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "instructions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_products: {
        Row: {
          category: string | null
          code: string
          company_id: string
          created_at: string
          description: string | null
          id: string
          insurer_id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          code: string
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          insurer_id: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          code?: string
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          insurer_id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "insurance_products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_products_insurer_id_fkey"
            columns: ["insurer_id"]
            isOneToOne: false
            referencedRelation: "insurers"
            referencedColumns: ["id"]
          },
        ]
      }
      insurers: {
        Row: {
          address: string | null
          city: string | null
          company_id: string
          contact_person: string | null
          country: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          name: string
          phone: string | null
          postal_code: string | null
          registration_number: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_id: string
          contact_person?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          postal_code?: string | null
          registration_number?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          company_id?: string
          contact_person?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          postal_code?: string | null
          registration_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "insurers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          company_id: string | null
          created_at: string
          created_by: string | null
          email: string
          expires_at: string
          id: string
          role: string
          status: string
          token: string
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          email: string
          expires_at: string
          id?: string
          role: string
          status?: string
          token: string
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          email?: string
          expires_at?: string
          id?: string
          role?: string
          status?: string
          token?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          amount: number
          commission_id: string | null
          created_at: string
          description: string
          id: string
          invoice_id: string
          policy_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          commission_id?: string | null
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          policy_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          commission_id?: string | null
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          policy_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_commission_id_fkey"
            columns: ["commission_id"]
            isOneToOne: false
            referencedRelation: "commissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          company_id: string
          created_at: string
          currency: string
          due_date: string
          entity_id: string | null
          entity_name: string
          entity_type: string | null
          id: string
          invoice_number: string
          issue_date: string
          notes: string | null
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          currency?: string
          due_date: string
          entity_id?: string | null
          entity_name: string
          entity_type?: string | null
          id?: string
          invoice_number: string
          issue_date: string
          notes?: string | null
          status: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          currency?: string
          due_date?: string
          entity_id?: string | null
          entity_name?: string
          entity_type?: string | null
          id?: string
          invoice_number?: string
          issue_date?: string
          notes?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          company_id: string
          company_name: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          source: string | null
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          company_id: string
          company_name?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          company_id?: string
          company_name?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      manual_commissions: {
        Row: {
          agent_id: string
          company_id: string
          created_at: string
          created_by: string
          id: string
          justification: string | null
          policy_id: string
          rate: number
          updated_at: string
        }
        Insert: {
          agent_id: string
          company_id: string
          created_at?: string
          created_by: string
          id?: string
          justification?: string | null
          policy_id: string
          rate: number
          updated_at?: string
        }
        Update: {
          agent_id?: string
          company_id?: string
          created_at?: string
          created_by?: string
          id?: string
          justification?: string | null
          policy_id?: string
          rate?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "manual_commissions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manual_commissions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manual_commissions_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_items: {
        Row: {
          amount: number
          commission_id: string | null
          created_at: string
          id: string
          payout_id: string
          policy_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          commission_id?: string | null
          created_at?: string
          id?: string
          payout_id: string
          policy_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          commission_id?: string | null
          created_at?: string
          id?: string
          payout_id?: string
          policy_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payout_items_commission_id_fkey"
            columns: ["commission_id"]
            isOneToOne: false
            referencedRelation: "commissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payout_items_payout_id_fkey"
            columns: ["payout_id"]
            isOneToOne: false
            referencedRelation: "agent_payouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payout_items_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      policies: {
        Row: {
          assigned_to: string | null
          client_id: string | null
          commission_amount: number | null
          commission_percentage: number | null
          commission_type: string | null
          company_id: string
          created_at: string
          created_by: string | null
          currency: string
          expiry_date: string
          id: string
          insured_id: string | null
          insured_name: string | null
          insurer_id: string | null
          insurer_name: string
          notes: string | null
          payment_frequency: string | null
          policy_number: string
          policy_type: string
          policy_type_id: string | null
          policyholder_name: string
          premium: number
          product_code: string | null
          product_id: string | null
          product_name: string | null
          start_date: string
          status: string
          updated_at: string
          workflow_status: string
        }
        Insert: {
          assigned_to?: string | null
          client_id?: string | null
          commission_amount?: number | null
          commission_percentage?: number | null
          commission_type?: string | null
          company_id: string
          created_at?: string
          created_by?: string | null
          currency?: string
          expiry_date: string
          id?: string
          insured_id?: string | null
          insured_name?: string | null
          insurer_id?: string | null
          insurer_name: string
          notes?: string | null
          payment_frequency?: string | null
          policy_number: string
          policy_type: string
          policy_type_id?: string | null
          policyholder_name: string
          premium: number
          product_code?: string | null
          product_id?: string | null
          product_name?: string | null
          start_date: string
          status: string
          updated_at?: string
          workflow_status: string
        }
        Update: {
          assigned_to?: string | null
          client_id?: string | null
          commission_amount?: number | null
          commission_percentage?: number | null
          commission_type?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          expiry_date?: string
          id?: string
          insured_id?: string | null
          insured_name?: string | null
          insurer_id?: string | null
          insurer_name?: string
          notes?: string | null
          payment_frequency?: string | null
          policy_number?: string
          policy_type?: string
          policy_type_id?: string | null
          policyholder_name?: string
          premium?: number
          product_code?: string | null
          product_id?: string | null
          product_name?: string | null
          start_date?: string
          status?: string
          updated_at?: string
          workflow_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "policies_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "policies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "policies_insured_id_fkey"
            columns: ["insured_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "policies_insurer_id_fkey"
            columns: ["insurer_id"]
            isOneToOne: false
            referencedRelation: "insurers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "policies_policy_type_id_fkey"
            columns: ["policy_type_id"]
            isOneToOne: false
            referencedRelation: "policy_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "policies_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "insurance_products"
            referencedColumns: ["id"]
          },
        ]
      }
      policy_addendums: {
        Row: {
          addendum_number: string
          company_id: string
          created_at: string
          created_by: string | null
          description: string
          effective_date: string
          id: string
          lien_status: boolean | null
          policy_id: string
          premium_adjustment: number | null
          status: string
          updated_at: string
          workflow_status: string
        }
        Insert: {
          addendum_number: string
          company_id: string
          created_at?: string
          created_by?: string | null
          description: string
          effective_date: string
          id?: string
          lien_status?: boolean | null
          policy_id: string
          premium_adjustment?: number | null
          status: string
          updated_at?: string
          workflow_status: string
        }
        Update: {
          addendum_number?: string
          company_id?: string
          created_at?: string
          created_by?: string | null
          description?: string
          effective_date?: string
          id?: string
          lien_status?: boolean | null
          policy_id?: string
          premium_adjustment?: number | null
          status?: string
          updated_at?: string
          workflow_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "policy_addendums_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "policy_addendums_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      policy_documents: {
        Row: {
          addendum_id: string | null
          company_id: string
          created_at: string
          document_name: string
          document_type: string
          file_path: string
          id: string
          policy_id: string | null
          updated_at: string
          uploaded_by: string
          version: number
        }
        Insert: {
          addendum_id?: string | null
          company_id: string
          created_at?: string
          document_name: string
          document_type: string
          file_path: string
          id?: string
          policy_id?: string | null
          updated_at?: string
          uploaded_by: string
          version?: number
        }
        Update: {
          addendum_id?: string | null
          company_id?: string
          created_at?: string
          document_name?: string
          document_type?: string
          file_path?: string
          id?: string
          policy_id?: string | null
          updated_at?: string
          uploaded_by?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "policy_documents_addendum_id_fkey"
            columns: ["addendum_id"]
            isOneToOne: false
            referencedRelation: "policy_addendums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "policy_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "policy_documents_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      policy_types: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "policy_types_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          created_at: string
          email: string
          id: string
          name: string
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          email: string
          id: string
          name: string
          role: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      report_schedules: {
        Row: {
          company_id: string
          created_at: string
          created_by: string
          email_recipients: string[] | null
          frequency: string
          id: string
          next_run_date: string
          report_id: string
          status: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by: string
          email_recipients?: string[] | null
          frequency: string
          id?: string
          next_run_date: string
          report_id: string
          status: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string
          email_recipients?: string[] | null
          frequency?: string
          id?: string
          next_run_date?: string
          report_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_schedules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_schedules_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "saved_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_assignments: {
        Row: {
          assigned_by: string
          company_id: string
          created_at: string
          id: string
          lead_id: string | null
          role: string
          sales_process_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_by: string
          company_id: string
          created_at?: string
          id?: string
          lead_id?: string | null
          role: string
          sales_process_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_by?: string
          company_id?: string
          created_at?: string
          id?: string
          lead_id?: string | null
          role?: string
          sales_process_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_assignments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_assignments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_assignments_sales_process_id_fkey"
            columns: ["sales_process_id"]
            isOneToOne: false
            referencedRelation: "sales_processes"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_documents: {
        Row: {
          company_id: string
          created_at: string
          document_name: string
          document_type: string
          file_path: string
          id: string
          sales_process_id: string
          step: string
          updated_at: string
          uploaded_by: string
        }
        Insert: {
          company_id: string
          created_at?: string
          document_name: string
          document_type: string
          file_path: string
          id?: string
          sales_process_id: string
          step: string
          updated_at?: string
          uploaded_by: string
        }
        Update: {
          company_id?: string
          created_at?: string
          document_name?: string
          document_type?: string
          file_path?: string
          id?: string
          sales_process_id?: string
          step?: string
          updated_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_documents_sales_process_id_fkey"
            columns: ["sales_process_id"]
            isOneToOne: false
            referencedRelation: "sales_processes"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_processes: {
        Row: {
          assigned_to: string | null
          company_id: string
          created_at: string
          current_step: string
          estimated_value: number | null
          expected_close_date: string | null
          id: string
          lead_id: string | null
          sales_number: string | null
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          company_id: string
          created_at?: string
          current_step: string
          estimated_value?: number | null
          expected_close_date?: string | null
          id?: string
          lead_id?: string | null
          sales_number?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          company_id?: string
          created_at?: string
          current_step?: string
          estimated_value?: number | null
          expected_close_date?: string | null
          id?: string
          lead_id?: string | null
          sales_number?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_processes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_processes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_reports: {
        Row: {
          columns: Json | null
          company_id: string
          created_at: string
          created_by: string
          description: string | null
          filters: Json | null
          id: string
          is_public: boolean
          name: string
          report_type: string
          sorting: Json | null
          updated_at: string
        }
        Insert: {
          columns?: Json | null
          company_id: string
          created_at?: string
          created_by: string
          description?: string | null
          filters?: Json | null
          id?: string
          is_public?: boolean
          name: string
          report_type: string
          sorting?: Json | null
          updated_at?: string
        }
        Update: {
          columns?: Json | null
          company_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          filters?: Json | null
          id?: string
          is_public?: boolean
          name?: string
          report_type?: string
          sorting?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_reports_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      unlinked_payments: {
        Row: {
          amount: number
          company_id: string
          created_at: string
          currency: string
          id: string
          linked_at: string | null
          linked_by: string | null
          linked_policy_id: string | null
          payer_name: string | null
          payment_date: string
          reference: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          company_id: string
          created_at?: string
          currency?: string
          id?: string
          linked_at?: string | null
          linked_by?: string | null
          linked_policy_id?: string | null
          payer_name?: string | null
          payment_date: string
          reference?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          amount?: number
          company_id?: string
          created_at?: string
          currency?: string
          id?: string
          linked_at?: string | null
          linked_by?: string | null
          linked_policy_id?: string | null
          payer_name?: string | null
          payment_date?: string
          reference?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "unlinked_payments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unlinked_payments_linked_policy_id_fkey"
            columns: ["linked_policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_custom_privileges: {
        Row: {
          expires_at: string | null
          granted_at: string
          granted_by: string
          id: string
          privilege: string
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          granted_at?: string
          granted_by: string
          id?: string
          privilege: string
          user_id: string
        }
        Update: {
          expires_at?: string | null
          granted_at?: string
          granted_by?: string
          id?: string
          privilege?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      company_has_available_seats: {
        Args: {
          company_id: string
        }
        Returns: boolean
      }
      is_valid_invitation: {
        Args: {
          token: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
