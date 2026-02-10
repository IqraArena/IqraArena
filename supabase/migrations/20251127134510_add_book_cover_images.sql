/*
  # Add Book Cover Images

  1. Changes
    - Add `cover_image_url` column to `books` table to store book cover image URLs
    - Populate existing books with appropriate cover images from Pexels
    
  2. Details
    - Each book gets a thematically appropriate stock photo
    - Islamic books get Quran/mosque themed images
    - History books get historical themed images
    - Programming books get technology themed images
    - General books get book/reading themed images
*/

-- Add cover_image_url column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'books' AND column_name = 'cover_image_url'
  ) THEN
    ALTER TABLE books ADD COLUMN cover_image_url text;
  END IF;
END $$;

-- Update existing books with cover images based on their titles
UPDATE books SET cover_image_url = 'https://images.pexels.com/photos/2165799/pexels-photo-2165799.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE title = 'تفسير الجلالين - الجزء الأول';

UPDATE books SET cover_image_url = 'https://images.pexels.com/photos/2166456/pexels-photo-2166456.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE title = 'أعلام السنة المنشورة';

UPDATE books SET cover_image_url = 'https://images.pexels.com/photos/2166447/pexels-photo-2166447.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE title = 'السيرة النبوية';

UPDATE books SET cover_image_url = 'https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE title = 'تاريخ الأندلس';

UPDATE books SET cover_image_url = 'https://images.pexels.com/photos/1252869/pexels-photo-1252869.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE title = 'الدولة الأموية والعباسية';

UPDATE books SET cover_image_url = 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE title = 'HTML5 نحو فهم أفضل لتقنيات';

UPDATE books SET cover_image_url = 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE title = 'تفهيم الخوارزميات - الجزء الأول';

UPDATE books SET cover_image_url = 'https://images.pexels.com/photos/4709285/pexels-photo-4709285.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE title = 'تعلم البرمجة مع القط سكراتش';

UPDATE books SET cover_image_url = 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE title = 'رحلة ابن بطوطة';

UPDATE books SET cover_image_url = 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=600'
WHERE title = 'تعظيم الاستفادة من الهاتف المحمول';
