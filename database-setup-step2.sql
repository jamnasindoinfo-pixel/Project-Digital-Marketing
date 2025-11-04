-- Step 2: Enable RLS and Create Policies
-- Run this AFTER running database-setup-step1.sql

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public posts are viewable by everyone" ON blog_posts;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON blog_categories;
DROP POLICY IF EXISTS "Tags are viewable by everyone" ON blog_tags;
DROP POLICY IF EXISTS "Post tags are viewable by everyone" ON blog_post_tags;
DROP POLICY IF EXISTS "Blog images are viewable by everyone" ON blog_images;

-- Create Policies for Public Read Access
CREATE POLICY "Public posts are viewable by everyone" ON blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Categories are viewable by everyone" ON blog_categories
  FOR SELECT USING (true);

CREATE POLICY "Tags are viewable by everyone" ON blog_tags
  FOR SELECT USING (true);

CREATE POLICY "Post tags are viewable by everyone" ON blog_post_tags
  FOR SELECT USING (true);

CREATE POLICY "Blog images are viewable by everyone" ON blog_images
  FOR SELECT USING (true);

-- Create Functions for auto-updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_blog_categories_updated_at ON blog_categories;
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
DROP TRIGGER IF EXISTS update_blog_tags_updated_at ON blog_tags;

-- Create triggers for auto-updating timestamps
CREATE TRIGGER update_blog_categories_updated_at
    BEFORE UPDATE ON blog_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_tags_updated_at
    BEFORE UPDATE ON blog_tags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Step 2 completed: RLS policies and triggers set up successfully!';
    RAISE NOTICE 'Database setup is complete. You can now run sample-content.sql to add sample data.';
END $$;