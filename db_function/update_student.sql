-- FUNCTION: public.update_student(integer, character varying, character varying, character varying, character varying)

-- DROP FUNCTION IF EXISTS public.update_student(integer, character varying, character varying, character varying, character varying);

CREATE OR REPLACE FUNCTION public.update_student(
	p_id integer,
	p_name character varying,
	p_email character varying,
	p_phone character varying,
	p_address character varying)
    RETURNS TABLE(st_id integer, st_name character varying, st_address character varying) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE 
  l_name text;
  l_email text;
  l_phone text;
  l_address text;
BEGIN
  UPDATE students
  SET name = p_name,
      email = p_email,
	  phone = p_phone,
      address = p_address
  WHERE id = p_id;
  
  RETURN QUERY 
  SELECT id, name, address FROM students WHERE id = p_id;
  
END;
$BODY$;

ALTER FUNCTION public.update_student(integer, character varying, character varying, character varying, character varying)
    OWNER TO postgres;
