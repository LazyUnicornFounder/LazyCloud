-- Clean hashtags from all blog post content
-- This creates a helper function, runs the cleanup, then drops it

CREATE OR REPLACE FUNCTION public.clean_blog_hashtags()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  post RECORD;
  cleaned_content text[];
  para text;
  cleaned_para text;
BEGIN
  FOR post IN SELECT id, content FROM blog_posts WHERE array_to_string(content, ' ') LIKE '%#%'
  LOOP
    cleaned_content := '{}';
    FOREACH para IN ARRAY post.content
    LOOP
      cleaned_para := regexp_replace(para, '#\w+', '', 'g');
      cleaned_para := regexp_replace(cleaned_para, '\s{2,}', ' ', 'g');
      cleaned_para := trim(cleaned_para);
      IF cleaned_para <> '' THEN
        cleaned_content := array_append(cleaned_content, cleaned_para);
      END IF;
    END LOOP;
    UPDATE blog_posts SET content = cleaned_content WHERE id = post.id;
  END LOOP;
END;
$$;

SELECT public.clean_blog_hashtags();

DROP FUNCTION public.clean_blog_hashtags();