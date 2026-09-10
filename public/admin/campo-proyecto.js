/*
 * Campo «Proyecto» de las publicaciones.
 *
 * Por dentro es el desplegable de Decap de toda la vida (el widget
 * «relation»): lista los proyectos y guarda la dirección del elegido. Lo
 * único que cambia es la vista previa, que pintaba esa dirección suelta
 * —«informe-doble-carga»— encima del artículo, como si fuera una línea del
 * texto. Aquí no se pinta: la relación se ve en el sitio, en la cinta bajo
 * el titular, no en la previsualización.
 *
 * Se hace con un campo propio y no con CSS porque en la vista previa los
 * campos son <div> sin clase ni identificador: lo único a lo que agarrarse
 * sería la posición (:nth-child), y eso deja de valer en cuanto se reordena
 * o se añade un campo en config.yml.
 */
(function () {
  var relacion = CMS.getWidget("relation");

  var SinVistaPrevia = window.createClass({
    render: function () {
      return null;
    },
  });

  CMS.registerWidget(
    "proyecto",
    relacion.control,
    SinVistaPrevia,
    relacion.schema,
  );
})();
