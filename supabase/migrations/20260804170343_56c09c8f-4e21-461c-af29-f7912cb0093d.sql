
-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin','staff');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','staff'))
$$;

CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- SITE SETTINGS
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  is_public boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public settings readable" ON public.site_settings FOR SELECT TO anon, authenticated USING (is_public = true);
CREATE POLICY "admins manage settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER t_site_settings BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- PRODUCTS
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  short_description text,
  description text,
  base_price_cents integer NOT NULL DEFAULT 9900,
  base_rose_count integer NOT NULL DEFAULT 11,
  rose_step integer NOT NULL DEFAULT 2,
  step_price_cents integer NOT NULL DEFAULT 1000,
  min_roses integer NOT NULL DEFAULT 11,
  max_roses integer NOT NULL DEFAULT 21,
  box_inventory integer NOT NULL DEFAULT 50,
  is_active boolean NOT NULL DEFAULT true,
  promo_label text,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT box_inventory_non_negative CHECK (box_inventory >= 0)
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "active products readable" ON public.products FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "admins manage products" ON public.products FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER t_products BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- FLOWER COLORS
CREATE TABLE public.flower_colors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name_bg text NOT NULL,
  hex text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  stock_roses integer NOT NULL DEFAULT 0,
  is_available boolean NOT NULL DEFAULT true,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT stock_non_negative CHECK (stock_roses >= 0)
);
GRANT SELECT ON public.flower_colors TO anon, authenticated;
GRANT ALL ON public.flower_colors TO service_role;
ALTER TABLE public.flower_colors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "colors readable" ON public.flower_colors FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage colors" ON public.flower_colors FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER t_colors BEFORE UPDATE ON public.flower_colors FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- BLACKOUT DATES
CREATE TABLE public.delivery_blackout_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blackout_date date NOT NULL UNIQUE,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.delivery_blackout_dates TO anon, authenticated;
GRANT ALL ON public.delivery_blackout_dates TO service_role;
ALTER TABLE public.delivery_blackout_dates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blackouts readable" ON public.delivery_blackout_dates FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage blackouts" ON public.delivery_blackout_dates FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ORDERS
CREATE SEQUENCE public.order_number_seq START 1;

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  access_token text NOT NULL DEFAULT encode(gen_random_bytes(16),'hex'),
  status text NOT NULL DEFAULT 'awaiting_payment',
  payment_status text NOT NULL DEFAULT 'awaiting_payment',
  payment_method text NOT NULL DEFAULT 'revolut_link',
  customer_first_name text NOT NULL,
  customer_last_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  billing_address text,
  company_name text,
  company_vat text,
  company_eik text,
  invoice_required boolean NOT NULL DEFAULT false,
  subtotal_cents integer NOT NULL DEFAULT 0,
  shipping_cents integer NOT NULL DEFAULT 0,
  total_cents integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'EUR',
  internal_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read orders" ON public.orders FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admins update orders" ON public.orders FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
GRANT SELECT, UPDATE ON public.orders TO authenticated;
CREATE TRIGGER t_orders BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE OR REPLACE FUNCTION public.next_order_number() RETURNS text
LANGUAGE sql VOLATILE SECURITY DEFINER SET search_path = public AS $$
  SELECT 'FP-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.order_number_seq')::text, 5, '0')
$$;

-- ORDER ITEMS
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id),
  product_name text NOT NULL,
  rose_count integer NOT NULL,
  color_code text NOT NULL,
  color_name text NOT NULL,
  unit_price_cents integer NOT NULL,
  shipping_cents integer NOT NULL DEFAULT 0,
  card_recipient_name text,
  card_message text,
  card_sender_name text,
  hide_sender boolean NOT NULL DEFAULT false,
  occasion text,
  recipient_name text NOT NULL,
  recipient_phone text NOT NULL,
  region text,
  city text NOT NULL,
  postal_code text,
  street_address text NOT NULL,
  entrance text,
  floor text,
  apartment text,
  delivery_notes text,
  delivery_date date NOT NULL,
  delivery_slot text,
  delivery_type text NOT NULL DEFAULT 'sofia',
  courier text,
  tracking_number text,
  delivery_status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read items" ON public.order_items FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admins update items" ON public.order_items FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER t_order_items BEFORE UPDATE ON public.order_items FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- STATUS HISTORY
CREATE TABLE public.order_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status text NOT NULL,
  note text,
  changed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.order_status_history TO authenticated;
GRANT ALL ON public.order_status_history TO service_role;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read history" ON public.order_status_history FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

-- PAYMENTS
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  provider text NOT NULL DEFAULT 'revolut_link',
  status text NOT NULL DEFAULT 'awaiting_payment',
  amount_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'EUR',
  reference text,
  confirmed_by uuid,
  confirmed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read payments" ON public.payments FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

-- REQUESTS
CREATE TABLE public.contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, email text NOT NULL, phone text, subject text, message text NOT NULL,
  handled boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_requests TO anon, authenticated;
GRANT SELECT, UPDATE ON public.contact_requests TO authenticated;
GRANT ALL ON public.contact_requests TO service_role;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone submits contact" ON public.contact_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read contact" ON public.contact_requests FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admins update contact" ON public.contact_requests FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.corporate_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, company text NOT NULL, email text NOT NULL, phone text,
  box_count integer, target_date date, message text,
  handled boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.corporate_requests TO anon, authenticated;
GRANT SELECT, UPDATE ON public.corporate_requests TO authenticated;
GRANT ALL ON public.corporate_requests TO service_role;
ALTER TABLE public.corporate_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone submits corporate" ON public.corporate_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read corporate" ON public.corporate_requests FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admins update corporate" ON public.corporate_requests FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE, consent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT SELECT ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone subscribes" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (consent = true);
CREATE POLICY "admins read subscribers" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

CREATE TABLE public.complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL, email text NOT NULL, phone text,
  problem_description text NOT NULL, desired_resolution text,
  photo_urls jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'new', created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.complaints TO anon, authenticated;
GRANT SELECT, UPDATE ON public.complaints TO authenticated;
GRANT ALL ON public.complaints TO service_role;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone submits complaint" ON public.complaints FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read complaints" ON public.complaints FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admins update complaints" ON public.complaints FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.stock_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL, notified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.stock_notifications TO anon, authenticated;
GRANT SELECT ON public.stock_notifications TO authenticated;
GRANT ALL ON public.stock_notifications TO service_role;
ALTER TABLE public.stock_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone subscribes stock" ON public.stock_notifications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read stock notif" ON public.stock_notifications FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

-- SEED
INSERT INTO public.products (slug, name, short_description, description, base_price_cents, base_rose_count, rose_step, step_price_cents, min_roses, max_roses, box_inventory, promo_label)
VALUES (
  'flowerpost-signature-box',
  'FLOWERPOST Signature Box',
  'Една кутия. Свежи рози. Послание, написано специално за получателя.',
  'Премиум дизайнерска кутия в цвят шампанско със сатенена панделка, минимум 11 пресни рози по избор, tissue хартия, персонализирана картичка с ръчно изписано име, съвети за грижа, визитна картичка и защитна транспортна опаковка.',
  9900, 11, 2, 1000, 11, 21, 50, 'Налична пилотна серия'
);

INSERT INTO public.flower_colors (code, name_bg, hex, sort_order, stock_roses, is_available) VALUES
  ('red','Червени','#8E1B2C',1,400,true),
  ('white','Бели','#F6F1E8',2,300,true),
  ('pink','Розови','#E3A5AE',3,300,true),
  ('cream','Кремави','#EBD9BE',4,250,true);

INSERT INTO public.site_settings (key, value, is_public) VALUES
  ('brand', '{"name":"FLOWERPOST","domain":"flowerpost.eu","tagline":"Someone thinking of you.","tagline_bg":"Някой мисли за теб."}', true),
  ('delivery', '{"sofia_shipping_cents":0,"country_shipping_cents":900,"lead_time_days":1,"max_deliveries_per_day":15,"slots":["10:00 – 13:00","13:00 – 17:00","17:00 – 20:00"]}', true),
  ('payment', '{"revolut_link_configured":false,"revolut_note":"Въведи номера на поръчката като основание за плащане."}', true),
  ('company', '{"legal_name":"[Наименование на търговеца]","eik":"[ЕИК]","vat":"[ДДС регистрация]","address":"[Седалище и адрес]","mail_address":"[Адрес за кореспонденция]","phone":"[Телефон]","email":"hello@flowerpost.eu","contact_person":"[Лице за контакт]","payment_provider":"Revolut"}', true);
