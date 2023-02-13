-- FUNCTION: public.add_student(character varying, character varying, character varying, character varying)

-- DROP FUNCTION IF EXISTS public.add_student(character varying, character varying, character varying, character varying);

CREATE OR REPLACE FUNCTION public.add_student(
	p_name character varying,
	p_email character varying,
	p_phone character varying,
	p_address character varying)
    RETURNS TABLE(name character varying, email character varying, phone character varying, address character varying) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
   INSERT INTO students (name, email, phone, address)
   VALUES (p_name, p_email, p_phone, p_address);
   
    RETURN QUERY SELECT p_name, p_email, p_phone, p_address;
END;
$BODY$;

ALTER FUNCTION public.add_student(character varying, character varying, character varying, character varying)
    OWNER TO postgres;
