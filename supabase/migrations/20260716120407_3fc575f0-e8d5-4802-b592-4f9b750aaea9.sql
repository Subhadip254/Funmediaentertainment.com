
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_staff(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

DROP POLICY "career_public_insert" ON public.career_applications;
CREATE POLICY "career_public_insert" ON public.career_applications
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(full_name) BETWEEN 1 AND 120
    AND length(email) BETWEEN 3 AND 254
    AND length(role_applying_for) BETWEEN 1 AND 80
    AND length(portfolio_url) BETWEEN 1 AND 500
  );

DROP POLICY "contact_public_insert" ON public.contact_messages;
CREATE POLICY "contact_public_insert" ON public.contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(name) BETWEEN 1 AND 120
    AND length(email) BETWEEN 3 AND 254
    AND length(message) BETWEEN 1 AND 5000
  );
