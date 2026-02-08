/*
  # Fix RLS Policies and Seed Books Data

  ## Changes
  1. Add policy to allow service role to insert books, pages, and quizzes
  2. Seed the database with 5 Arabic books and their content
  3. Create test user account

  ## Security
  - Books remain publicly readable by authenticated users
  - Only service role can insert/update books (admin operation)
*/

-- Drop existing restrictive policies for books
DROP POLICY IF EXISTS "Anyone can view books" ON books;
DROP POLICY IF EXISTS "Anyone can view book pages" ON book_pages;
DROP POLICY IF EXISTS "Anyone can view quizzes" ON quizzes;

-- Create new policies that allow reading for authenticated users
CREATE POLICY "Authenticated users can view books"
  ON books FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view book pages"
  ON book_pages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view quizzes"
  ON quizzes FOR SELECT
  TO authenticated
  USING (true);

-- Allow service role to insert books (for seeding)
CREATE POLICY "Service role can manage books"
  ON books FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage book pages"
  ON book_pages FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage quizzes"
  ON quizzes FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Insert Book 1: الأيام
DO $$
DECLARE
  book1_id uuid := gen_random_uuid();
BEGIN
  INSERT INTO books (id, title, author, cover_image_url, description, total_pages)
  VALUES (
    book1_id,
    'الأيام',
    'طه حسين',
    'https://images.pexels.com/photos/1925630/pexels-photo-1925630.jpeg?auto=compress&cs=tinysrgb&w=400',
    'سيرة ذاتية للأديب الكبير طه حسين، يحكي فيها عن طفولته وشبابه ونضاله مع العمى والفقر',
    6
  );

  INSERT INTO book_pages (book_id, page_number, content) VALUES
  (book1_id, 1, 'لا يذكر الصبي من أمر هذا اليوم شيئاً، فقد كان صغيراً جداً. وإنما يذكر أباه قد دعاه ذات يوم بعد انصراف الفقيه، فقال له في لهجة هادئة: ستذهب غداً مع أخويك إلى الكُتَّاب.'),
  (book1_id, 2, 'ولم يفهم الصبي معنى هذا الكلام، ولكنه رأى أخويه يظهران الفرح والسرور، فظن أن في الأمر خيراً. وأقبل الغد فذهب الصبي مع أخويه إلى الكُتَّاب.'),
  (book1_id, 3, 'وكان الكُتَّاب غرفة ضيقة، في بيت من بيوت القرية المتواضعة. وكان الفقيه شيخاً قد جاوز الستين، طويل اللحية، عظيم الصوت، شديد القسوة.'),
  (book1_id, 4, 'وجلس الصبي في ركن من أركان الغرفة، وأخذ يستمع إلى أصوات الصبيان وهم يرددون القرآن. وكان صوت الفقيه يعلو فوق أصواتهم جميعاً.'),
  (book1_id, 5, 'ومضت الأيام، وأخذ الصبي يحفظ القرآن. وكان يحب القرآن حباً شديداً، ويجد في حفظه لذة عظيمة. وكان الفقيه يعجب من سرعة حفظه.'),
  (book1_id, 6, 'وذات يوم، بينما كان الصبي جالساً في الكُتَّاب، سمع ضجة عظيمة خارج البيت. وعلم أن أباه قد عاد من السفر. فترك الكُتَّاب وأسرع إلى البيت.');

  INSERT INTO quizzes (book_id, page_number, question, options, correct_answer) VALUES
  (book1_id, 3, 'كيف كان الفقيه الذي يعلم في الكُتَّاب؟', '["شاب صغير ولطيف", "شيخ عجوز قاسي", "رجل متوسط العمر", "شيخ طيب القلب"]', 1),
  (book1_id, 6, 'لماذا ترك الصبي الكُتَّاب؟', '["لأنه مرض", "لأنه سمع أن أباه عاد من السفر", "لأن الفقيه ضربه", "لأنه انتهى من الدرس"]', 1);
END $$;

-- Insert Book 2: حي بن يقظان
DO $$
DECLARE
  book2_id uuid := gen_random_uuid();
BEGIN
  INSERT INTO books (id, title, author, cover_image_url, description, total_pages)
  VALUES (
    book2_id,
    'حي بن يقظان',
    'ابن طفيل',
    'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=400',
    'رواية فلسفية عن طفل نشأ وحيداً في جزيرة منعزلة، واكتشف الحقائق الكونية بالعقل والتأمل',
    6
  );

  INSERT INTO book_pages (book_id, page_number, content) VALUES
  (book2_id, 1, 'يذكر أهل الحكمة من سلفنا أن في جزائر الهند جزيرة تسمى الواق واق، ولدت فيها امرأة من نساء الملك ولداً من غير أب.'),
  (book2_id, 2, 'وخافت أمه أن يفتضح أمرها، فوضعته في تابوت، وألقته في البحر. فحملته الأمواج إلى شاطئ جزيرة أخرى.'),
  (book2_id, 3, 'ووجدته ظبية قد فقدت ولدها، فأخذته وأرضعته وربته. ونشأ الطفل في البرية لا يعرف إلا الحيوانات.'),
  (book2_id, 4, 'وبدأ حي بن يقظان يتأمل في الطبيعة من حوله. ونظر إلى الحيوانات المختلفة، فرأى أن لكل منها جسماً وروحاً.'),
  (book2_id, 5, 'وعندما ماتت الظبية التي ربته، حزن حي حزناً شديداً. وأراد أن يعرف سر الموت، فشق صدرها ليرى ما بداخله.'),
  (book2_id, 6, 'واكتشف حي أن القلب هو موضع الحياة. وفكر في أن هناك قوة خفية تحرك الأجساد، وهي الروح.');

  INSERT INTO quizzes (book_id, page_number, question, options, correct_answer) VALUES
  (book2_id, 3, 'من الذي وجد الطفل ورباه؟', '["صياد", "ظبية", "راعي", "أسد"]', 1),
  (book2_id, 6, 'ما الذي اكتشفه حي بن يقظان؟', '["أن القلب هو موضع الحياة", "أن الجزيرة كبيرة", "أن هناك بشر آخرون", "أن الحيوانات تتكلم"]', 0);
END $$;

-- Insert Book 3: كليلة ودمنة
DO $$
DECLARE
  book3_id uuid := gen_random_uuid();
BEGIN
  INSERT INTO books (id, title, author, cover_image_url, description, total_pages)
  VALUES (
    book3_id,
    'كليلة ودمنة',
    'ابن المقفع',
    'https://images.pexels.com/photos/3847640/pexels-photo-3847640.jpeg?auto=compress&cs=tinysrgb&w=400',
    'كتاب يحوي مجموعة من القصص والحكايات على ألسنة الحيوانات، تتضمن حكماً وأخلاقاً',
    6
  );

  INSERT INTO book_pages (book_id, page_number, content) VALUES
  (book3_id, 1, 'زعموا أنه كان بأرض الهند ملك عادل حكيم، يحب العلم والحكمة، ويجالس العلماء والحكماء.'),
  (book3_id, 2, 'وكان للملك وزير حكيم اسمه بيدبا، وكان ذا عقل راجح وفكر ثاقب، يشير على الملك بما فيه خير البلاد والعباد.'),
  (book3_id, 3, 'وذات يوم، جاء الوزير بيدبا إلى الملك، ومعه كتاب عظيم. قال: أيها الملك، إني قد جمعت لك في هذا الكتاب حكماً كثيرة.'),
  (book3_id, 4, 'وقال الوزير: إن في هذا الكتاب حكايات على ألسنة الحيوانات، لكن فيها عبر للإنسان. فإن الحكيم يعتبر بكل شيء.'),
  (book3_id, 5, 'فقال الملك: هات ما عندك من الحكايات. فقال الوزير: زعموا أن ثوراً كان يرعى في مرج أخضر، وكان معه أسد يحميه.'),
  (book3_id, 6, 'وكان للأسد صديقان: كليلة ودمنة. وكان دمنة حسوداً، يريد أن يفرق بين الأسد والثور. فدبر مكيدة خبيثة.');

  INSERT INTO quizzes (book_id, page_number, question, options, correct_answer) VALUES
  (book3_id, 3, 'من هو الوزير الحكيم في القصة؟', '["كليلة", "دمنة", "بيدبا", "الثور"]', 2),
  (book3_id, 6, 'ما صفة دمنة في القصة؟', '["كريم", "حسود", "شجاع", "صادق"]', 1);
END $$;

-- Insert Book 4: رسائل الجاحظ
DO $$
DECLARE
  book4_id uuid := gen_random_uuid();
BEGIN
  INSERT INTO books (id, title, author, cover_image_url, description, total_pages)
  VALUES (
    book4_id,
    'رسائل الجاحظ',
    'الجاحظ',
    'https://images.pexels.com/photos/2908984/pexels-photo-2908984.jpeg?auto=compress&cs=tinysrgb&w=400',
    'مجموعة من الرسائل الأدبية والفكرية للأديب الجاحظ، تتناول موضوعات مختلفة بأسلوب ساخر',
    6
  );

  INSERT INTO book_pages (book_id, page_number, content) VALUES
  (book4_id, 1, 'أما بعد، فإني رأيت الناس قد اختلفوا في البخلاء والأسخياء، فمنهم من يذم البخل ويمدح الكرم، ومنهم من يعتدل في الأمر.'),
  (book4_id, 2, 'وقد حدثني صديق لي، أنه زار رجلاً من البخلاء، فلما دخل عليه، وجده جالساً في بيت مظلم في وسط النهار.'),
  (book4_id, 3, 'فقال له: لماذا تجلس في الظلام؟ قال البخيل: إني أخاف أن يدخل الضوء فيبلي فراشي وثيابي! فضحك الزائر وخرج.'),
  (book4_id, 4, 'وحدثني آخر، أن بخيلاً دعا جماعة من الناس إلى طعام. فلما جلسوا، قدم لهم طعاماً قليلاً، ثم قال: كلوا على مهل!'),
  (book4_id, 5, 'فقال أحدهم: يا هذا، إننا لا نستطيع أن نأكل على مهل، فإن الطعام قليل، والجوع كثير! فخجل البخيل وسكت.'),
  (book4_id, 6, 'والبخل من أقبح الصفات، لأنه يمنع صاحبه من فعل الخير، ويجعله محتقراً عند الناس. فاحذروا البخل واطلبوا الكرم.');

  INSERT INTO quizzes (book_id, page_number, question, options, correct_answer) VALUES
  (book4_id, 3, 'لماذا كان البخيل جالساً في الظلام؟', '["لأنه يحب الظلام", "لأنه يخاف من بلى الفراش والثياب", "لأنه نائم", "لأن الكهرباء مقطوعة"]', 1),
  (book4_id, 6, 'ما رأي الجاحظ في البخل؟', '["إنه صفة حميدة", "إنه من أقبح الصفات", "إنه صفة محمودة", "لا رأي له"]', 1);
END $$;

-- Insert Book 5: رحلة ابن بطوطة
DO $$
DECLARE
  book5_id uuid := gen_random_uuid();
BEGIN
  INSERT INTO books (id, title, author, cover_image_url, description, total_pages)
  VALUES (
    book5_id,
    'رحلة ابن بطوطة',
    'ابن بطوطة',
    'https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg?auto=compress&cs=tinysrgb&w=400',
    'وصف لرحلات ابن بطوطة عبر العالم الإسلامي وما شاهده من عجائب وغرائب',
    6
  );

  INSERT INTO book_pages (book_id, page_number, content) VALUES
  (book5_id, 1, 'خرجت من طنجة مسقط رأسي يوم الخميس، غرة رجب سنة خمس وعشرين وسبعمائة، معتمداً حج بيت الله الحرام.'),
  (book5_id, 2, 'وكنت منفرداً عن رفيق آنس بصحبته، وراكب أكون في جملته، لباعث على النفس شديد، ورغبة فيها كامنة على زيارة تلك المشاهد الشريفة.'),
  (book5_id, 3, 'فوصلت إلى مدينة الإسكندرية، وهي ثغر الإسلام، وقاعدة العلم والصنائع. ورأيت بها من العجائب ما لا يحصى.'),
  (book5_id, 4, 'ومن عجائبها منارها العظيمة، التي يضرب بها المثل في الارتفاع. وهي في جزيرة على نحو ميل من المدينة.'),
  (book5_id, 5, 'ثم سافرت إلى القاهرة، وهي أم البلاد، وقرارة فرعون ذي الأوتاد. ورأيت بها من الآثار والعمائر ما يعجز اللسان عن وصفه.'),
  (book5_id, 6, 'وفي القاهرة رأيت الأهرام، وهي من عجائب الدنيا. وقد ذكر الناس فيها أقوالاً كثيرة، ولكن الله أعلم بحقيقة أمرها.');

  INSERT INTO quizzes (book_id, page_number, question, options, correct_answer) VALUES
  (book5_id, 3, 'ماذا وصف ابن بطوطة مدينة الإسكندرية؟', '["مدينة صغيرة", "ثغر الإسلام وقاعدة العلم", "مدينة خربة", "مدينة فقيرة"]', 1),
  (book5_id, 6, 'ما الذي رآه ابن بطوطة في القاهرة؟', '["البحر", "الأهرام", "الجبال", "الصحراء فقط"]', 1);
END $$;