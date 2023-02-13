-- FUNCTION: public.get_all_students(integer, integer, character varying, character varying, character varying)

-- DROP FUNCTION IF EXISTS public.get_all_students(integer, integer, character varying, character varying, character varying);

CREATE OR REPLACE FUNCTION public.get_all_students(
	page_number integer,
	page_limit integer,
	search_string character varying,
	order_by character varying,
	order_direction character varying)
    RETURNS TABLE(id integer, name character varying, address character varying, phone character varying) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE 
query text;
BEGIN
  query := 'SELECT m.id, m.name, m.address, m.phone FROM students m';	
  
--   IF search_string IS NOT NULL THEN
--     query := query || ' WHERE m.name ILIKE ''' || search_string || '%''';
--   END IF;
  
  IF search_string IS NOT NULL THEN
  query := query || ' WHERE (m.name ILIKE ''%' || search_string || '%'' OR m.address ILIKE ''%' || search_string || '%'')';
  END IF;

  IF order_by IS NOT NULL AND order_direction IS NOT NULL THEN
    query := query || ' ORDER BY ' || order_by || ' ' || order_direction;
  END IF;
  query := query || ' LIMIT ' || page_limit || ' OFFSET ' || (page_number - 1) * page_limit;
	
  RETURN QUERY
  EXECUTE query;
END;
$BODY$;

ALTER FUNCTION public.get_all_students(integer, integer, character varying, character varying, character varying)
    OWNER TO postgres;
