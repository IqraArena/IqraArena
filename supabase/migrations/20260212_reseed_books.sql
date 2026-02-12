/*
  # Reseed Books Data
  
  1. Purpose
     - Ensure all 6 books (5 original + 1 new test book) exist in the database.
     - Bypass RLS restrictions by using a migration (server-side execution).
  
  2. Content
     - Checks for existence of each book by title.
     - Inserts missing books, pages, and quizzes.
*/

-- Book 1: الأيام
DO $$
DECLARE
  book_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM books WHERE title = 'الأيام') THEN
    book_id := gen_random_uuid();
    
    INSERT INTO books (id, title, author, cover_image_url, description, total_pages)
    VALUES (
      book_id,
      'الأيام',
      'طه حسين',
      'https://images.pexels.com/photos/1925630/pexels-photo-1925630.jpeg?auto=compress&cs=tinysrgb&w=400',
      'سيرة ذاتية للأديب الكبير طه حسين، يحكي فيها عن طفولته وشبابه ونضاله مع العمى والفقر',
      6
    );

    INSERT INTO book_pages (book_id, page_number, content) VALUES
    (book_id, 1, 'لا يذكر الصبي من أمر هذا اليوم شيئاً، فقد كان صغيراً جداً. وإنما يذكر أباه قد دعاه ذات يوم بعد انصراف الفقيه، فقال له في لهجة هادئة: ستذهب غداً مع أخويك إلى الكُتَّاب.'),
    (book_id, 2, 'ولم يفهم الصبي معنى هذا الكلام، ولكنه رأى أخويه يظهران الفرح والسرور، فظن أن في الأمر خيراً. وأقبل الغد فذهب الصبي مع أخويه إلى الكُتَّاب.'),
    (book_id, 3, 'وكان الكُتَّاب غرفة ضيقة، في بيت من بيوت القرية المتواضعة. وكان الفقيه شيخاً قد جاوز الستين، طويل اللحية، عظيم الصوت، شديد القسوة.'),
    (book_id, 4, 'وجلس الصبي في ركن من أركان الغرفة، وأخذ يستمع إلى أصوات الصبيان وهم يرددون القرآن. وكان صوت الفقيه يعلو فوق أصواتهم جميعاً.'),
    (book_id, 5, 'ومضت الأيام، وأخذ الصبي يحفظ القرآن. وكان يحب القرآن حباً شديداً، ويجد في حفظه لذة عظيمة. وكان الفقيه يعجب من سرعة حفظه.'),
    (book_id, 6, 'وذات يوم، بينما كان الصبي جالساً في الكُتَّاب، سمع ضجة عظيمة خارج البيت. وعلم أن أباه قد عاد من السفر. فترك الكُتَّاب وأسرع إلى البيت.');

    INSERT INTO quizzes (book_id, page_number, question, options, correct_answer) VALUES
    (book_id, 3, 'كيف كان الفقيه الذي يعلم في الكُتَّاب؟', '["شاب صغير ولطيف", "شيخ عجوز قاسي", "رجل متوسط العمر", "شيخ طيب القلب"]', 1),
    (book_id, 6, 'لماذا ترك الصبي الكُتَّاب؟', '["لأنه مرض", "لأنه سمع أن أباه عاد من السفر", "لأن الفقيه ضربه", "لأنه انتهى من الدرس"]', 1);
  END IF;
END $$;

-- Book 2: حي بن يقظان
DO $$
DECLARE
  book_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM books WHERE title = 'حي بن يقظان') THEN
    book_id := gen_random_uuid();
    
    INSERT INTO books (id, title, author, cover_image_url, description, total_pages)
    VALUES (
      book_id,
      'حي بن يقظان',
      'ابن طفيل',
      'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=400',
      'رواية فلسفية عن طفل نشأ وحيداً في جزيرة منعزلة، واكتشف الحقائق الكونية بالعقل والتأمل',
      6
    );

    INSERT INTO book_pages (book_id, page_number, content) VALUES
    (book_id, 1, 'يذكر أهل الحكمة من سلفنا أن في جزائر الهند جزيرة تسمى الواق واق، ولدت فيها امرأة من نساء الملك ولداً من غير أب.'),
    (book_id, 2, 'وخافت أمه أن يفتضح أمرها، فوضعته في تابوت، وألقته في البحر. فحملته الأمواج إلى شاطئ جزيرة أخرى.'),
    (book_id, 3, 'ووجدته ظبية قد فقدت ولدها، فأخذته وأرضعته وربته. ونشأ الطفل في البرية لا يعرف إلا الحيوانات.'),
    (book_id, 4, 'وبدأ حي بن يقظان يتأمل في الطبيعة من حوله. ونظر إلى الحيوانات المختلفة، فرأى أن لكل منها جسماً وروحاً.'),
    (book_id, 5, 'وعندما ماتت الظبية التي ربته، حزن حي حزناً شديداً. وأراد أن يعرف سر الموت، فشق صدرها ليرى ما بداخله.'),
    (book_id, 6, 'واكتشف حي أن القلب هو موضع الحياة. وفكر في أن هناك قوة خفية تحرك الأجساد، وهي الروح.');

    INSERT INTO quizzes (book_id, page_number, question, options, correct_answer) VALUES
    (book_id, 3, 'من الذي وجد الطفل ورباه؟', '["صياد", "ظبية", "راعي", "أسد"]', 1),
    (book_id, 6, 'ما الذي اكتشفه حي بن يقظان؟', '["أن القلب هو موضع الحياة", "أن الجزيرة كبيرة", "أن هناك بشر آخرون", "أن الحيوانات تتكلم"]', 0);
  END IF;
END $$;

-- Book 3: كليلة ودمنة
DO $$
DECLARE
  book_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM books WHERE title = 'كليلة ودمنة') THEN
    book_id := gen_random_uuid();
    
    INSERT INTO books (id, title, author, cover_image_url, description, total_pages)
    VALUES (
      book_id,
      'كليلة ودمنة',
      'ابن المقفع',
      'https://images.pexels.com/photos/3847640/pexels-photo-3847640.jpeg?auto=compress&cs=tinysrgb&w=400',
      'كتاب يحوي مجموعة من القصص والحكايات على ألسنة الحيوانات، تتضمن حكماً وأخلاقاً',
      6
    );

    INSERT INTO book_pages (book_id, page_number, content) VALUES
    (book_id, 1, 'زعموا أنه كان بأرض الهند ملك عادل حكيم، يحب العلم والحكمة، ويجالس العلماء والحكماء.'),
    (book_id, 2, 'وكان للملك وزير حكيم اسمه بيدبا، وكان ذا عقل راجح وفكر ثاقب، يشير على الملك بما فيه خير البلاد والعباد.'),
    (book_id, 3, 'وذات يوم، جاء الوزير بيدبا إلى الملك، ومعه كتاب عظيم. قال: أيها الملك، إني قد جمعت لك في هذا الكتاب حكماً كثيرة.'),
    (book_id, 4, 'وقال الوزير: إن في هذا الكتاب حكايات على ألسنة الحيوانات، لكن فيها عبر للإنسان. فإن الحكيم يعتبر بكل شيء.'),
    (book_id, 5, 'فقال الملك: هات ما عندك من الحكايات. فقال الوزير: زعموا أن ثوراً كان يرعى في مرج أخضر، وكان معه أسد يحميه.'),
    (book_id, 6, 'وكان للأسد صديقان: كليلة ودمنة. وكان دمنة حسوداً، يريد أن يفرق بين الأسد والثور. فدبر مكيدة خبيثة.');

    INSERT INTO quizzes (book_id, page_number, question, options, correct_answer) VALUES
    (book_id, 3, 'من هو الوزير الحكيم في القصة؟', '["كليلة", "دمنة", "بيدبا", "الثور"]', 2),
    (book_id, 6, 'ما صفة دمنة في القصة؟', '["كريم", "حسود", "شجاع", "صادق"]', 1);
  END IF;
END $$;

-- Book 4: رسائل الجاحظ
DO $$
DECLARE
  book_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM books WHERE title = 'رسائل الجاحظ') THEN
    book_id := gen_random_uuid();
    
    INSERT INTO books (id, title, author, cover_image_url, description, total_pages)
    VALUES (
      book_id,
      'رسائل الجاحظ',
      'الجاحظ',
      'https://images.pexels.com/photos/2908984/pexels-photo-2908984.jpeg?auto=compress&cs=tinysrgb&w=400',
      'مجموعة من الرسائل الأدبية والفكرية للأديب الجاحظ، تتناول موضوعات مختلفة بأسلوب ساخر',
      6
    );

    INSERT INTO book_pages (book_id, page_number, content) VALUES
    (book_id, 1, 'أما بعد، فإني رأيت الناس قد اختلفوا في البخلاء والأسخياء، فمنهم من يذم البخل ويمدح الكرم، ومنهم من يعتدل في الأمر.'),
    (book_id, 2, 'وقد حدثني صديق لي، أنه زار رجلاً من البخلاء، فلما دخل عليه، وجده جالساً في بيت مظلم في وسط النهار.'),
    (book_id, 3, 'فقال له: لماذا تجلس في الظلام؟ قال البخيل: إني أخاف أن يدخل الضوء فيبلي فراشي وثيابي! فضحك الزائر وخرج.'),
    (book_id, 4, 'وحدثني آخر، أن بخيلاً دعا جماعة من الناس إلى طعام. فلما جلسوا، قدم لهم طعاماً قليلاً، ثم قال: كلوا على مهل!'),
    (book_id, 5, 'فقال أحدهم: يا هذا، إننا لا نستطيع أن نأكل على مهل، فإن الطعام قليل، والجوع كثير! فخجل البخيل وسكت.'),
    (book_id, 6, 'والبخل من أقبح الصفات، لأنه يمنع صاحبه من فعل الخير، ويجعله محتقراً عند الناس. فاحذروا البخل واطلبوا الكرم.');

    INSERT INTO quizzes (book_id, page_number, question, options, correct_answer) VALUES
    (book_id, 3, 'لماذا كان البخيل جالساً في الظلام؟', '["لأنه يحب الظلام", "لأنه يخاف من بلى الفراش والثياب", "لأنه نائم", "لأن الكهرباء مقطوعة"]', 1),
    (book_id, 6, 'ما رأي الجاحظ في البخل؟', '["إنه صفة حميدة", "إنه من أقبح الصفات", "إنه صفة محمودة", "لا رأي له"]', 1);
  END IF;
END $$;

-- Book 5: رحلة ابن بطوطة
DO $$
DECLARE
  book_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM books WHERE title = 'رحلة ابن بطوطة') THEN
    book_id := gen_random_uuid();
    
    INSERT INTO books (id, title, author, cover_image_url, description, total_pages)
    VALUES (
      book_id,
      'رحلة ابن بطوطة',
      'ابن بطوطة',
      'https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg?auto=compress&cs=tinysrgb&w=400',
      'وصف لرحلات ابن بطوطة عبر العالم الإسلامي وما شاهده من عجائب وغرائب',
      6
    );

    INSERT INTO book_pages (book_id, page_number, content) VALUES
    (book_id, 1, 'خرجت من طنجة مسقط رأسي يوم الخميس، غرة رجب سنة خمس وعشرين وسبعمائة، معتمداً حج بيت الله الحرام.'),
    (book_id, 2, 'وكنت منفرداً عن رفيق آنس بصحبته، وراكب أكون في جملته، لباعث على النفس شديد، ورغبة فيها كامنة على زيارة تلك المشاهد الشريفة.'),
    (book_id, 3, 'فوصلت إلى مدينة الإسكندرية، وهي ثغر الإسلام، وقاعدة العلم والصنائع. ورأيت بها من العجائب ما لا يحصى.'),
    (book_id, 4, 'ومن عجائبها منارها العظيمة، التي يضرب بها المثل في الارتفاع. وهي في جزيرة على نحو ميل من المدينة.'),
    (book_id, 5, 'ثم سافرت إلى القاهرة، وهي أم البلاد، وقرارة فرعون ذي الأوتاد. ورأيت بها من الآثار والعمائر ما يعجز اللسان عن وصفه.'),
    (book_id, 6, 'وفي القاهرة رأيت الأهرام، وهي من عجائب الدنيا. وقد ذكر الناس فيها أقوالاً كثيرة، ولكن الله أعلم بحقيقة أمرها.');

    INSERT INTO quizzes (book_id, page_number, question, options, correct_answer) VALUES
    (book_id, 3, 'ماذا وصف ابن بطوطة مدينة الإسكندرية؟', '["مدينة صغيرة", "ثغر الإسلام وقاعدة العلم", "مدينة خربة", "مدينة فقيرة"]', 1),
    (book_id, 6, 'ما الذي رآه ابن بطوطة في القاهرة؟', '["البحر", "الأهرام", "الجبال", "الصحراء فقط"]', 1);
  END IF;
END $$;

-- Book 6: رحلة الأيام العشرة (Test Book)
DO $$
DECLARE
  book_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM books WHERE title = 'رحلة الأيام العشرة') THEN
    book_id := gen_random_uuid();
    
    INSERT INTO books (id, title, author, cover_image_url, description, total_pages)
    VALUES (
      book_id,
      'رحلة الأيام العشرة',
      'مغامر',
      'https://images.pexels.com/photos/256395/pexels-photo-256395.jpeg?auto=compress&cs=tinysrgb&w=400',
      'كتاب تجريبي يحتوي على 10 صفحات لاختبار نظام القراءة والتتبع.',
      10
    );

    INSERT INTO book_pages (book_id, page_number, content) VALUES
    (book_id, 1, 'هذه هي الصفحة الأولى من رحلة الأيام العشرة.'),
    (book_id, 2, 'في اليوم الثاني، استمرينا في المشي نحو الهدف.'),
    (book_id, 3, 'اليوم الثالث كان مليئاً بالتحديات والعقبات.'),
    (book_id, 4, 'في اليوم الرابع، وجدنا واحة جميلة للراحة.'),
    (book_id, 5, 'اليوم الخامس، تعلمنا درساً جديداً في الصبر.'),
    (book_id, 6, 'في اليوم السادس، التقينا بأصدقاء جدد في الطريق.'),
    (book_id, 7, 'اليوم السابع كان يوماً هادئاً للتأمل.'),
    (book_id, 8, 'في اليوم الثامن، اقتربنا كثيراً من وجهتنا.'),
    (book_id, 9, 'اليوم التاسع، بدأنا نرى ملامح النهاية.'),
    (book_id, 10, 'وأخيراً، في اليوم العاشر، وصلنا إلى هدفنا بنجاح.');

    INSERT INTO quizzes (book_id, page_number, question, options, correct_answer) VALUES
    (book_id, 5, 'ماذا تعلمنا في اليوم الخامس؟', '["الصبر", "السرعة", "النوم", "الأكل"]', 0),
    (book_id, 10, 'متى وصلنا إلى الهدف؟', '["اليوم الأول", "اليوم الخامس", "اليوم العاشر", "لم نصل"]', 2);
  END IF;
END $$;
