CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: generate_access_key(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.generate_access_key() RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  key TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 8 character alphanumeric key
    key := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if key already exists
    SELECT EXISTS(SELECT 1 FROM profiles WHERE access_key = key) INTO exists;
    
    EXIT WHEN NOT exists;
  END LOOP;
  
  RETURN key;
END;
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, access_key)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    generate_access_key()
  );
  RETURN new;
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: catalog_products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalog_products (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    price numeric(10,2),
    display_order integer DEFAULT 0,
    is_visible boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    description text,
    button_text text DEFAULT 'Mais informações'::text,
    link_type text DEFAULT 'custom'::text,
    link_url text,
    images text[] DEFAULT '{}'::text[],
    show_images_above boolean DEFAULT false,
    CONSTRAINT catalog_products_link_type_check CHECK ((link_type = ANY (ARRAY['whatsapp'::text, 'custom'::text, 'pix'::text])))
);


--
-- Name: contact_forms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_forms (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    title text DEFAULT 'Fale Conosco'::text NOT NULL,
    fields jsonb DEFAULT '[]'::jsonb NOT NULL,
    require_form_fill boolean DEFAULT false NOT NULL,
    send_email_notifications boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: contact_submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_submissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    form_id uuid NOT NULL,
    user_id uuid NOT NULL,
    name text,
    email text,
    phone text,
    message text,
    submitted_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: custom_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.custom_links (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    title text NOT NULL,
    url text NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    icon text DEFAULT 'globe'::text,
    is_pulsing boolean DEFAULT false,
    show_icon_only boolean DEFAULT false,
    link_type text DEFAULT 'url'::text
);


--
-- Name: customization_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customization_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    item_color text DEFAULT '#4F46E5'::text,
    text_color text DEFAULT '#FFFFFF'::text,
    item_opacity numeric DEFAULT 1.0,
    item_corner_radius numeric DEFAULT 12,
    background_type text DEFAULT 'color'::text,
    background_color text DEFAULT '#1E40AF'::text,
    background_image_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT customization_settings_background_type_check CHECK ((background_type = ANY (ARRAY['color'::text, 'image'::text]))),
    CONSTRAINT customization_settings_item_corner_radius_check CHECK (((item_corner_radius >= (0)::numeric) AND (item_corner_radius <= (50)::numeric))),
    CONSTRAINT customization_settings_item_opacity_check CHECK (((item_opacity >= (0)::numeric) AND (item_opacity <= (1)::numeric)))
);


--
-- Name: pix_keys; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pix_keys (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    key_type text NOT NULL,
    key_value text NOT NULL,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    full_name text NOT NULL,
    bio text,
    profile_image_url text,
    phone text,
    email text,
    company text,
    "position" text,
    website text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    access_key text,
    custom_slug text,
    pix_key text,
    pix_key_type text,
    pix_beneficiary_name text,
    pix_beneficiary_city text,
    show_search_on_catalog boolean DEFAULT false,
    facebook_url text,
    instagram_handle text,
    twitter_handle text,
    linkedin_url text,
    whatsapp_number text,
    spotify_url text,
    youtube_url text,
    tiktok_handle text,
    location text,
    google_reviews_url text
);


--
-- Name: social_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.social_links (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    platform text NOT NULL,
    url text NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    show_icon_only boolean DEFAULT false
);


--
-- Name: catalog_products catalog_products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_products
    ADD CONSTRAINT catalog_products_pkey PRIMARY KEY (id);


--
-- Name: contact_forms contact_forms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_forms
    ADD CONSTRAINT contact_forms_pkey PRIMARY KEY (id);


--
-- Name: contact_submissions contact_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_submissions
    ADD CONSTRAINT contact_submissions_pkey PRIMARY KEY (id);


--
-- Name: custom_links custom_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_links
    ADD CONSTRAINT custom_links_pkey PRIMARY KEY (id);


--
-- Name: customization_settings customization_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customization_settings
    ADD CONSTRAINT customization_settings_pkey PRIMARY KEY (id);


--
-- Name: customization_settings customization_settings_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customization_settings
    ADD CONSTRAINT customization_settings_user_id_key UNIQUE (user_id);


--
-- Name: pix_keys pix_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pix_keys
    ADD CONSTRAINT pix_keys_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_access_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_access_key_key UNIQUE (access_key);


--
-- Name: profiles profiles_custom_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_custom_slug_key UNIQUE (custom_slug);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: social_links social_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.social_links
    ADD CONSTRAINT social_links_pkey PRIMARY KEY (id);


--
-- Name: idx_catalog_products_display_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_catalog_products_display_order ON public.catalog_products USING btree (display_order);


--
-- Name: idx_catalog_products_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_catalog_products_user_id ON public.catalog_products USING btree (user_id);


--
-- Name: idx_contact_forms_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contact_forms_user_id ON public.contact_forms USING btree (user_id);


--
-- Name: idx_contact_submissions_form_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contact_submissions_form_id ON public.contact_submissions USING btree (form_id);


--
-- Name: idx_contact_submissions_submitted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contact_submissions_submitted_at ON public.contact_submissions USING btree (submitted_at DESC);


--
-- Name: catalog_products update_catalog_products_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_catalog_products_updated_at BEFORE UPDATE ON public.catalog_products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: contact_forms update_contact_forms_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_contact_forms_updated_at BEFORE UPDATE ON public.contact_forms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: customization_settings update_customization_settings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_customization_settings_updated_at BEFORE UPDATE ON public.customization_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: catalog_products catalog_products_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_products
    ADD CONSTRAINT catalog_products_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: contact_forms contact_forms_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_forms
    ADD CONSTRAINT contact_forms_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: contact_submissions contact_submissions_form_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_submissions
    ADD CONSTRAINT contact_submissions_form_id_fkey FOREIGN KEY (form_id) REFERENCES public.contact_forms(id) ON DELETE CASCADE;


--
-- Name: custom_links custom_links_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_links
    ADD CONSTRAINT custom_links_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: customization_settings customization_settings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customization_settings
    ADD CONSTRAINT customization_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: pix_keys pix_keys_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pix_keys
    ADD CONSTRAINT pix_keys_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: social_links social_links_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.social_links
    ADD CONSTRAINT social_links_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: contact_submissions Anyone can submit to active forms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can submit to active forms" ON public.contact_submissions FOR INSERT WITH CHECK (true);


--
-- Name: custom_links Anyone can view custom links; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view custom links" ON public.custom_links FOR SELECT USING (true);


--
-- Name: customization_settings Anyone can view customization settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view customization settings" ON public.customization_settings FOR SELECT USING (true);


--
-- Name: pix_keys Anyone can view pix keys; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view pix keys" ON public.pix_keys FOR SELECT USING (true);


--
-- Name: social_links Anyone can view social links; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view social links" ON public.social_links FOR SELECT USING (true);


--
-- Name: catalog_products Anyone can view visible catalog products; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view visible catalog products" ON public.catalog_products FOR SELECT USING ((is_visible = true));


--
-- Name: catalog_products Anyone can view visible products; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view visible products" ON public.catalog_products FOR SELECT USING ((is_visible = true));


--
-- Name: catalog_products Users can create their own catalog products; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own catalog products" ON public.catalog_products FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: contact_forms Users can create their own contact forms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own contact forms" ON public.contact_forms FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: catalog_products Users can delete their own catalog products; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own catalog products" ON public.catalog_products FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: contact_forms Users can delete their own contact forms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own contact forms" ON public.contact_forms FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can insert own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- Name: customization_settings Users can insert their own customization; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own customization" ON public.customization_settings FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: custom_links Users can manage own custom links; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage own custom links" ON public.custom_links USING ((auth.uid() = user_id));


--
-- Name: social_links Users can manage own social links; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage own social links" ON public.social_links USING ((auth.uid() = user_id));


--
-- Name: pix_keys Users can manage their own pix keys; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage their own pix keys" ON public.pix_keys USING ((auth.uid() = user_id));


--
-- Name: catalog_products Users can manage their own products; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage their own products" ON public.catalog_products USING ((auth.uid() = user_id));


--
-- Name: profiles Users can update own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: catalog_products Users can update their own catalog products; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own catalog products" ON public.catalog_products FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: contact_forms Users can update their own contact forms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own contact forms" ON public.contact_forms FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: customization_settings Users can update their own customization; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own customization" ON public.customization_settings FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can view all profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);


--
-- Name: contact_submissions Users can view submissions for their forms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view submissions for their forms" ON public.contact_submissions FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.contact_forms
  WHERE ((contact_forms.id = contact_submissions.form_id) AND (contact_forms.user_id = auth.uid())))));


--
-- Name: catalog_products Users can view their own catalog products; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own catalog products" ON public.catalog_products FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: contact_forms Users can view their own contact forms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own contact forms" ON public.contact_forms FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: customization_settings Users can view their own customization; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own customization" ON public.customization_settings FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: catalog_products; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.catalog_products ENABLE ROW LEVEL SECURITY;

--
-- Name: contact_forms; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.contact_forms ENABLE ROW LEVEL SECURITY;

--
-- Name: contact_submissions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

--
-- Name: custom_links; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.custom_links ENABLE ROW LEVEL SECURITY;

--
-- Name: customization_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.customization_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: pix_keys; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.pix_keys ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: social_links; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


