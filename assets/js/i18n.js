/* ==========================================================================
   SAWN — content & translations (EN / AR)
   Arabic copy follows the official SAWN Arabic profile (24 slides).
   ========================================================================== */
window.SAWN_I18N = (() => {
  /* ---- Contact details -------------------------------------------------
     TODO(client): set SAWN's email address below. While empty, the email
     row shows "Address to follow" instead of a link.                       */
  const CONTACT = {
    email: '',
    phones: ['009647722222222', '009647822222222'],
  };

  const line = (i, html, extra = '') => `<span class="line" style="--i:${i}"${extra}><span>${html}</span></span>`;
  const hidden = ' aria-hidden="true"';

  const STR = {
    en: {
      'doc.title': 'SAWN — Business Advisory & Development',
      skip: 'Skip to content',
      'hud.home': 'SAWN — back to top',
      'lang.label': 'Language',
      'idx.open': 'Index', 'idx.close': 'Close',
      'menu.aria': 'Site index',
      'ch.1': 'Overview', 'ch.2': 'Practice', 'ch.3': 'Method', 'ch.4': 'Contact',
      'menu.d1': 'Who we are', 'menu.d2': '14 disciplines', 'menu.d3': 'How we work', 'menu.d4': 'Contact us',
      'menu.pathways': 'Pathways', 'menu.pathwaysList': 'Launch<br>Transform<br>Accelerate',
      'menu.principle': 'Principle', 'menu.principleText': '<em>From vision to execution.<br>From challenges to growth.</em>',

      'hero.m1': '(Est.) Business Advisory &amp; Development',
      'hero.m2': '<b class="ar-word" lang="ar">صَوْن</b>&nbsp; <i>Ṣawn</i> — to safeguard, to preserve',
      'hero.m3': 'Launch — Transform — Accelerate',
      'hero.title': line(0, 'One partner.', hidden) + line(1, '<em>Complete</em>', hidden) + line(2, 'business', hidden) + line(3, 'solutions.', hidden),
      'hero.titleAria': 'One partner. Complete business solutions.',
      'hero.lede': 'From business creation to transformation, growth and execution — advisory, supervision or hands-on management, shaped around what each client needs.',
      'hero.scroll': 'Scroll',
      'hero.fig': 'Fig. 01 — Silk vortex, wireframe study',

      'about.label': '01.1 — Who we are',
      'about.note': 'Each engagement is tailored to the client’s goals and priorities.',
      'about.statement': 'Your strategic partner in business. We help entrepreneurs and organizations <em>build, improve and grow</em> — connecting strategy, operations, brand, technology and measurable results.',
      'about.vH': 'Vision', 'about.vP': 'To be a trusted partner in building efficient, sustainable businesses.',
      'about.mH': 'Mission', 'about.mP': 'Practical solutions combining diagnosis, planning and delivery.',
      'about.wH': 'Why SAWN', 'about.wP': 'One integrated partner — business, management, branding and technology expertise, focused on execution.',
      'about.values': 'Values: Trust, Clarity, Accountability, Innovation',

      'prac.label': '02 — Service ecosystem',
      'prac.title': line(0, 'Fourteen connected') + line(1, 'areas of <em>expertise.</em>'),
      'prac.aside': 'Integrated solutions across the business lifecycle — building new businesses from concept to operation, resolving waste and underperformance in existing companies, and strengthening brands, systems and leadership.',
      'prac.count': '04 Practices · 14 Disciplines',
      'prac.disciplines': 'Disciplines', 'prac.practice': 'Practice', 'prac.focus': 'Focus', 'prac.fig': 'Fig.',

      'meth.label': '03 — How we work',
      'meth.w1': 'Diagnose.', 'meth.d1': 'Understand the current situation, challenges and objectives.',
      'meth.w2': 'Design.', 'meth.d2': 'Define the roadmap, responsibilities and performance measures.',
      'meth.w3': 'Execute.', 'meth.d3': 'Execute solutions or supervise delivery as agreed.',
      'meth.w4': 'Measure.', 'meth.d4': 'Measure outcomes and continuously improve.',
      'meth.manifesto': 'We connect strategy, operations, brand, technology and <b>measurable results.</b> Every engagement is tailored to the client’s stage and specific needs — advisory, supervision or direct implementation. We combine business, management, branding and technology expertise into one partner, and we hold ourselves to practical, measurable and <b>sustainable outcomes.</b> From vision to <b>execution.</b> From challenges to <b>growth.</b>',

      'path.label': '03.1 — Three client pathways',
      'path.title': line(0, 'Launch. Transform.') + line(1, '<em>Accelerate.</em>'),
      'path.n1': 'P—01', 'path.t1': 'Launch', 'path.d1': 'Create and establish a new business from scratch.',
      'path.n2': 'P—02', 'path.t2': 'Transform', 'path.d2': 'Repair performance, structure and brand positioning.',
      'path.n3': 'P—03', 'path.t3': 'Accelerate', 'path.d3': 'Scale revenue, sales and market presence.',

      'eng.label': '03.2 — Engagement models',
      'eng.sub': 'Flexible support for every business — choose advisory, supervision or direct implementation.',
      'eng.rows':
        '<li><span class="mono">A</span><span class="ledger__t">Advisory</span><span class="ledger__d">Diagnosis, analysis, recommendations and action plans.</span></li>' +
        '<li><span class="mono">B</span><span class="ledger__t">Advisory <em>+</em> Supervision</span><span class="ledger__d">Guide and monitor the client’s team.</span></li>' +
        '<li><span class="mono">C</span><span class="ledger__t">End-to-End Execution</span><span class="ledger__d">Lead, implement and manage the project.</span></li>' +
        '<li><span class="mono">—</span><span class="ledger__t">Commercial models</span><span class="ledger__d">Project fees, retainers or agreed incentives.</span></li>',

      'con.label': '04 — Contact us',
      'con.giant': `<span class="line" style="--i:0" aria-hidden="true"><span class="fill" data-text="Let’s build">Let’s build</span></span><span class="line" style="--i:1" aria-hidden="true"><span class="fill fill--em" data-text="what’s next.">what’s next.</span></span>`,
      'con.giantAria': 'Let’s build what’s next.',
      'con.next':
        '<li><span class="mono">01</span><p>Tell us about your business idea or operational challenges.</p></li>' +
        '<li><span class="mono">02</span><p>Together we define the scope, timeline and engagement model.</p></li>' +
        '<li><span class="mono">03</span><p>From vision to execution. From challenges to growth.</p></li>',
      'con.reach': 'Direct lines',
      'con.email': 'Email', 'con.phone': 'Phone',
      'con.write': 'Write', 'con.call': 'Call', 'con.copy': 'Copy', 'con.copied': 'Copied',
      'con.copiedSr': 'Copied to clipboard',
      'con.pending': 'Address to follow',

      'foot.1': '© 2026 SAWN — <span class="ar-word">صَوْن</span>',
      'foot.2': 'Business Advisory &amp; Development',
      'foot.top': 'Back to top ↑',
      'buddy.aria': 'SAWN logo — tap to spin, drag to play',
      'h.hint': 'Scroll to travel →',
    },

    ar: {
      'doc.title': 'صَوْن — استشارات وتطوير الأعمال',
      skip: 'انتقل إلى المحتوى',
      'hud.home': 'صَوْن — العودة إلى الأعلى',
      'lang.label': 'اللغة',
      'idx.open': 'الفهرس', 'idx.close': 'إغلاق',
      'menu.aria': 'فهرس الموقع',
      'ch.1': 'نظرة عامة', 'ch.2': 'الخدمات', 'ch.3': 'المنهجية', 'ch.4': 'تواصل',
      'menu.d1': 'من نحن', 'menu.d2': 'أربعة عشر مجالاً', 'menu.d3': 'كيف نعمل', 'menu.d4': 'تواصل معنا',
      'menu.pathways': 'المسارات', 'menu.pathwaysList': 'إطلاق<br>تحوّل<br>تسريع',
      'menu.principle': 'المبدأ', 'menu.principleText': '<em>من الرؤية إلى التنفيذ،<br>ومن التحديات إلى النمو.</em>',

      'hero.m1': 'استشارات وتطوير الأعمال',
      'hero.m2': '<b>صَوْن</b>&nbsp; — <i>الحفظ والرعاية والإتقان</i>',
      'hero.m3': 'إطلاق — تحوّل — تسريع',
      'hero.title': line(0, 'شريكٌ واحد', hidden) + line(1, 'لحلول أعمال', hidden) + line(2, '<em>متكاملة.</em>', hidden),
      'hero.titleAria': 'شريك واحد لحلول أعمال متكاملة.',
      'hero.lede': 'من تأسيس الأعمال إلى تطويرها وتحويلها وتنفيذ حلولها — استشارات، أو إشراف، أو إدارة وتنفيذ مباشر حسب الاتفاق.',
      'hero.scroll': 'مرّر',
      'hero.fig': 'شكل 01 — دوّامة حريرية، دراسة خطّية',

      'about.label': '01.1 — من نحن',
      'about.note': 'نحدّد نطاق عمل واضحاً لكل مشروع وفق احتياجات العميل.',
      'about.statement': 'شريك استراتيجي في رحلة الأعمال. نساعد روّاد الأعمال والمؤسسات على <em>البناء والتطوير والنمو</em> — ونربط الاستراتيجية بالعمليات والهوية والتقنية والنتائج.',
      'about.vH': 'الرؤية', 'about.vP': 'أن نكون شريكاً موثوقاً لبناء مؤسسات أكثر كفاءة واستدامة.',
      'about.mH': 'الرسالة', 'about.mP': 'حلول عملية تجمع التشخيص والتخطيط والتنفيذ والقياس.',
      'about.wH': 'لماذا صَوْن؟', 'about.wP': 'شريك واحد برؤية متكاملة — يجمع بين الأعمال والإدارة والعلامة والتقنية، ويركّز على النتائج العملية.',
      'about.values': 'قيمنا: الثقة، الوضوح، المسؤولية، الابتكار',

      'prac.label': '02 — منظومة خدمات صَوْن',
      'prac.title': line(0, 'أربعة عشر مجالاً') + line(1, '<em>مترابطاً.</em>'),
      'prac.aside': 'خدمات متكاملة عبر دورة حياة المشروع — نؤسّس الأعمال الجديدة من الفكرة إلى التشغيل، ونعالج الهدر والتحديات في الشركات القائمة، ونطوّر العلامة التجارية والأنظمة والإدارة ونقود النمو.',
      'prac.count': '04 ممارسات · 14 مجالاً',
      'prac.disciplines': 'المجالات', 'prac.practice': 'الممارسة', 'prac.focus': 'التركيز', 'prac.fig': 'شكل',

      'meth.label': '03 — منهجية التنفيذ',
      'meth.w1': 'التشخيص.', 'meth.d1': 'فهم الوضع الحالي والاحتياجات والأهداف.',
      'meth.w2': 'التصميم.', 'meth.d2': 'إعداد خارطة طريق ومسؤوليات ومؤشرات واضحة.',
      'meth.w3': 'التنفيذ.', 'meth.d3': 'تنفيذ الحلول أو الإشراف عليها حسب الاتفاق.',
      'meth.w4': 'القياس.', 'meth.d4': 'قياس النتائج وإجراء التحسين المستمر.',
      'meth.manifesto': 'نربط الاستراتيجية بالعمليات والهوية والتقنية <b>والنتائج.</b> نحدّد لكل مشروع نطاق عمل واضحاً وفق مرحلة الشركة واحتياجاتها — استشارةً، أو إشرافاً، أو تنفيذاً فعلياً. نجمع بين الأعمال والإدارة والعلامة والتقنية في شريك واحد، ونلتزم بنتائج عملية <b>قابلة للقياس ومستدامة.</b> من الرؤية إلى <b>التنفيذ،</b> ومن التحديات إلى <b>النمو.</b>',

      'path.label': '03.1 — مسارات العملاء',
      'path.title': line(0, 'إطلاق. تحوّل.') + line(1, '<em>تسريع.</em>'),
      'path.n1': 'مسار 01', 'path.t1': 'إطلاق', 'path.d1': 'صَوْن للإطلاق: بناء المشروع من الصفر.',
      'path.n2': 'مسار 02', 'path.t2': 'تحوّل', 'path.d2': 'صَوْن للتحوّل: إصلاح الأداء وإعادة الهيكلة والهوية.',
      'path.n3': 'مسار 03', 'path.t3': 'تسريع', 'path.d3': 'صَوْن للتسريع: النمو والتوسع وتطوير المبيعات.',

      'eng.label': '03.2 — نماذج التعاون',
      'eng.sub': 'مرونة وفق احتياج كل عميل — استشارة، أو إشراف، أو تنفيذ فعلي.',
      'eng.rows':
        '<li><span class="mono">أ</span><span class="ledger__t">الاستشارات</span><span class="ledger__d">تشخيص وتحليل وتوصيات وخطة عمل.</span></li>' +
        '<li><span class="mono">ب</span><span class="ledger__t">الاستشارات <em>+</em> الإشراف</span><span class="ledger__d">متابعة تنفيذ فريق العميل.</span></li>' +
        '<li><span class="mono">ج</span><span class="ledger__t">التنفيذ المتكامل</span><span class="ledger__d">قيادة المشروع وتنفيذه وإدارته.</span></li>' +
        '<li><span class="mono">—</span><span class="ledger__t">النماذج التجارية</span><span class="ledger__d">أتعاب مشروع، أو عقد شهري، أو حوافز أداء متفق عليها.</span></li>',

      'con.label': '04 — تواصل معنا',
      'con.giant': `<span class="line" style="--i:0" aria-hidden="true"><span class="fill" data-text="لنبدأ">لنبدأ</span></span><span class="line" style="--i:1" aria-hidden="true"><span class="fill fill--em" data-text="معاً.">معاً.</span></span>`,
      'con.giantAria': 'لنبدأ معاً.',
      'con.next':
        '<li><span class="mono">01</span><p>ناقشنا بفكرة مشروعك أو التحديات التي تواجه شركتك.</p></li>' +
        '<li><span class="mono">02</span><p>نحدّد معاً نطاق العمل والجدول الزمني ونموذج التعاون.</p></li>' +
        '<li><span class="mono">03</span><p>من الرؤية إلى التنفيذ، ومن التحديات إلى النمو.</p></li>',
      'con.reach': 'قنوات التواصل المباشر',
      'con.email': 'البريد الإلكتروني', 'con.phone': 'الهاتف',
      'con.write': 'راسلنا', 'con.call': 'اتصل', 'con.copy': 'نسخ', 'con.copied': 'تم النسخ',
      'con.copiedSr': 'تم النسخ إلى الحافظة',
      'con.pending': 'يُعلَن قريباً',

      'foot.1': '© 2026 صَوْن — <span class="ltr">SAWN</span>',
      'foot.2': 'استشارات وتطوير الأعمال',
      'foot.top': 'العودة إلى الأعلى ↑',
      'buddy.aria': 'شعار صَوْن — انقر ليدور، واسحبه للّعب',
      'h.hint': 'مرّر للتنقّل ←',
    },
  };

  const CURSOR_AR = {
    Explore: 'استكشف', Open: 'افتح', Drag: 'اسحب', Go: 'انتقل', Top: 'للأعلى', Scroll: 'مرّر',
    Write: 'راسلنا', Call: 'اتصل', Copy: 'انسخ', Lang: 'اللغة', Close: 'أغلق', Play: 'العب',
  };

  const MARQUEE = {
    en: ['Trust', 'Clarity', 'Accountability', 'Innovation'],
    ar: ['الثقة', 'الوضوح', 'المسؤولية', 'الابتكار'],
  };

  /* Static background "tattoo" — revealed only under the cursor */
  const TATTOO = {
    en: { word: ['S', 'A', 'W', 'N'], row: 'SAWN — صَوْن — BUSINESS ADVISORY & DEVELOPMENT — LAUNCH · TRANSFORM · ACCELERATE — ' },
    ar: { word: ['صَوْن'], row: 'صَوْن — استشارات وتطوير الأعمال — إطلاق · تحوّل · تسريع — SAWN — ' },
  };

  /* ---- Practices: 4 practices · 14 disciplines (profile slides 06–19) --- */
  const PRACTICES = [
    {
      id: '01', art: 'genesis',
      en: { title: 'Create', em: 'from idea', tag: 'Designing and engineering bespoke digital products, software and technical infrastructure — from the ground up.', focus: 'New ventures', fig: 'Genesis',
        d: [
          ['Business Creation — A to Z', 'From idea to fully operating business', ['Assess the opportunity, concept and business model.', 'Develop feasibility, financial projections and operating plans.', 'Design the brand, organization, processes and core systems.', 'Support setup, hiring, procurement, launch and early operations.']],
          ['Market Research & Feasibility', 'Make investment decisions with evidence', ['Analyze market size, demand and target customer segments.', 'Review competitors, pricing and distribution channels.', 'Model costs, revenues, cash flow and investment requirements.', 'Evaluate risks, scenarios and break-even points.']],
        ] },
      ar: { title: 'التأسيس', em: 'من الفكرة', tag: 'نصمّم ونهندس منتجات رقمية وبرمجيات وبنى تقنية مُفصّلة على المقاس — من الأساس.', focus: 'مشاريع جديدة', fig: 'النشأة',
        d: [
          ['تأسيس المشاريع من الصفر', 'من الفكرة إلى التشغيل الكامل', ['تقييم الفكرة والفرصة الاستثمارية ونموذج العمل.', 'دراسة الجدوى والتخطيط المالي والتشغيلي.', 'تطوير الهوية والهيكل التنظيمي والإجراءات والأنظمة.', 'دعم التأسيس والتوظيف والتجهيز والإطلاق والمتابعة.']],
          ['دراسات السوق والجدوى', 'قرارات استثمارية مبنية على معلومات', ['تحليل حجم السوق والطلب والعملاء المستهدفين.', 'دراسة المنافسين والأسعار وقنوات التوزيع.', 'تقدير التكاليف والإيرادات والتدفقات النقدية.', 'تحليل المخاطر والسيناريوهات ونقطة التعادل.']],
        ] },
    },
    {
      id: '02', art: 'convergence',
      en: { title: 'Optimize', em: 'performance', tag: 'Auditing, accelerating and hardening existing workflows, systems and operations for peak performance and security.', focus: 'Existing businesses', fig: 'Convergence',
        d: [
          ['Waste Reduction & Optimization', 'Lower costs. Improve performance.', ['Identify financial, operational and administrative inefficiencies.', 'Review procurement, inventory and supply-chain performance.', 'Redesign workflows to reduce delays, errors and rework.', 'Track savings and operational improvements through KPIs.']],
          ['Growth & Expansion Strategy', 'Turn current performance into new potential', ['Refine revenue models, positioning and pricing strategies.', 'Improve sales channels, conversion and customer acquisition.', 'Assess new branches, geographic markets and expansion options.', 'Set realistic growth targets and review progress regularly.']],
          ['Sales Performance Management', 'Convert opportunities into results', ['Build a structured sales pipeline and customer follow-up process.', 'Develop sales teams, incentives, coaching and training.', 'Analyze profitability by product, customer and channel.', 'Monitor sales KPIs, forecasts and commercial performance.']],
          ['SAWN Business Health Check', 'A practical diagnostic for existing businesses', ['Review finance, sales, operations and human resources.', 'Assess technology, brand, customer experience and governance.', 'Identify risks, gaps and high-impact improvement opportunities.', 'Deliver a diagnostic report and prioritized 90-day action plan.']],
        ] },
      ar: { title: 'التحسين', em: 'الأداء', tag: 'ندقّق سير العمل والأنظمة والعمليات القائمة، ونسرّعها ونحصّنها لتبلغ ذروة الأداء والأمان.', focus: 'شركات قائمة', fig: 'التقارب',
        d: [
          ['معالجة الهدر وتحسين الأداء', 'رفع الكفاءة وتقليل التكاليف', ['تشخيص الهدر المالي والتشغيلي والإداري.', 'مراجعة المشتريات والمخزون وسلسلة الإمداد.', 'إعادة تصميم الإجراءات وتقليل التأخير والأخطاء.', 'بناء مؤشرات أداء لقياس الوفورات والتحسين.']],
          ['استراتيجية النمو والتوسع', 'من المبيعات الحالية إلى طموحات أكبر', ['تطوير نموذج الإيرادات واستراتيجية التسعير.', 'تحسين قنوات البيع ورفع معدلات التحويل.', 'دراسة التوسع الجغرافي والفروع والأسواق الجديدة.', 'وضع أهداف نمو واقعية وخطط متابعة دورية.']],
          ['إدارة أداء المبيعات', 'تحويل الفرص إلى نتائج', ['تصميم مسار المبيعات وآليات متابعة العملاء.', 'تطوير فرق البيع والحوافز والتدريب.', 'تحليل الربحية بحسب المنتج والعميل والقناة.', 'متابعة مؤشرات الأداء والتوقعات التجارية.']],
          ['الفحص الشامل للشركات', 'الفحص الشامل لصحة الأعمال', ['فحص المالية والمبيعات والتشغيل والموارد البشرية.', 'تقييم التقنية والهوية وتجربة العملاء والحوكمة.', 'تحديد المخاطر والفجوات وفرص التحسين.', 'تسليم تقرير تشخيص وخارطة أولويات لمدة تسعين يوماً.']],
        ] },
    },
    {
      id: '03', art: 'signature',
      en: { title: 'Brand', em: 'presence', tag: 'Crafting unmistakable visual identities and architectural digital presences that command lasting authority.', focus: 'Market presence', fig: 'Signature',
        d: [
          ['Branding & Rebranding', 'More than a logo — a complete brand strategy', ['Assess brand perception and competitive positioning.', 'Develop naming, messaging, identity and brand architecture.', 'Improve content, digital presence and customer touchpoints.', 'Plan and execute new brand launches or full rebrands.']],
          ['Customer Experience', 'Better journeys. Stronger loyalty.', ['Map the customer journey and identify friction points.', 'Improve service quality, response standards and complaint handling.', 'Define customer-experience metrics and satisfaction measures.', 'Strengthen retention through consistent service improvement.']],
          ['Digital & Cloud Solutions', 'Technology aligned with business objectives', ['Design cloud architecture, migration and security approaches.', 'Implement ERP and CRM systems aligned with workflows.', 'Automate processes and integrate suitable AI applications.', 'Deliver analytics and management reporting dashboards.']],
        ] },
      ar: { title: 'العلامة', em: 'الحضور', tag: 'نصوغ هويات بصرية لا تُخطئها العين، وحضوراً رقمياً معمارياً يفرض مكانة راسخة تدوم.', focus: 'الحضور في السوق', fig: 'التوقيع',
        d: [
          ['الهوية وإعادة بناء العلامة', 'براندنغ وري براندنغ شامل', ['تقييم الصورة الذهنية ومكانة العلامة في السوق.', 'بناء الاستراتيجية والاسم والرسالة والهوية البصرية.', 'تطوير المحتوى والحضور الرقمي ونقاط التواصل.', 'تنفيذ خطة إطلاق أو إعادة إطلاق العلامة.']],
          ['تجربة العميل', 'رحلة عميل أفضل وولاء أعلى', ['رسم رحلة العميل وتحديد نقاط الضعف.', 'تحسين جودة الخدمة وآليات الشكاوى والاستجابة.', 'تصميم معايير تجربة العملاء وقياس الرضا.', 'رفع الاحتفاظ بالعملاء عبر تحسين التجربة.']],
          ['التحول الرقمي والحلول السحابية', 'تقنية تخدم أهداف الأعمال', ['تصميم البنية السحابية وخطط الانتقال والحماية.', 'أنظمة تخطيط الموارد وإدارة علاقات العملاء.', 'أتمتة الإجراءات ودمج تطبيقات الذكاء الاصطناعي.', 'تحليل البيانات ولوحات المعلومات الإدارية.']],
        ] },
    },
    {
      id: '04', art: 'framework',
      en: { title: 'Structure', em: 'governance', tag: 'Building scalable business foundations, operational frameworks and strategic roadmaps engineered for long-term growth.', focus: 'Organization & finance', fig: 'Framework',
        d: [
          ['Strategy & Restructuring', 'Create a clearer, stronger organization', ['Develop strategic plans and target operating models.', 'Clarify roles, responsibilities and decision rights.', 'Restructure departments and workflows where required.', 'Manage organizational change and implementation progress.']],
          ['Governance & Policies', 'Better decisions and greater transparency', ['Create policies, procedures and organizational manuals.', 'Define authorities, approval workflows and internal controls.', 'Develop management reporting and accountability matrices.', 'Coordinate with specialist legal and compliance advisers as needed.']],
          ['Financial Advisory & Planning', 'Financial visibility for better decisions', ['Prepare budgets, forecasts and cash-flow plans.', 'Analyze cost structures, margins and profitability.', 'Develop financial reports and performance dashboards.', 'Plan working capital and future funding requirements.']],
          ['Fractional Finance & Operations', 'Senior expertise without a full-time appointment', ['Provide a fractional CFO under an agreed scope of work.', 'Arrange fractional COO or technology leadership where needed.', 'Oversee reporting, budgets, priorities and relevant teams.', 'Offer defined-term assignments or monthly retainers.']],
          ['Human Resources & Talent', 'Build the right team for growth', ['Plan workforce requirements and organizational structures.', 'Support recruitment, selection and job descriptions.', 'Develop performance reviews, incentives and training.', 'Improve workplace culture, capability and productivity.']],
        ] },
      ar: { title: 'الهيكلة', em: 'الحوكمة', tag: 'نبني أسس أعمال قابلة للتوسّع، وأطراً تشغيلية، وخرائط طريق استراتيجية مُصمَّمة لنموّ طويل الأمد.', focus: 'التنظيم والمالية', fig: 'الإطار',
        d: [
          ['الاستراتيجية وإعادة الهيكلة', 'مؤسسة أوضح وأقوى', ['إعداد الخطة الاستراتيجية ونموذج التشغيل.', 'تحديد الأدوار والصلاحيات والمسؤوليات.', 'إعادة هيكلة الإدارات والعمليات عند الحاجة.', 'إدارة التغيير ومتابعة تطبيق التحسينات.']],
          ['الحوكمة والسياسات', 'ضبط القرار ورفع الشفافية', ['إعداد السياسات والإجراءات والأدلة التنظيمية.', 'تصميم الصلاحيات وآليات الموافقة والرقابة.', 'تطوير التقارير الإدارية ومصفوفة المسؤوليات.', 'التنسيق مع المختصين للأعمال القانونية والرقابية.']],
          ['الاستشارات والتخطيط المالي', 'رؤية مالية تدعم القرار', ['إعداد الموازنات والتوقعات والتدفقات النقدية.', 'تحليل التكاليف والهوامش والربحية.', 'تطوير التقارير ولوحات الأداء المالي.', 'تخطيط رأس المال العامل واحتياجات التمويل.']],
          ['مدير مالي أو تشغيلي جزئي', 'خبرات قيادية دون توظيف دائم', ['توفير مدير مالي جزئي وفق نطاق عمل متفق عليه.', 'إتاحة مدير عمليات أو مدير تقنية جزئي عند الحاجة.', 'الإشراف على التقارير والميزانيات وفرق العمل.', 'التكليف لمدة محددة أو بعقد متابعة شهري.']],
          ['الموارد البشرية وتطوير المواهب', 'الفريق المناسب للنمو', ['تخطيط القوى العاملة والهيكل الوظيفي.', 'دعم التوظيف والاختيار والتوصيف الوظيفي.', 'تطوير تقييم الأداء والحوافز والتدريب.', 'تحسين ثقافة العمل والإنتاجية.']],
        ] },
    },
  ];

  return { CONTACT, STR, CURSOR_AR, MARQUEE, TATTOO, PRACTICES };
})();
