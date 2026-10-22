import { config, fields, collection, singleton } from "@keystatic/core";

const projectSchema = fields.object({
  slug: fields.text({
    label: "Identyfikator URL (slug, np. ar-15)",
    description: "Będzie widoczny w adresie strony: /projects/twoj-slug. Jeśli zostawisz puste, wygeneruje się automatycznie z tytułu.",
  }),
  titlePl: fields.text({ label: "Tytuł projektu (PL)" }),
  titleEn: fields.text({ label: "Tytuł projektu (EN)" }),
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

  /* --- GALERIA RENDERÓW I UJĘĆ --- */
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

  /* --- MODELE 3D (INTERAKTYWNE) --- */
  models: fields.array(
    fields.object({
      titlePl: fields.text({ label: "Tytuł modelu (PL, np. Render interaktywny / Low Poly)" }),
      titleEn: fields.text({ label: "Tytuł modelu (EN, np. Interactive Model / Low Poly)" }),
      modelFile: fields.file({
        label: "Plik .glb (z dysku - max ~15-20MB na zapis)",
        directory: "public/uploads/models",
        publicPath: "/uploads/models/",
      }),
      externalUrl: fields.text({
        label: "LUB ścieżka do pliku .glb (np. /uploads/models/plik.glb)",
        description: "Dla plików > 20MB wgraj plik przez naszą wgrywarkę /test/upload (lub przez FTP do public/uploads/models) i wklej tutaj ścieżkę (omija limit 45MB GitHuba).",
      }),
    }),
    {
      label: "Modele 3D (.glb) - Podgląd interaktywny (wiele modeli)",
      itemLabel: (props) => props.fields?.titlePl?.value || props.fields?.titleEn?.value || "Model 3D",
    }
  ),

  /* --- WIDEO I ANIMACJE --- */
  videos: fields.array(
    fields.object({
      titlePl: fields.text({ label: "Tytuł wideo (PL, np. Animacja / Turntable)" }),
      titleEn: fields.text({ label: "Tytuł wideo (EN, np. Animation / Turntable)" }),
      videoFile: fields.file({
        label: "Plik wideo .mp4 (z dysku - max ~15-20MB na zapis)",
        directory: "public/uploads/videos",
        publicPath: "/uploads/videos/",
      }),
      externalUrl: fields.text({
        label: "LUB link do wideo (YouTube, Vimeo lub bezpośredni plik .mp4)",
        description: "Wklej link YouTube / Vimeo LUB wgraj plik MP4 przez naszą wgrywarkę /test/upload (lub przez FTP do public/uploads/videos) i wklej tutaj ścieżkę.",
      }),
    }),
    {
      label: "Wideo i Animacje (wiele wideo)",
      itemLabel: (props) => props.fields?.titlePl?.value || props.fields?.titleEn?.value || "Wideo",
    }
  ),

  /* --- PORÓWNANIA WIREFRAME (SUWAKI RENDER VS SIATKA) --- */
  wireframeComparisons: fields.array(
    fields.object({
      titlePl: fields.text({ label: "Tytuł porównania (PL, opcjonalnie)" }),
      titleEn: fields.text({ label: "Tytuł porównania (EN, opcjonalnie)" }),
      title: fields.text({ label: "Tytuł porównania (archiwalny)" }),
      mainImage: fields.image({
        label: "Obraz renderu kolorowego (jeśli puste, użyta zostanie miniaturka główna)",
        directory: "public/uploads/projects",
        publicPath: "/uploads/projects/",
      }),
      externalMainImageUrl: fields.text({ label: "LUB link do renderu kolorowego" }),
      wireframeImage: fields.image({
        label: "Obraz siatki (wireframe)",
        directory: "public/uploads/projects",
        publicPath: "/uploads/projects/",
      }),
      externalWireframeUrl: fields.text({ label: "LUB link do obrazka siatki" }),
    }),
    {
      label: "Porównania Wireframe (Suwaki Render vs Siatka)",
      itemLabel: (props) => props.fields?.titlePl?.value || props.fields?.titleEn?.value || "Porównanie Siatki",
    }
  ),
});

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
        /* Identyfikacja wizualna i Social Media */
        favicon: fields.image({
          label: "Ikonka strony (Favicon - PNG, min. 192x192 px)",
          directory: "public/uploads/settings",
          publicPath: "/uploads/settings/",
        }),
        ogImage: fields.image({
          label: "Grafika udostępniania linka (Open Graph - 1200x630 px)",
          directory: "public/uploads/settings",
          publicPath: "/uploads/settings/",
        }),

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
        aboutBioPl: fields.text({ label: "O mnie - Krótki biogram (PL)", multiline: true }),
        aboutBioEn: fields.text({ label: "O mnie - Krótki biogram (EN)", multiline: true }),

        /* Kafelki statystyk / osiągnięć (About Me) */
        aboutEducationLabelPl: fields.text({ label: "Edukacja - Etykieta (PL)", defaultValue: "Edukacja" }),
        aboutEducationLabelEn: fields.text({ label: "Edukacja - Etykieta (EN)", defaultValue: "Education" }),
        aboutEducationPl: fields.text({ label: "Edukacja - Wartość (PL)", defaultValue: "Inżynieria Oprogramowania" }),
        aboutEducationEn: fields.text({ label: "Edukacja - Wartość (EN)", defaultValue: "Software Engineering" }),
        aboutEducationDescPl: fields.text({ label: "Edukacja - Opis (PL)", defaultValue: "Ukończone studia inżynierskie" }),
        aboutEducationDescEn: fields.text({ label: "Edukacja - Opis (EN)", defaultValue: "B.Sc. Degree Completed" }),

        aboutExperienceLabelPl: fields.text({ label: "Doświadczenie - Etykieta (PL)", defaultValue: "Doświadczenie" }),
        aboutExperienceLabelEn: fields.text({ label: "Doświadczenie - Etykieta (EN)", defaultValue: "Experience" }),
        aboutExperienceYears: fields.text({ label: "Doświadczenie - Liczba lat", defaultValue: "5" }),
        aboutExperienceSuffixPl: fields.text({ label: "Doświadczenie - Dopisek (PL)", defaultValue: "+ Lat w Branży 3D" }),
        aboutExperienceSuffixEn: fields.text({ label: "Doświadczenie - Dopisek (EN)", defaultValue: "+ Years in 3D" }),
        aboutExperienceDescPl: fields.text({ label: "Doświadczenie - Opis (PL)", defaultValue: "Dziesiątki zrealizowanych projektów" }),
        aboutExperienceDescEn: fields.text({ label: "Doświadczenie - Opis (EN)", defaultValue: "Dozens of completed projects" }),

        aboutCompanyLabelPl: fields.text({ label: "Firma - Etykieta (PL)", defaultValue: "Działalność" }),
        aboutCompanyLabelEn: fields.text({ label: "Firma - Etykieta (EN)", defaultValue: "Company" }),
        aboutCompanyPl: fields.text({ label: "Firma - Wartość (PL)", defaultValue: "Własne Studio 3D" }),
        aboutCompanyEn: fields.text({ label: "Firma - Wartość (EN)", defaultValue: "Independent 3D Studio" }),
        aboutCompanyDescPl: fields.text({ label: "Firma - Opis (PL)", defaultValue: "Michał Piwowarczyk ZenArt 3D" }),
        aboutCompanyDescEn: fields.text({ label: "Firma - Opis (EN)", defaultValue: "Michał Piwowarczyk ZenArt 3D" }),

        aboutPipelineLabelPl: fields.text({ label: "Pipeline - Etykieta (PL)", defaultValue: "Pipeline" }),
        aboutPipelineLabelEn: fields.text({ label: "Pipeline - Etykieta (EN)", defaultValue: "Pipeline" }),
        aboutPipelineTitlePl: fields.text({ label: "Pipeline - Tytuł (PL)", defaultValue: "Game-Ready & VFX" }),
        aboutPipelineTitleEn: fields.text({ label: "Pipeline - Tytuł (EN)", defaultValue: "Game-Ready & VFX" }),
        aboutPipelineDescPl: fields.text({ label: "Pipeline - Opis (PL)", defaultValue: "Zoptymalizowana geometria i teksturowanie PBR" }),
        aboutPipelineDescEn: fields.text({ label: "Pipeline - Opis (EN)", defaultValue: "Optimized geometry & PBR texturing" }),

        /* Umiejętności (Skills Pills) */
        aboutSkillsHeaderPl: fields.text({ label: "Nagłówek sekcji umiejętności (PL)", defaultValue: "Kluczowe umiejętności & Pipeline" }),
        aboutSkillsHeaderEn: fields.text({ label: "Nagłówek sekcji umiejętności (EN)", defaultValue: "Core Skills & Pipeline" }),
        aboutSkillsPl: fields.array(
          fields.text({ label: "Umiejętność (PL)" }),
          {
            label: "Lista umiejętności (PL)",
            itemLabel: (props) => props.value || "Nowa umiejętność",
          }
        ),
        aboutSkillsEn: fields.array(
          fields.text({ label: "Umiejętność (EN)" }),
          {
            label: "Lista umiejętności (EN)",
            itemLabel: (props) => props.value || "New Skill",
          }
        ),
        aboutAvatar: fields.image({
          label: "Zdjęcie / Awatar (O Mnie)",
          directory: "public/uploads/settings",
          publicPath: "/uploads/settings/",
        }),

        /* Stopka i Kontakt */
        contactIntroPl: fields.text({ label: "Kontakt - Tekst zachęcający (PL)", multiline: true }),
        contactIntroEn: fields.text({ label: "Kontakt - Tekst zachęcający (EN)", multiline: true }),
        email: fields.text({ label: "Adres E-mail", defaultValue: "kontakt@zenart3d.com" }),
        phone: fields.text({ label: "Numer telefonu", defaultValue: "+48 000 000 000" }),
        locationPl: fields.text({ label: "Lokalizacja (PL)", defaultValue: "Kraków, Polska / Zdalnie" }),
        locationEn: fields.text({ label: "Lokalizacja (EN)", defaultValue: "Cracow, Poland / Remote" }),
        linkedinUrl: fields.text({ label: "Link do profilu LinkedIn (opcjonalnie)" }),
        instagramUrl: fields.text({ label: "Link do profilu Instagram (opcjonalnie)" }),

        /* Sekcja Klienci */
        clients: fields.array(
          fields.object({
            name: fields.text({ label: "Nazwa klienta" }),
            shortTextLogo: fields.text({ label: "Skrót tekstowy logo (np. HC, KG - opcjonalnie)" }),
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

    /* 2. Projekty: Modelowanie 3D */
    projectsModelling: singleton({
      label: "2. Projekty: Modelowanie 3D",
      path: "src/content/projects-data/modelling",
      format: "json",
      schema: {
        projects: fields.array(projectSchema, {
          label: "Projekty w kategorii Modelowanie (przeciągaj kafelki myszką aby zmienić kolejność)",
          itemLabel: (props) => props.fields?.titlePl?.value || "Projekt",
        }),
      },
    }),

    /* 3. Projekty: Animacje 3D */
    projectsAnimating: singleton({
      label: "3. Projekty: Animacje 3D",
      path: "src/content/projects-data/animating",
      format: "json",
      schema: {
        projects: fields.array(projectSchema, {
          label: "Projekty w kategorii Animacje (przeciągaj kafelki myszką aby zmienić kolejność)",
          itemLabel: (props) => props.fields?.titlePl?.value || "Projekt",
        }),
      },
    }),

    /* 4. Projekty: Wizualizacje 3D */
    projectsVisualizations: singleton({
      label: "4. Projekty: Wizualizacje 3D",
      path: "src/content/projects-data/visualizations",
      format: "json",
      schema: {
        projects: fields.array(projectSchema, {
          label: "Projekty w kategorii Wizualizacje (przeciągaj kafelki myszką aby zmienić kolejność)",
          itemLabel: (props) => props.fields?.titlePl?.value || "Projekt",
        }),
      },
    }),
  },

  collections: {
    categories: collection({
      label: "5. Kategorie Portfolio (Tytuły i Okładki)",
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
  },
});
