-- FUNCTION: public.get_student_data(integer)

-- DROP FUNCTION IF EXISTS public.get_student_data(integer);

CREATE OR REPLACE FUNCTION public.get_student_data(
	p_student_id integer)
    RETURNS TABLE(student_id integer, name character varying, email character varying, phone character varying, address character varying, subject_id integer, subject_name character varying, subject_code character varying, marks integer) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
RETURN QUERY
  SELECT s.id AS student_id, s.name, s.email, s.phone, s.address, su.id AS subject_id, su.name AS subject_name, su.code AS subject_code, m.marks
  FROM students s
  JOIN marks m ON s.id = m.studentId
  JOIN subjects su ON m.subjectId = su.id
  WHERE s.id = p_student_id;
END;
$BODY$;

ALTER FUNCTION public.get_student_data(integer)
    OWNER TO postgres;
