-- Add unique constraint on user_id for customization_settings to allow upsert
ALTER TABLE public.customization_settings 
ADD CONSTRAINT customization_settings_user_id_unique UNIQUE (user_id);