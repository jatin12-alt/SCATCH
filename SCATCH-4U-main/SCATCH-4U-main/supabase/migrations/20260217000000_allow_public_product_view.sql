/*
  # Allow Public Product Viewing
  
  Update RLS policy to allow anyone (including non-authenticated users) 
  to view products. This enables product browsing without login.
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;

-- Create new policy that allows public read access
CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  USING (true);

