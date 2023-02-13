-- FUNCTION: public.add_user(character varying, character varying, character varying)

-- DROP FUNCTION IF EXISTS public.add_user(character varying, character varying, character varying);

CREATE OR REPLACE FUNCTION public.add_user(
	p_name character varying,
	p_email character varying,
	p_password character varying)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
   INSERT INTO users (name, email,password)
   VALUES (p_name, p_email,p_password);
END;
$BODY$;

ALTER FUNCTION public.add_user(character varying, character varying, character varying)
    OWNER TO postgres;
