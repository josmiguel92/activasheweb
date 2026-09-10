/*
 * Campo «Dirección (slug)» de publicaciones y proyectos.
 *
 * La dirección es la URL con la que se comparte una entrada y la que Google
 * indexa. Cambiarla en una entrada ya publicada deja en 404 todo lo que
 * circula por ahí, y eso ya ha pasado: una edición guardó «mi-articulo» en
 * el campo y el reportaje de las madres cubanas perdió su dirección.
 *
 * Así que el campo se abre bloqueado cuando la entrada ya tiene dirección
 * —es decir, cuando ya se guardó alguna vez— y hay que pulsar «Cambiar la
 * dirección» y confirmar para poder tocarlo. Al crear una entrada nueva
 * llega vacío y se escribe con normalidad.
 *
 * No es un muro: se puede cambiar si de verdad hace falta. Es un alto.
 *
 * La comprobación del formato (minúsculas, números y guiones) la sigue
 * haciendo el «pattern» de public/admin/config.yml, que es del panel y no
 * de este campo.
 */
(function () {
  var h = window.h;
  var createClass = window.createClass;

  var AVISO =
    "La dirección es la URL con la que se ha compartido esta entrada y la " +
    "que Google tiene indexada.\n\n" +
    "Si la cambias, los enlaces que ya circulan dejarán de funcionar y " +
    "habrá que añadir una redirección a mano en el sitio.\n\n" +
    "¿Seguro que quieres cambiarla?";

  var Control = createClass({
    getInitialState: function () {
      return { desbloqueado: false, escrito: false };
    },

    desbloquear: function () {
      if (window.confirm(AVISO)) this.setState({ desbloqueado: true });
    },

    alEscribir: function (evento) {
      // Escribir marca la entrada como nueva: en una ya guardada el campo
      // llega bloqueado y no se puede escribir sin pasar por el botón.
      this.setState({ escrito: true });
      this.props.onChange(evento.target.value);
    },

    /*
     * Hay dirección y no la ha escrito quien está delante: la entrada ya
     * existía, así que se bloquea. No se mira solo al montar porque el
     * formulario puede pintarse antes de que lleguen los datos de la
     * entrada, y entonces el campo llegaría vacío y quedaría suelto.
     */
    estaBloqueado: function () {
      if (this.state.desbloqueado || this.state.escrito) return false;
      return Boolean(this.props.value);
    },

    render: function () {
      var props = this.props;
      var bloqueado = this.estaBloqueado();

      var campo = h("input", {
        type: "text",
        id: props.forID,
        className: props.classNameWrapper,
        value: props.value || "",
        onChange: this.alEscribir,
        onFocus: props.setActiveStyle,
        onBlur: props.setInactiveStyle,
        readOnly: bloqueado,
        "aria-readonly": bloqueado ? "true" : null,
        style: bloqueado ? { opacity: 0.6, cursor: "not-allowed" } : null,
      });

      if (!bloqueado) return campo;

      return h(
        "div",
        null,
        campo,
        h(
          "button",
          {
            type: "button",
            onClick: this.desbloquear,
            style: {
              marginTop: "8px",
              background: "none",
              border: "none",
              padding: 0,
              color: "#798291",
              font: "inherit",
              fontSize: "13px",
              textDecoration: "underline",
              cursor: "pointer",
            },
          },
          "Cambiar la dirección",
        ),
      );
    },
  });

  /*
   * En el panel de vista previa no se pinta nada. La dirección no forma
   * parte del artículo, y salía suelta encima del texto —«el-brindis-del-
   * apagon»— como si fuera una línea más.
   */
  var SinVistaPrevia = createClass({
    render: function () {
      return null;
    },
  });

  CMS.registerWidget("direccion", Control, SinVistaPrevia);
})();
