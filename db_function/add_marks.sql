-- FUNCTION: public.add_student_marks(integer, character varying, integer)

-- DROP FUNCTION IF EXISTS public.add_student_marks(integer, character varying, integer);

CREATE OR REPLACE FUNCTION public.add_student_marks(
	p_student_id integer,
	p_subject_name character varying,
	p_marks integer)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
  INSERT INTO marks (studentid, subjectid, marks)
  VALUES (p_student_id, (SELECT id FROM subjects WHERE name = p_subject_name), p_marks);
END;
$BODY$;

ALTER FUNCTION public.add_student_marks(integer, character varying, integer)
    OWNER TO postgres;
