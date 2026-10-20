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
        }),        ctaButtonPl: fields.text({ label: "Przycisk w menu (PL)", defaultValue: "Wyceń projekt" }),
        ctaButtonEn: fields.text({ label: "Przycisk w menu (EN)", defaultValue: "Get a Quote" }),
        contactIntroPl: fields.text({ label: "Tekst zachęty w stopce (PL)", multiline: true }),
        contactIntroEn: fields.text({ label: "Tekst zachęty w stopce (EN)", multiline: true }),
        email: fields.text({ label: "E-mail kontaktowy" }),
        phone: fields.text({ label: "Telefon" }),
        location: fields.text({ label: "Lokalizacja" }),
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