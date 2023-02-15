-- FUNCTION: public.get_joined_user_data(text)

-- DROP FUNCTION IF EXISTS public.get_joined_user_data(text);

CREATE OR REPLACE FUNCTION public.get_joined_user_data(
	p_token text)
    RETURNS TABLE(user_id integer, user_name character varying, user_email character varying, login_link_id integer, login_link_token character varying,login_link_timestamp timestamp with time zone , login_link_userid integer) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
  RETURN QUERY
    SELECT u.id AS user_id, u.name AS user_name, u.email AS user_email, ll.id AS login_link_id, ll.token AS login_link_token,ll.timestamp AS login_link_timestamp, ll.userid AS login_link_user_id
    FROM users u
   	JOIN loginlinks ll ON u.id = ll.userid
    WHERE ll.token = p_token;
END;
$BODY$;

ALTER FUNCTION public.get_joined_user_data(text)
    OWNER TO postgres;

select * from get_joined_user_data('169289');