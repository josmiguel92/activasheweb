/*
 * Bloques que el editor puede insertar en el cuerpo de un contenido
 * con el botón «+» del editor enriquecido.
 *
 * Cada bloque escribe HTML de una sola línea dentro del Markdown. Astro lo
 * pasa tal cual al artículo, y los estilos están en src/styles/post.css.
 * El patrón (pattern) es lo que permite volver a abrir el bloque en el
 * formulario en lugar de verlo como texto suelto.
 */
(function () {
  var esc = function (value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };
  var unesc = function (value) {
    return String(value == null ? "" : value)
      .replace(/&quot;/g, '"')
      .replace(/&gt;/g, ">")
      .replace(/&lt;/g, "<")
      .replace(/&amp;/g, "&");
  };

  // Imagen dentro del texto, con texto alternativo y pie de foto opcional.
  CMS.registerEditorComponent({
    id: "figura",
    label: "Imagen con pie de foto",
    icon: "image",
    fields: [
      { name: "src", label: "Imagen", widget: "image" },
      {
        name: "alt",
        label: "Texto alternativo",
        widget: "string",
        hint: "Qué se ve en la imagen. Lo leen los lectores de pantalla y aparece si la imagen no carga. No repitas el pie de foto.",
      },
      {
        name: "caption",
        label: "Pie de foto",
        widget: "string",
        required: false,
        hint: "Opcional: se muestra debajo, en letra pequeña. Es el sitio para el crédito de la autoría.",
      },
    ],
    pattern:
      /^<figure class="post-figura"><img src="([^"]*)" alt="([^"]*)" loading="lazy"\s*\/?>(?:<figcaption>([\s\S]*?)<\/figcaption>)?<\/figure>$/,
    fromBlock: function (match) {
      return {
        src: match[1],
        alt: unesc(match[2]),
        caption: unesc(match[3] || ""),
      };
    },
    toBlock: function (data) {
      var caption = (data.caption || "").trim();
      return (
        '<figure class="post-figura"><img src="' +
        esc(data.src) +
        '" alt="' +
        esc(data.alt) +
        '" loading="lazy" />' +
        (caption ? "<figcaption>" + esc(caption) + "</figcaption>" : "") +
        "</figure>"
      );
    },
    toPreview: function (data) {
      var caption = (data.caption || "").trim();
      return (
        '<figure class="post-figura"><img src="' +
        esc(data.src) +
        '" alt="' +
        esc(data.alt) +
        '" />' +
        (caption ? "<figcaption>" + esc(caption) + "</figcaption>" : "") +
        "</figure>"
      );
    },
  });

  // Vídeo de YouTube incrustado dentro del artículo.
  CMS.registerEditorComponent({
    id: "youtube",
    label: "Vídeo de YouTube",
    icon: "media",
    fields: [
      {
        name: "id",
        label: "ID del vídeo",
        widget: "string",
        hint: "Solo el identificador. En https://youtu.be/hxmU3JqHvCs el ID es hxmU3JqHvCs.",
        pattern: [
          "^[A-Za-z0-9_-]{11}$",
          "Son 11 caracteres: letras, números, guion o guion bajo.",
        ],
      },
      {
        name: "title",
        label: "Título del vídeo",
        widget: "string",
        hint: "Describe el vídeo para quien usa lector de pantalla.",
      },
    ],
    pattern:
      /^<div class="post-video"><iframe src="https:\/\/www\.youtube-nocookie\.com\/embed\/([A-Za-z0-9_-]{11})" title="([^"]*)"[^>]*><\/iframe><\/div>$/,
    fromBlock: function (match) {
      return { id: match[1], title: unesc(match[2]) };
    },
    toBlock: function (data) {
      return (
        '<div class="post-video"><iframe src="https://www.youtube-nocookie.com/embed/' +
        esc(data.id) +
        '" title="' +
        esc(data.title) +
        '" loading="lazy" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>'
      );
    },
    toPreview: function (data) {
      return (
        '<div class="post-video"><iframe src="https://www.youtube-nocookie.com/embed/' +
        esc(data.id) +
        '" title="' +
        esc(data.title) +
        '" frameborder="0" allowfullscreen></iframe></div>'
      );
    },
  });

  // Enlace destacado. Coincide con la convención **[texto](/ruta)** que
  // src/styles/post.css ya convierte en botón.
  CMS.registerEditorComponent({
    id: "boton",
    label: "Botón (enlace destacado)",
    icon: "link",
    fields: [
      { name: "text", label: "Texto del botón", widget: "string" },
      {
        name: "url",
        label: "Enlace",
        widget: "string",
        hint: "Una ruta del sitio (/donate) o una dirección completa (https://…).",
      },
    ],
    pattern: /^\*\*\[([^\]]+)\]\(([^)]+)\)\*\*$/,
    fromBlock: function (match) {
      return { text: match[1], url: match[2] };
    },
    toBlock: function (data) {
      return "**[" + (data.text || "") + "](" + (data.url || "") + ")**";
    },
    toPreview: function (data) {
      return (
        '<p><strong><a href="' +
        esc(data.url) +
        '">' +
        esc(data.text) +
        "</a></strong></p>"
      );
    },
  });
})();
