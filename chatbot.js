/* ===== AZ Khonnect Chatbot ===== */
(function () {
  'use strict';

  /* ---------- Knowledge Base ---------- */
  const KB = {
    company: {
      name: 'AZ Khonnect',
      fullName: 'AlphaZeta Khonnect',
      location: 'Belgium (Brussels area)',
      website: 'az-k.be',
      phone: null,
      email: 'info@az-k.be',
      careersEmail: 'career@az-k.be',
      founder: 'Zacharia Janssen',
      industries: ['Insurance', 'Finance', 'Logistics', 'HR', 'Hospitality', 'Non-profits'],
      techStack: ['Python', 'SQL', 'PostgreSQL', 'JavaScript', 'XML', 'Odoo', 'AFAS', 'Apache Airflow', 'Jira', 'Confluence', 'Power BI', 'Git', 'Linux'],
    },
    services: [
      { id: 'software', name: 'Custom Software Development', price: '\u20AC2,250\u2013\u20AC37,500', details: 'Python, JavaScript, Odoo modules, system integration. Tailored solutions built to your exact specifications.' },
      { id: 'crm', name: 'CRM Implementation', price: '\u20AC1,125\u2013\u20AC11,250', details: 'Odoo CRM, custom CRM solutions, data migration, and team training included.' },
      { id: 'data', name: 'Data Warehousing & Analytics', price: '\u20AC2,250\u2013\u20AC26,250', details: 'PostgreSQL, ELT pipelines, Apache Airflow orchestration, Power BI dashboards.' },
      { id: 'process', name: 'Process Optimisation', price: '\u20AC1,500\u2013\u20AC15,000', details: 'Workflow automation, cross-system optimization, KPI frameworks.' },
      { id: 'wms', name: 'Warehouse Management Systems', price: '\u20AC1,875\u2013\u20AC30,000', details: 'Inventory tracking, workforce planning, logistics optimization.' },
      { id: 'consulting', name: 'IT Consulting', price: '\u20AC600\u2013\u20AC900/day', details: 'Strategy, architecture, Atlassian setup, digital transformation advisory.' },
      { id: 'web', name: 'Website & Web App Development', price: '\u20AC375\u2013\u20AC22,500', details: 'Responsive websites, multilingual support, hosting included.' },
      { id: 'support', name: 'Support & Maintenance', price: '\u20AC375\u2013\u20AC3,750/month', details: '24/7 monitoring, security patches, SLA tiers (Bronze/Silver/Gold).' },
    ],
    projects: [
      { id: 'patronale', client: 'Patronale Life NV', work: 'CRM implementation, Data Warehouse, ERP customization for the insurance sector.' },
      { id: 'gorillas', client: 'Gorillas', work: 'WMS development, process optimization, rider operations management.' },
      { id: 'formation', client: 'Formation 3.0', work: 'Accounting system, analytics dashboards, HRIS implementation.' },
      { id: 'cneu', client: 'CNEU', work: 'Accounting automation and financial process streamlining.' },
    ],
  };

  /* ---------- Multi-language Responses ---------- */
  const LANG = {
    en: {
      greeting: "Hello! I'm the AZ Khonnect assistant. How can I help you today?",
      fallback: "I'm not sure I understood that. Here are some topics I can help with:",
      fallbackContact: "Or you can reach us directly:\n\u2022 Email: info@az-k.be\n\u2022 Live Chat: Use the chatbot on any page",
      services: "We offer 8 professional IT services, all priced 25% below market rate:",
      servicesDetail: function (s) { return '**' + s.name + '** (' + s.price + ')\n' + s.details; },
      pricing: "All our services are priced 25% below market rate. Here's an overview:",
      pricingLine: function (s) { return '\u2022 ' + s.name + ': ' + s.price; },
      projects: "Here are some of our key projects:",
      projectLine: function (p) { return '\u2022 **' + p.client + '**: ' + p.work; },
      contact: "You can reach AZ Khonnect through:\n\u2022 Email: info@az-k.be\n\u2022 Website: az-k.be\n\u2022 Careers: career@az-k.be\n\u2022 Client Portal: az-k.be/login",
      about: "AZ Khonnect (AlphaZeta Khonnect) is a Belgian IT consulting company based in the Brussels area, founded by Zacharia Janssen. We serve industries including Insurance, Finance, Logistics, HR, Hospitality, and Non-profits.",
      tech: "Our tech stack includes: Python, SQL, PostgreSQL, JavaScript, XML, Odoo, AFAS, Apache Airflow, Jira, Confluence, Power BI, Git, and Linux.",
      careers: "Interested in joining AZ Khonnect? Send your CV and cover letter to career@az-k.be. We're always looking for talented IT professionals!",
      industries: "We serve: Insurance, Finance, Logistics, HR, Hospitality, and Non-profits. Our solutions are tailored to each industry's specific needs.",
      founder: "AZ Khonnect was founded by Zacharia Janssen, with a vision to deliver enterprise-grade IT solutions at accessible pricing.",
      thanks: "You're welcome! Is there anything else I can help you with?",
      goodbye: "Thank you for chatting with us! Don't hesitate to reach out anytime. Have a great day!",
      placeholder: "Type your message...",
    },
    nl: {
      greeting: "Hallo! Ik ben de AZ Khonnect assistent. Hoe kan ik u helpen?",
      fallback: "Ik ben niet zeker of ik dat begreep. Hier zijn enkele onderwerpen waarmee ik kan helpen:",
      fallbackContact: "Of neem rechtstreeks contact met ons op:\n\u2022 E-mail: info@az-k.be\n\u2022 Live Chat: Gebruik de chatbot op elke pagina",
      services: "Wij bieden 8 professionele IT-diensten aan, allemaal 25% onder de marktprijs:",
      servicesDetail: function (s) { return '**' + s.name + '** (' + s.price + ')\n' + s.details; },
      pricing: "Al onze diensten zijn 25% onder de marktprijs geprijsd. Hier is een overzicht:",
      pricingLine: function (s) { return '\u2022 ' + s.name + ': ' + s.price; },
      projects: "Hier zijn enkele van onze belangrijkste projecten:",
      projectLine: function (p) { return '\u2022 **' + p.client + '**: ' + p.work; },
      contact: "U kunt AZ Khonnect bereiken via:\n\u2022 E-mail: info@az-k.be\n\u2022 Website: az-k.be\n\u2022 Vacatures: career@az-k.be\n\u2022 Klantenportaal: az-k.be/login",
      about: "AZ Khonnect (AlphaZeta Khonnect) is een Belgisch IT-consultancybedrijf gevestigd in de regio Brussel, opgericht door Zacharia Janssen. Wij bedienen sectoren zoals Verzekeringen, Financie\u0308n, Logistiek, HR, Horeca en Non-profits.",
      tech: "Onze technologie\u00EBn omvatten: Python, SQL, PostgreSQL, JavaScript, XML, Odoo, AFAS, Apache Airflow, Jira, Confluence, Power BI, Git en Linux.",
      careers: "Interesse om bij AZ Khonnect te werken? Stuur uw CV en motivatiebrief naar career@az-k.be. Wij zijn altijd op zoek naar getalenteerde IT-professionals!",
      industries: "Wij bedienen: Verzekeringen, Financie\u0308n, Logistiek, HR, Horeca en Non-profits.",
      founder: "AZ Khonnect is opgericht door Zacharia Janssen, met de visie om IT-oplossingen van ondernemingsniveau aan te bieden tegen toegankelijke prijzen.",
      thanks: "Graag gedaan! Kan ik u nog ergens anders mee helpen?",
      goodbye: "Bedankt voor het gesprek! Aarzel niet om ons te contacteren. Een fijne dag!",
      placeholder: "Typ uw bericht...",
    },
    fr: {
      greeting: "Bonjour ! Je suis l'assistant AZ Khonnect. Comment puis-je vous aider ?",
      fallback: "Je ne suis pas s\u00FBr d'avoir compris. Voici quelques sujets sur lesquels je peux vous aider :",
      fallbackContact: "Ou contactez-nous directement :\n\u2022 Email : info@az-k.be\n\u2022 Live Chat : Utilisez le chatbot sur n'importe quelle page",
      services: "Nous proposons 8 services IT professionnels, tous 25% en dessous du prix du march\u00E9 :",
      servicesDetail: function (s) { return '**' + s.name + '** (' + s.price + ')\n' + s.details; },
      pricing: "Tous nos services sont 25% en dessous du prix du march\u00E9. Voici un aper\u00E7u :",
      pricingLine: function (s) { return '\u2022 ' + s.name + ' : ' + s.price; },
      projects: "Voici quelques-uns de nos projets cl\u00E9s :",
      projectLine: function (p) { return '\u2022 **' + p.client + '** : ' + p.work; },
      contact: "Vous pouvez contacter AZ Khonnect via :\n\u2022 Email : info@az-k.be\n\u2022 Site web : az-k.be\n\u2022 Carri\u00E8res : career@az-k.be\n\u2022 Portail Client : az-k.be/login",
      about: "AZ Khonnect (AlphaZeta Khonnect) est une soci\u00E9t\u00E9 belge de conseil IT bas\u00E9e dans la r\u00E9gion de Bruxelles, fond\u00E9e par Zacharia Janssen. Nous servons les secteurs de l'Assurance, la Finance, la Logistique, les RH, l'H\u00F4tellerie et les associations.",
      tech: "Notre stack technologique comprend : Python, SQL, PostgreSQL, JavaScript, XML, Odoo, AFAS, Apache Airflow, Jira, Confluence, Power BI, Git et Linux.",
      careers: "Int\u00E9ress\u00E9(e) par AZ Khonnect ? Envoyez votre CV et lettre de motivation \u00E0 career@az-k.be. Nous recherchons toujours des professionnels IT talentueux !",
      industries: "Nous servons : Assurance, Finance, Logistique, RH, H\u00F4tellerie et Associations.",
      founder: "AZ Khonnect a \u00E9t\u00E9 fond\u00E9e par Zacharia Janssen, avec la vision de fournir des solutions IT de niveau entreprise \u00E0 des prix accessibles.",
      thanks: "Je vous en prie ! Puis-je vous aider avec autre chose ?",
      goodbye: "Merci pour cette conversation ! N'h\u00E9sitez pas \u00E0 nous recontacter. Bonne journ\u00E9e !",
      placeholder: "Tapez votre message...",
    },
  };

  /* ---------- Intent Matching Rules ---------- */
  const INTENTS = [
    {
      id: 'greeting',
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy',
        'hallo', 'hoi', 'goedemorgen', 'goedemiddag', 'goedenavond', 'dag',
        'bonjour', 'salut', 'bonsoir', 'coucou'],
      handler: function (lang) {
        return { text: LANG[lang].greeting, quickReplies: qr('main', lang) };
      },
    },
    {
      id: 'thanks',
      keywords: ['thank', 'thanks', 'thx', 'ty', 'appreciate', 'bedankt', 'dankjewel', 'dankuwel', 'dank', 'merci', 'remercie'],
      handler: function (lang) {
        return { text: LANG[lang].thanks, quickReplies: qr('main', lang) };
      },
    },
    {
      id: 'goodbye',
      keywords: ['bye', 'goodbye', 'see you later', 'tot ziens', 'doei', 'au revoir', 'a bientot', 'adieu'],
      exactOnly: true,
      handler: function (lang) {
        return { text: LANG[lang].goodbye, quickReplies: [] };
      },
    },
    {
      id: 'question',
      keywords: ['i have a question', 'question', 'can i ask', 'i want to ask', 'ik heb een vraag', 'vraag', 'une question', 'jai une question',
        'help', 'help me', 'can you help', 'i need help', 'help nodig', 'hulp', 'besoin aide', 'aidez moi'],
      handler: function (lang) {
        var msg = lang === 'nl'
          ? 'Natuurlijk! Waar kan ik u mee helpen? U kunt vragen stellen over onze diensten, projecten, prijzen of contact informatie.'
          : lang === 'fr'
            ? 'Bien s\u00FBr ! Comment puis-je vous aider ? Vous pouvez poser des questions sur nos services, projets, tarifs ou coordonn\u00E9es.'
            : 'Of course! What would you like to know? Feel free to ask about our services, projects, pricing, or anything else.';
        return { text: msg, quickReplies: ['Services', 'Pricing', 'Projects', 'Contact'] };
      },
    },
    {
      id: 'services_overview',
      keywords: ['services', 'what do you do', 'what do you offer', 'offerings', 'solutions', 'diensten', 'wat bieden jullie', 'wat doen jullie',
        'services', 'que proposez', 'que faites', 'offres', 'service'],
      handler: function (lang) {
        var t = LANG[lang];
        var lines = [t.services, ''];
        KB.services.forEach(function (s) { lines.push('\u2022 ' + s.name + ' (' + s.price + ')'); });
        return { text: lines.join('\n'), quickReplies: KB.services.slice(0, 4).map(function (s) { return s.name; }).concat(['All Pricing']) };
      },
    },
    {
      id: 'pricing',
      keywords: ['pricing', 'price', 'cost', 'how much', 'rates', 'tarif', 'budget', 'expensive', 'cheap', 'affordable', 'quote',
        'prijs', 'kosten', 'hoeveel', 'kost', 'tarief', 'goedkoop', 'betaalbaar',
        'prix', 'combien', 'cout', 'coute', 'tarif', 'devis', 'cher', 'abordable'],
      handler: function (lang) {
        var t = LANG[lang];
        var lines = [t.pricing, ''];
        KB.services.forEach(function (s) { lines.push(t.pricingLine(s)); });
        lines.push('', lang === 'nl' ? 'Alle prijzen zijn 25% onder de marktprijs!' : lang === 'fr' ? 'Tous les prix sont 25% en dessous du march\u00E9 !' : 'All prices are 25% below market rate!');
        return { text: lines.join('\n'), quickReplies: ['Custom Software', 'CRM', 'IT Consulting', 'Contact Sales'] };
      },
    },
    {
      id: 'software',
      keywords: ['custom software', 'software development', 'python', 'odoo module', 'integration', 'system integration', 'app development',
        'software ontwikkeling', 'softwareontwikkeling', 'maatwerk',
        'developpement logiciel', 'logiciel', 'developpement sur mesure'],
      handler: function (lang) {
        var s = KB.services[0];
        return { text: LANG[lang].servicesDetail(s), quickReplies: ['Pricing Overview', 'Our Projects', 'Contact Sales'] };
      },
    },
    {
      id: 'crm',
      keywords: ['crm', 'customer relationship', 'odoo crm', 'data migration', 'klantenbeheer', 'gestion client', 'relation client'],
      handler: function (lang) {
        var s = KB.services[1];
        return { text: LANG[lang].servicesDetail(s), quickReplies: ['CRM Pricing', 'CRM Projects', 'Contact Sales'] };
      },
    },
    {
      id: 'data',
      keywords: ['data warehouse', 'data warehousing', 'analytics', 'dashboard', 'power bi', 'elt', 'etl', 'airflow', 'business intelligence', 'bi',
        'datawarehouse', 'gegevensanalyse', 'analyse', 'tableau de bord', 'entrepot de donnees', 'analyse de donnees'],
      handler: function (lang) {
        var s = KB.services[2];
        return { text: LANG[lang].servicesDetail(s), quickReplies: ['Data Projects', 'Pricing Overview', 'Contact Sales'] };
      },
    },
    {
      id: 'process',
      keywords: ['process', 'optimization', 'optimisation', 'workflow', 'automation', 'kpi', 'automate',
        'procesoptimalisatie', 'automatisering', 'werkstroom',
        'optimisation des processus', 'automatisation', 'flux de travail'],
      handler: function (lang) {
        var s = KB.services[3];
        return { text: LANG[lang].servicesDetail(s), quickReplies: ['Process Projects', 'Pricing Overview', 'Contact Sales'] };
      },
    },
    {
      id: 'wms',
      keywords: ['warehouse', 'wms', 'inventory', 'logistics', 'supply chain', 'workforce planning',
        'magazijn', 'magazijnbeheer', 'logistiek', 'voorraad',
        'entrepot', 'logistique', 'inventaire', 'gestion entrepot'],
      handler: function (lang) {
        var s = KB.services[4];
        return { text: LANG[lang].servicesDetail(s), quickReplies: ['WMS Projects', 'Pricing Overview', 'Contact Sales'] };
      },
    },
    {
      id: 'consulting',
      keywords: ['consulting', 'consultant', 'strategy', 'architecture', 'atlassian', 'jira', 'confluence', 'digital transformation',
        'advies', 'raadgeving', 'strategie', 'digitale transformatie',
        'conseil', 'conseiller', 'strategie', 'transformation digitale'],
      handler: function (lang) {
        var s = KB.services[5];
        return { text: LANG[lang].servicesDetail(s), quickReplies: ['Consulting Rate', 'Our Tech Stack', 'Contact Sales'] };
      },
    },
    {
      id: 'web',
      keywords: ['website', 'web app', 'web development', 'webapp', 'responsive', 'hosting', 'multilingual', 'site',
        'website ontwikkeling', 'webontwikkeling',
        'developpement web', 'site web', 'hebergement'],
      handler: function (lang) {
        var s = KB.services[6];
        return { text: LANG[lang].servicesDetail(s), quickReplies: ['Web Pricing', 'Our Projects', 'Contact Sales'] };
      },
    },
    {
      id: 'support',
      keywords: ['support', 'maintenance', 'monitoring', 'sla', 'security', 'patch', 'uptime',
        'ondersteuning', 'onderhoud', 'beveiliging',
        'support', 'maintenance', 'securite', 'surveillance'],
      handler: function (lang) {
        var s = KB.services[7];
        return { text: LANG[lang].servicesDetail(s), quickReplies: ['Support Tiers', 'Pricing Overview', 'Contact Us'] };
      },
    },
    {
      id: 'projects',
      keywords: ['project', 'projects', 'portfolio', 'case study', 'clients', 'references', 'work',
        'projecten', 'referenties', 'klanten',
        'projets', 'references', 'etude de cas', 'realisations'],
      handler: function (lang) {
        var t = LANG[lang];
        var lines = [t.projects, ''];
        KB.projects.forEach(function (p) { lines.push(t.projectLine(p)); });
        return { text: lines.join('\n'), quickReplies: ['Patronale Life', 'Gorillas', 'Formation 3.0', 'CNEU'] };
      },
    },
    {
      id: 'patronale',
      keywords: ['patronale', 'insurance crm', 'insurance project', 'insurance data', 'patronale life'],
      handler: function (lang) {
        var p = KB.projects[0];
        return { text: '**' + p.client + '**\n' + p.work, quickReplies: ['CRM Service', 'Data Warehouse', 'Other Projects'] };
      },
    },
    {
      id: 'gorillas',
      keywords: ['gorillas', 'rider', 'delivery', 'gorilla'],
      handler: function (lang) {
        var p = KB.projects[1];
        return { text: '**' + p.client + '**\n' + p.work, quickReplies: ['WMS Service', 'Process Optimisation', 'Other Projects'] };
      },
    },
    {
      id: 'formation',
      keywords: ['formation', 'formation 3', 'formation 3.0', 'hris'],
      handler: function (lang) {
        var p = KB.projects[2];
        return { text: '**' + p.client + '**\n' + p.work, quickReplies: ['Accounting', 'Analytics', 'Other Projects'] };
      },
    },
    {
      id: 'cneu',
      keywords: ['cneu', 'accounting automation'],
      handler: function (lang) {
        var p = KB.projects[3];
        return { text: '**' + p.client + '**\n' + p.work, quickReplies: ['Accounting', 'Process Optimisation', 'Other Projects'] };
      },
    },
    {
      id: 'contact',
      keywords: ['contact', 'phone', 'email', 'call', 'reach', 'get in touch',
        'telefoon', 'bellen', 'e-mail', 'bereiken', 'contacteren',
        'telephone', 'appeler', 'contacter', 'joindre'],
      handler: function (lang) {
        return { text: LANG[lang].contact, quickReplies: ['Services', 'Projects', 'Careers'] };
      },
    },
    {
      id: 'about',
      keywords: ['about', 'who are you', 'company', 'az khonnect', 'alphazeta', 'belgium', 'brussels',
        'over ons', 'wie zijn jullie', 'bedrijf', 'belgie', 'brussel',
        'a propos', 'qui etes vous', 'entreprise', 'belgique', 'bruxelles', 'societe'],
      handler: function (lang) {
        return { text: LANG[lang].about, quickReplies: ['Our Founder', 'Industries', 'Tech Stack', 'Services'] };
      },
    },
    {
      id: 'tech',
      keywords: ['tech stack', 'technology', 'technologies', 'tools', 'postgresql', 'sql', 'javascript', 'xml', 'afas', 'git', 'linux',
        'technologie', 'technologieen', 'gereedschappen',
        'technologie', 'outils', 'stack technique'],
      handler: function (lang) {
        return { text: LANG[lang].tech, quickReplies: ['Services', 'Projects', 'Contact Us'] };
      },
    },
    {
      id: 'careers',
      keywords: ['career', 'careers', 'job', 'jobs', 'vacancy', 'vacancies', 'hiring', 'apply', 'work for you', 'join',
        'vacature', 'vacatures', 'baan', 'werken', 'solliciteren',
        'carriere', 'emploi', 'postuler', 'recrutement', 'offre emploi'],
      handler: function (lang) {
        return { text: LANG[lang].careers, quickReplies: ['About Us', 'Services', 'Contact Us'] };
      },
    },
    {
      id: 'industries',
      keywords: ['industry', 'industries', 'sector', 'sectors', 'insurance', 'finance', 'hospitality', 'non-profit', 'nonprofit', 'hr',
        'sector', 'sectoren', 'verzekering', 'financien', 'horeca',
        'secteur', 'secteurs', 'assurance', 'hotellerie'],
      handler: function (lang) {
        return { text: LANG[lang].industries, quickReplies: ['Services', 'Projects', 'Contact Us'] };
      },
    },
    {
      id: 'founder',
      keywords: ['founder', 'founded', 'zacharia', 'janssen', 'ceo', 'owner', 'who started',
        'oprichter', 'opgericht',
        'fondateur', 'fonde', 'createur'],
      handler: function (lang) {
        return { text: LANG[lang].founder, quickReplies: ['About Us', 'Services', 'Contact Us'] };
      },
    },
    {
      id: 'location',
      keywords: ['location', 'address', 'where', 'office', 'based',
        'locatie', 'adres', 'waar', 'kantoor',
        'localisation', 'adresse', 'ou', 'bureau', 'siege'],
      handler: function (lang) {
        var msg = lang === 'nl'
          ? 'AZ Khonnect is gevestigd in de regio Brussel, Belgi\u00EB.\n\nNeem contact met ons op:\n\u2022 E-mail: info@az-k.be\n\u2022 Website: az-k.be'
          : lang === 'fr'
            ? 'AZ Khonnect est bas\u00E9 dans la r\u00E9gion de Bruxelles, Belgique.\n\nContactez-nous :\n\u2022 Email : info@az-k.be\n\u2022 Site web : az-k.be'
            : 'AZ Khonnect is based in the Brussels area, Belgium.\n\nReach us at:\n\u2022 Email: info@az-k.be\n\u2022 Website: az-k.be';
        return { text: msg, quickReplies: ['About Us', 'Services', 'Contact Us'] };
      },
    },
  ];

  /* ---------- Quick Reply Presets ---------- */
  function qr(type, lang) {
    if (type === 'main') return ['Services', 'Pricing', 'Projects', 'Contact'];
    if (type === 'fallback') return ['Services', 'Projects', 'Contact'];
    return [];
  }

  /* ---------- Language Detection ---------- */
  var currentLang = 'en';

  function detectLanguage(text) {
    var lower = text.toLowerCase();
    var nlWords = ['hallo', 'hoi', 'dag', 'wat', 'hoe', 'kost', 'prijs', 'diensten', 'projecten', 'bedankt', 'dankjewel', 'informatie',
      'jullie', 'kunnen', 'helpen', 'graag', 'alstublieft', 'goedemorgen', 'welke', 'meer', 'over', 'werken', 'vacature'];
    var frWords = ['bonjour', 'salut', 'comment', 'combien', 'prix', 'merci', 'aide', 'aidez', 'services', 'projets', 'pouvez',
      'cherche', 'travail', 'emploi', 'entreprise', 'quels', 'quelles', 'bonsoir', 'bienvenue', 'quel', 'quelle', 'faire', 'proposez'];
    var nlCount = 0, frCount = 0;
    nlWords.forEach(function (w) { if (lower.indexOf(w) !== -1) nlCount++; });
    frWords.forEach(function (w) { if (lower.indexOf(w) !== -1) frCount++; });
    if (nlCount > frCount && nlCount >= 1) return 'nl';
    if (frCount > nlCount && frCount >= 1) return 'fr';
    return currentLang;
  }

  /* ---------- Fuzzy Match ---------- */
  function normalise(str) {
    return str.toLowerCase()
      .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o').replace(/[ùúûü]/g, 'u').replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function matchIntent(input) {
    var norm = normalise(input);
    var words = norm.split(' ');
    var bestMatch = null;
    var bestScore = 0;

    INTENTS.forEach(function (intent) {
      var score = 0;
      intent.keywords.forEach(function (kw) {
        var nkw = normalise(kw);
        // Exact phrase match in input
        if (norm.indexOf(nkw) !== -1) {
          score += nkw.split(' ').length * 3;
        } else if (!intent.exactOnly) {
          // Partial word match (skip for exactOnly intents)
          var kwWords = nkw.split(' ');
          kwWords.forEach(function (kww) {
            words.forEach(function (w) {
              if (w === kww) score += 2;
              else if (w.length > 4 && kww.length > 4 && (w.indexOf(kww) !== -1 || kww.indexOf(w) !== -1)) score += 1;
              // Levenshtein for fuzzy (only for words > 5 chars to avoid false positives)
              else if (w.length > 5 && kww.length > 5 && levenshtein(w, kww) <= 1) score += 1;
            });
          });
        }
      });
      if (score > bestScore) {
        bestScore = score;
        bestMatch = intent;
      }
    });

    return bestScore >= 2 ? bestMatch : null;
  }

  function levenshtein(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    var matrix = [];
    for (var i = 0; i <= b.length; i++) matrix[i] = [i];
    for (var j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (var i = 1; i <= b.length; i++) {
      for (var j = 1; j <= a.length; j++) {
        var cost = b.charAt(i - 1) === a.charAt(j - 1) ? 0 : 1;
        matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
      }
    }
    return matrix[b.length][a.length];
  }

  /* ---------- Fallback with Suggestions ---------- */
  function fallbackResponse(lang) {
    var t = LANG[lang];
    var suggestions = ['Services', 'Pricing', 'Projects', 'Contact', 'About Us', 'Careers'];
    var top3 = suggestions.slice(0, 3);
    return {
      text: t.fallback + '\n\u2022 ' + top3.join('\n\u2022 ') + '\n\n' + t.fallbackContact,
      quickReplies: top3,
    };
  }

  /* ---------- Process Message ---------- */
  function processMessage(input) {
    var lang = detectLanguage(input);
    currentLang = lang;

    var intent = matchIntent(input);
    if (intent) {
      return intent.handler(lang);
    }
    return fallbackResponse(lang);
  }

  /* ---------- Format bot text (simple markdown bold) ---------- */
  function formatText(text) {
    return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  }

  /* ---------- Timestamp ---------- */
  function timeStamp() {
    var d = new Date();
    return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
  }

  /* ---------- DOM Helpers ---------- */
  var panel, messagesEl, quickRepliesEl, inputEl, toggleBtn, closeBtn, sendBtn;

  function init() {
    panel = document.getElementById('chatbot-panel');
    messagesEl = document.getElementById('chatbot-messages');
    quickRepliesEl = document.getElementById('chatbot-quick-replies');
    inputEl = document.getElementById('chatbot-input');
    toggleBtn = document.getElementById('chatbot-toggle');
    closeBtn = document.getElementById('chatbot-close');
    sendBtn = document.getElementById('chatbot-send');

    if (!panel || !messagesEl || !inputEl || !toggleBtn) return;

    toggleBtn.addEventListener('click', function () {
      var isOpen = panel.classList.contains('open');
      if (isOpen) {
        closePanel();
      } else {
        openPanel();
      }
    });

    closeBtn.addEventListener('click', closePanel);

    sendBtn.addEventListener('click', function () { sendUserMessage(); });
    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') sendUserMessage();
    });

    // Show initial greeting if no messages yet
    if (messagesEl.children.length === 0) {
      addBotMessage(LANG[currentLang].greeting, qr('main', currentLang));
    }
  }

  function openPanel() {
    panel.style.display = 'flex';
    // Force reflow for animation
    panel.offsetHeight;
    panel.classList.add('open');
    inputEl.focus();
    scrollToBottom();
  }

  function closePanel() {
    panel.classList.remove('open');
    setTimeout(function () {
      if (!panel.classList.contains('open')) panel.style.display = 'none';
    }, 300);
  }

  function addBotMessage(text, quickReplies) {
    var div = document.createElement('div');
    div.className = 'chatbot-msg bot';
    div.innerHTML = formatText(text) + '<span class="chatbot-msg-time">' + timeStamp() + '</span>';
    messagesEl.appendChild(div);
    scrollToBottom();
    setQuickReplies(quickReplies || []);
  }

  function addUserMessage(text) {
    var div = document.createElement('div');
    div.className = 'chatbot-msg user';
    div.innerHTML = formatText(text) + '<span class="chatbot-msg-time">' + timeStamp() + '</span>';
    messagesEl.appendChild(div);
    scrollToBottom();
  }

  function showTyping() {
    var div = document.createElement('div');
    div.className = 'chatbot-typing';
    div.id = 'chatbot-typing-indicator';
    div.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(div);
    scrollToBottom();
  }

  function hideTyping() {
    var el = document.getElementById('chatbot-typing-indicator');
    if (el) el.remove();
  }

  function setQuickReplies(replies) {
    quickRepliesEl.innerHTML = '';
    replies.forEach(function (r) {
      var btn = document.createElement('button');
      btn.className = 'chatbot-quick-btn';
      btn.textContent = r;
      btn.addEventListener('click', function () {
        sendUserMessage(r);
      });
      quickRepliesEl.appendChild(btn);
    });
  }

  function scrollToBottom() {
    setTimeout(function () {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }, 50);
  }

  function sendUserMessage(text) {
    var msg = text || inputEl.value.trim();
    if (!msg) return;
    inputEl.value = '';
    quickRepliesEl.innerHTML = '';

    addUserMessage(msg);
    showTyping();

    // Simulate typing delay for natural feel
    var delay = 400 + Math.min(msg.length * 15, 800);
    setTimeout(function () {
      hideTyping();
      var response = processMessage(msg);
      addBotMessage(response.text, response.quickReplies);
    }, delay);
  }

  /* ---------- Boot ---------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
