-- FUNCTION: public.get_student_marks(integer)

-- DROP FUNCTION IF EXISTS public.get_student_marks(integer);

CREATE OR REPLACE FUNCTION public.get_student_marks(
	student_id integer)
    RETURNS TABLE(subject_name character varying, marks integer) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
RETURN QUERY
SELECT subjects.name AS subject_name, marks.marks
FROM students
JOIN marks ON students.id = marks.studentId
JOIN subjects ON subjects.id = marks.subjectId
WHERE students.id = student_id;
END;
$BODY$;

ALTER FUNCTION public.get_student_marks(integer)
    OWNER TO postgres;
