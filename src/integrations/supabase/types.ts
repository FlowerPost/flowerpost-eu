export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      complaints: {
        Row: {
          created_at: string
          desired_resolution: string | null
          email: string
          id: string
          order_number: string
          phone: string | null
          photo_urls: Json
          problem_description: string
          status: string
        }
        Insert: {
          created_at?: string
          desired_resolution?: string | null
          email: string
          id?: string
          order_number: string
          phone?: string | null
          photo_urls?: Json
          problem_description: string
          status?: string
        }
        Update: {
          created_at?: string
          desired_resolution?: string | null
          email?: string
          id?: string
          order_number?: string
          phone?: string | null
          photo_urls?: Json
          problem_description?: string
          status?: string
        }
        Relationships: []
      }
      contact_requests: {
        Row: {
          created_at: string
          email: string
          handled: boolean
          id: string
          message: string
          name: string
          phone: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          handled?: boolean
          id?: string
          message: string
          name: string
          phone?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          handled?: boolean
          id?: string
          message?: string
          name?: string
          phone?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      corporate_requests: {
        Row: {
          box_count: number | null
          company: string
          created_at: string
          email: string
          handled: boolean
          id: string
          message: string | null
          name: string
          phone: string | null
          target_date: string | null
        }
        Insert: {
          box_count?: number | null
          company: string
          created_at?: string
          email: string
          handled?: boolean
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          target_date?: string | null
        }
        Update: {
          box_count?: number | null
          company?: string
          created_at?: string
          email?: string
          handled?: boolean
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          target_date?: string | null
        }
        Relationships: []
      }
      delivery_blackout_dates: {
        Row: {
          blackout_date: string
          created_at: string
          id: string
          reason: string | null
        }
        Insert: {
          blackout_date: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Update: {
          blackout_date?: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Relationships: []
      }
      flower_colors: {
        Row: {
          code: string
          created_at: string
          hex: string
          id: string
          image_url: string | null
          is_available: boolean
          name_bg: string
          sort_order: number
          stock_roses: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          hex: string
          id?: string
          image_url?: string | null
          is_available?: boolean
          name_bg: string
          sort_order?: number
          stock_roses?: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          hex?: string
          id?: string
          image_url?: string | null
          is_available?: boolean
          name_bg?: string
          sort_order?: number
          stock_roses?: number
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          consent: boolean
          created_at: string
          email: string
          id: string
        }
        Insert: {
          consent?: boolean
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          consent?: boolean
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          apartment: string | null
          card_message: string | null
          card_recipient_name: string | null
          card_sender_name: string | null
          city: string
          color_code: string
          color_name: string
          courier: string | null
          created_at: string
          delivery_date: string
          delivery_notes: string | null
          delivery_slot: string | null
          delivery_status: string
          delivery_type: string
          entrance: string | null
          floor: string | null
          hide_sender: boolean
          id: string
          occasion: string | null
          order_id: string
          postal_code: string | null
          product_id: string | null
          product_name: string
          recipient_name: string
          recipient_phone: string
          region: string | null
          rose_count: number
          shipping_cents: number
          street_address: string
          tracking_number: string | null
          unit_price_cents: number
          updated_at: string
        }
        Insert: {
          apartment?: string | null
          card_message?: string | null
          card_recipient_name?: string | null
          card_sender_name?: string | null
          city: string
          color_code: string
          color_name: string
          courier?: string | null
          created_at?: string
          delivery_date: string
          delivery_notes?: string | null
          delivery_slot?: string | null
          delivery_status?: string
          delivery_type?: string
          entrance?: string | null
          floor?: string | null
          hide_sender?: boolean
          id?: string
          occasion?: string | null
          order_id: string
          postal_code?: string | null
          product_id?: string | null
          product_name: string
          recipient_name: string
          recipient_phone: string
          region?: string | null
          rose_count: number
          shipping_cents?: number
          street_address: string
          tracking_number?: string | null
          unit_price_cents: number
          updated_at?: string
        }
        Update: {
          apartment?: string | null
          card_message?: string | null
          card_recipient_name?: string | null
          card_sender_name?: string | null
          city?: string
          color_code?: string
          color_name?: string
          courier?: string | null
          created_at?: string
          delivery_date?: string
          delivery_notes?: string | null
          delivery_slot?: string | null
          delivery_status?: string
          delivery_type?: string
          entrance?: string | null
          floor?: string | null
          hide_sender?: boolean
          id?: string
          occasion?: string | null
          order_id?: string
          postal_code?: string | null
          product_id?: string | null
          product_name?: string
          recipient_name?: string
          recipient_phone?: string
          region?: string | null
          rose_count?: number
          shipping_cents?: number
          street_address?: string
          tracking_number?: string | null
          unit_price_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          note: string | null
          order_id: string
          status: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          note?: string | null
          order_id: string
          status: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          note?: string | null
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          access_token: string
          billing_address: string | null
          company_eik: string | null
          company_name: string | null
          company_vat: string | null
          created_at: string
          currency: string
          customer_email: string
          customer_first_name: string
          customer_last_name: string
          customer_phone: string
          id: string
          internal_note: string | null
          invoice_required: boolean
          order_number: string
          payment_method: string
          payment_status: string
          shipping_cents: number
          status: string
          subtotal_cents: number
          total_cents: number
          updated_at: string
        }
        Insert: {
          access_token?: string
          billing_address?: string | null
          company_eik?: string | null
          company_name?: string | null
          company_vat?: string | null
          created_at?: string
          currency?: string
          customer_email: string
          customer_first_name: string
          customer_last_name: string
          customer_phone: string
          id?: string
          internal_note?: string | null
          invoice_required?: boolean
          order_number: string
          payment_method?: string
          payment_status?: string
          shipping_cents?: number
          status?: string
          subtotal_cents?: number
          total_cents?: number
          updated_at?: string
        }
        Update: {
          access_token?: string
          billing_address?: string | null
          company_eik?: string | null
          company_name?: string | null
          company_vat?: string | null
          created_at?: string
          currency?: string
          customer_email?: string
          customer_first_name?: string
          customer_last_name?: string
          customer_phone?: string
          id?: string
          internal_note?: string | null
          invoice_required?: boolean
          order_number?: string
          payment_method?: string
          payment_status?: string
          shipping_cents?: number
          status?: string
          subtotal_cents?: number
          total_cents?: number
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount_cents: number
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string
          currency: string
          id: string
          order_id: string
          provider: string
          reference: string | null
          status: string
        }
        Insert: {
          amount_cents: number
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          currency?: string
          id?: string
          order_id: string
          provider?: string
          reference?: string | null
          status?: string
        }
        Update: {
          amount_cents?: number
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          currency?: string
          id?: string
          order_id?: string
          provider?: string
          reference?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          base_price_cents: number
          base_rose_count: number
          box_inventory: number
          created_at: string
          description: string | null
          id: string
          images: Json
          is_active: boolean
          max_roses: number
          min_roses: number
          name: string
          promo_label: string | null
          rose_step: number
          short_description: string | null
          slug: string
          step_price_cents: number
          updated_at: string
        }
        Insert: {
          base_price_cents?: number
          base_rose_count?: number
          box_inventory?: number
          created_at?: string
          description?: string | null
          id?: string
          images?: Json
          is_active?: boolean
          max_roses?: number
          min_roses?: number
          name: string
          promo_label?: string | null
          rose_step?: number
          short_description?: string | null
          slug: string
          step_price_cents?: number
          updated_at?: string
        }
        Update: {
          base_price_cents?: number
          base_rose_count?: number
          box_inventory?: number
          created_at?: string
          description?: string | null
          id?: string
          images?: Json
          is_active?: boolean
          max_roses?: number
          min_roses?: number
          name?: string
          promo_label?: string | null
          rose_step?: number
          short_description?: string | null
          slug?: string
          step_price_cents?: number
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          is_public: boolean
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          is_public?: boolean
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          is_public?: boolean
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      stock_notifications: {
        Row: {
          created_at: string
          email: string
          id: string
          notified: boolean
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          notified?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          notified?: boolean
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      next_order_number: { Args: never; Returns: string }
    }
    Enums: {
      app_role: "admin" | "staff"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff"],
    },
  },
} as const
