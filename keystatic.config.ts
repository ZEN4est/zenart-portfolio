import { config, fields, collection, singleton } from "@keystatic/core";

export default config({
  storage: process.env.NODE_ENV === 'development'
    ? { kind: 'local' }
    : { kind: 'github', repo: 'ZEN4est/zenart-portfolio' },
  singletons: {
    siteSettings: singleton({
      label: "1. Teksty na stronie i Ustawienia",
      path: "src/content/settings/site",
      format: "json",
      schema: {
        brandSubheaderPl: fields.text({ label: "Nadtytuł Hero (PL)", defaultValue: "MICHAŁ PIWOWARCZYK — 3D ARTIST" }),
        brandSubheaderEn: fields.text({ label: "Nadtytuł Hero (EN)", defaultValue: "MICHAŁ PIWOWARCZYK — 3D ARTIST" }),
        heroTitlePl: fields.text({ label: "Tytuł główny Hero (PL)", multiline: true }),
        heroTitleEn: fields.text({ label: "Tytuł główny Hero (EN)", multiline: true }),
        heroSubPl: fields.text({ label: "Opis pod tytułem Hero (PL)", multiline: true }),
        heroSubEn: fields.text({ label: "Opis pod tytułem Hero (EN)", multiline: true }),
        showreelUrl: fields.file({
          label: "Wideo w tle (Strona główna .mp4)",
          directory: "public/uploads/settings",
          publicPath: "/uploads/settings/",
        }),
        ctaButtonPl: fields.text({ label: "Przycisk w menu (PL)", defaultValue: "Wyceń projekt" }),
        ctaButtonEn: fields.text({ label: "Przycisk w menu (EN)", defaultValue: "Get a Quote" }),

        /* Sekcja Kategorie */
        categoriesTitlePl: fields.text({ label: "Tytuł sekcji kategorii (PL)", defaultValue: "KATEGORIE" }),
        categoriesTitleEn: fields.text({ label: "Tytuł sekcji kategorii (EN)", defaultValue: "CATEGORIES" }),

        /* Sekcja Klienci */
        clientsTitlePl: fields.text({ label: "Tytuł sekcji z klientami (PL)", defaultValue: "KLIENCI I WSPÓŁPRACA" }),
        clientsTitleEn: fields.text({ label: "Tytuł sekcji z klientami (EN)", defaultValue: "CLIENTS & COLLABORATIONS" }),

        /* Sekcja O Mnie (About Me) */
        aboutTitlePl: fields.text({ label: "O mnie - Tytuł sekcji (PL)", defaultValue: "O MNIE" }),
        aboutTitleEn: fields.text({ label: "O mnie - Tytuł sekcji (EN)", defaultValue: "ABOUT ME" }),
        aboutSubtitlePl: fields.text({ label: "O mnie - Podtytuł (PL)", defaultValue: "Michał Piwowarczyk — 3D Artist & Inżynier Oprogramowania" }),
        aboutSubtitleEn: fields.text({ label: "O mnie - Podtytuł (EN)", defaultValue: "Michał Piwowarczyk — 3D Artist & Software Engineer" }),
        aboutBioPl: fields.text({ label: "O mnie - Główny opis (PL)", multiline: true }),
        aboutBioEn: fields.text({ label: "O mnie - Główny opis (EN)", multiline: true }),
        /* O Mnie - Karta 1: Wykształcenie */
        aboutEducationLabelPl: fields.text({ label: "O mnie: Karta 1 - Etykieta (PL)", defaultValue: "Wykształcenie" }),
        aboutEducationLabelEn: fields.text({ label: "O mnie: Karta 1 - Etykieta (EN)", defaultValue: "Education" }),
        aboutEducationPl: fields.text({ label: "O mnie: Karta 1 - Tytuł / Uczelnia (PL)", defaultValue: "Mgr inż. Informatyki Stosowanej (AGH w Krakowie)" }),
        aboutEducationEn: fields.text({ label: "O mnie: Karta 1 - Tytuł / Uczelnia (EN)", defaultValue: "M.Sc. Eng. in Applied Computer Science (AGH UST)" }),
        aboutEducationDescPl: fields.text({ label: "O mnie: Karta 1 - Podpis / Opis (PL)", multiline: true, defaultValue: "Akademia Górniczo-Hutnicza w Krakowie — wiedza z zakresu algorytmów grafiki, optymalizacji siatek i pipeline'u cyfrowego." }),
        aboutEducationDescEn: fields.text({ label: "O mnie: Karta 1 - Podpis / Opis (EN)", multiline: true, defaultValue: "AGH University of Krakow — computer graphics algorithms, geometry optimization, and digital pipelines." }),

        /* O Mnie - Karta 2: Doświadczenie */
        aboutExperienceLabelPl: fields.text({ label: "O mnie: Karta 2 - Etykieta (PL)", defaultValue: "Doświadczenie" }),
        aboutExperienceLabelEn: fields.text({ label: "O mnie: Karta 2 - Etykieta (EN)", defaultValue: "Experience" }),
        aboutExperienceYears: fields.text({ label: "O mnie: Karta 2 - Liczba lat", defaultValue: "4+" }),
        aboutExperienceSuffixPl: fields.text({ label: "O mnie: Karta 2 - Dopełnienie po liczbie lat (PL)", defaultValue: "lat w branży 3D" }),
        aboutExperienceSuffixEn: fields.text({ label: "O mnie: Karta 2 - Dopełnienie po liczbie lat (EN)", defaultValue: "years in 3D" }),
        aboutExperienceDescPl: fields.text({ label: "O mnie: Karta 2 - Podpis / Opis (PL)", multiline: true, defaultValue: "Setki zrealizowanych modeli komercyjnych, wizualizacji produktowych, assetów gamedev oraz animacji w Blenderze." }),
        aboutExperienceDescEn: fields.text({ label: "O mnie: Karta 2 - Podpis / Opis (EN)", multiline: true, defaultValue: "Hundreds of commercial 3D assets, product visualizations, game-ready models, and Blender animations." }),

        /* O Mnie - Karta 3: Działalność & B2B */
        aboutCompanyLabelPl: fields.text({ label: "O mnie: Karta 3 - Etykieta (PL)", defaultValue: "Działalność & B2B" }),
        aboutCompanyLabelEn: fields.text({ label: "O mnie: Karta 3 - Etykieta (EN)", defaultValue: "Business & B2B" }),
        aboutCompanyPl: fields.text({ label: "O mnie: Karta 3 - Forma działalności (PL)", defaultValue: "Własna zarejestrowana działalność — Faktury bez VAT / B2B" }),
        aboutCompanyEn: fields.text({ label: "O mnie: Karta 3 - Forma działalności (EN)", defaultValue: "Registered business — Invoices without VAT / B2B" }),
        aboutCompanyDescPl: fields.text({ label: "O mnie: Karta 3 - Podpis / Opis (PL)", multiline: true, defaultValue: "Własna zarejestrowana firma — faktury, bezpieczne umowy B2B i pełne prawa autorskie." }),
        aboutCompanyDescEn: fields.text({ label: "O mnie: Karta 3 - Podpis / Opis (EN)", multiline: true, defaultValue: "Registered business entity — invoices, B2B agreements, and full copyright transfer." }),

        /* O Mnie - Karta 4: Pipeline & Narzędzia */
        aboutPipelineLabelPl: fields.text({ label: "O mnie: Karta 4 - Etykieta (PL)", defaultValue: "Pipeline & Narzędzia" }),
        aboutPipelineLabelEn: fields.text({ label: "O mnie: Karta 4 - Etykieta (EN)", defaultValue: "Pipeline & Tools" }),
        aboutPipelineTitlePl: fields.text({ label: "O mnie: Karta 4 - Tytuł / Narzędzia (PL)", defaultValue: "Blender • Substance 3D" }),
        aboutPipelineTitleEn: fields.text({ label: "O mnie: Karta 4 - Tytuł / Narzędzia (EN)", defaultValue: "Blender • Substance 3D" }),
        aboutPipelineDescPl: fields.text({ label: "O mnie: Karta 4 - Podpis / Opis (PL)", multiline: true, defaultValue: "Modelowanie hard-surface, teksturowanie PBR, silniki Cycles i Eevee oraz optymalizacja pod silniki gier." }),
        aboutPipelineDescEn: fields.text({ label: "O mnie: Karta 4 - Podpis / Opis (EN)", multiline: true, defaultValue: "Hard-surface modeling, PBR texturing, Cycles & Eevee render engines, and real-time game engine optimization." }),
        aboutSkillsPl: fields.array(
          fields.text({ label: "Umiejętność / Program / Technologia (PL)" }),
          {
            label: "O mnie - Kluczowe umiejętności (tagi) (PL)",
            itemLabel: (props) => props.value || "Umiejętność",
          }
        ),
        aboutSkillsEn: fields.array(
          fields.text({ label: "Skill / Software / Tech (EN)" }),
          {
            label: "O mnie - Kluczowe umiejętności (tagi) (EN)",
            itemLabel: (props) => props.value || "Skill",
          }
        ),
        aboutAvatar: fields.image({
          label: "O mnie - Zdjęcie / Render profilowy",
          directory: "public/uploads/about",
          publicPath: "/uploads/about/",
        }),

        contactIntroPl: fields.text({ label: "Tekst zachęty w stopce (PL)", multiline: true }),
        contactIntroEn: fields.text({ label: "Tekst zachęty w stopce (EN)", multiline: true }),
        email: fields.text({ label: "E-mail kontaktowy" }),
        phone: fields.text({ label: "Telefon" }),
        locationPl: fields.text({ label: "Lokalizacja (PL)", defaultValue: "Kraków / Praca zdalna, Polska" }),
        locationEn: fields.text({ label: "Lokalizacja (EN)", defaultValue: "Kraków / Remote, Poland" }),

        clients: fields.array(
          fields.object({
            name: fields.text({ label: "Nazwa firmy (pod logo)" }),
            shortTextLogo: fields.text({ label: "Skrót tekstowy (np. HC, 7p::)" }),
            logoImage: fields.image({
              label: "Plik Logo (PNG/SVG)",
              directory: "public/uploads/clients",
              publicPath: "/uploads/clients/",
            }),
          }),
          {
            label: "Karuzela Klientów (Clients & Collaborations)",
            itemLabel: (props) => props.fields?.name?.value || "Klient",
          }
        ),
      },
    }),
  },

  collections: {
    categories: collection({
      label: "2. Kategorie Portfolio",
      slugField: "titlePl",
      path: "src/content/categories/*",
      format: "json",
      schema: {
        titlePl: fields.slug({ name: { label: "Nazwa Kategorii (PL)" } }),
        titleEn: fields.text({ label: "Nazwa Kategorii (EN)" }),
        order: fields.integer({ label: "Kolejność wyświetlania", defaultValue: 1 }),
        coverImage: fields.image({
          label: "Obrazek na kafelek (plik z dysku)",
          directory: "public/uploads/categories",
          publicPath: "/uploads/categories/",
        }),
        externalCoverUrl: fields.text({ label: "LUB zewnętrzny URL obrazka" }),
      },
    }),

    projects: collection({
      label: "3. Projekty 3D",
      slugField: "titlePl",
      path: "src/content/projects/*",
      format: "json",
      schema: {
        titlePl: fields.slug({ name: { label: "Tytuł projektu (PL)" } }),
        titleEn: fields.text({ label: "Tytuł projektu (EN)" }),
        order: fields.integer({ label: "Kolejność (1 = pierwszy)", defaultValue: 1 }),
        category: fields.relationship({ label: "Kategoria", collection: "categories" }),
        aspectRatio: fields.select({
          label: "Proporcje kafelka w galerii",
          options: [
            { label: "Kwadratowy (1:1)", value: "square" },
            { label: "Poziomy (16:9)", value: "video" },
            { label: "Pionowy (3:4)", value: "vertical" },
          ],
          defaultValue: "square",
        }),
        descriptionPl: fields.text({ label: "Pełny opis projektu (PL)", multiline: true }),
        descriptionEn: fields.text({ label: "Pełny opis projektu (EN)", multiline: true }),
        tools: fields.text({ label: "Użyte programy (np. Blender, Substance Painter)" }),
        polycount: fields.text({ label: "Liczba Trisów (np. 18,400 Tris)" }),
        client: fields.text({ label: "Klient" }),
        completedDate: fields.text({ label: "Data ukończenia" }),
        thumbnail: fields.image({
          label: "Miniaturka główna",
          directory: "public/uploads/projects",
          publicPath: "/uploads/projects/",
        }),
        externalThumbnailUrl: fields.text({ label: "LUB zewnętrzny URL miniaturki" }),
        modelGlb: fields.file({
          label: "Model 3D (.glb) do interaktywnego podglądu",
          directory: "public/uploads/models",
          publicPath: "/uploads/models/",
        }),
        externalGlbUrl: fields.text({ label: "LUB link do pliku .glb" }),
        wireframeImage: fields.image({
          label: "Obrazek siatki (dla suwaka Render vs Wireframe)",
          directory: "public/uploads/projects",
          publicPath: "/uploads/projects/",
        }),
        videoUrl: fields.file({
          label: "Plik wideo / animacja (.mp4)",
          directory: "public/uploads/videos",
          publicPath: "/uploads/videos/",
        }),
        gallery: fields.array(
          fields.object({
            image: fields.image({
              label: "Render / Ujęcie",
              directory: "public/uploads/projects",
              publicPath: "/uploads/projects/",
            }),
            externalUrl: fields.text({ label: "LUB zewnętrzny URL" }),
            captionPl: fields.text({ label: "Podpis (PL)" }),
            captionEn: fields.text({ label: "Podpis (EN)" }),
          }),
          { label: "Dodatkowe rendery i ujęcia" }
        ),
      },
    }),
  },
});
