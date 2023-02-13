-- FUNCTION: public.add_subject(character varying, character varying)

-- DROP FUNCTION IF EXISTS public.add_subject(character varying, character varying);

CREATE OR REPLACE FUNCTION public.add_subject(
	p_name character varying,
	p_code character varying)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
  INSERT INTO subjects (name, code)
   VALUES (p_name, p_code);
END;
$BODY$;

ALTER FUNCTION public.add_subject(character varying, character varying)
    OWNER TO postgres;
