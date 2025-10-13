type Social = {
  label: string;
  link: string;
};

type Presentation = {
  mail: string;
  title: string;
  description: string;
  socials: Social[];
};

const presentation: Presentation = {
  "mail": "contacto@activashe.org",
  "title": "Hola, somos Activ@Ase 👋",
  "description": "Somos una organización comprometida con la defensa y el apoyo a las *minorías de mujeres afrodescendientes* en contextos de crisis. Trabajamos para visibilizar su lucha contra la *inseguridad alimentaria* y la *desigualdad sistémica*, promoviendo la equidad y la justicia. ¡Únete a nuestra causa!",
  "socials": [
    {
      "label": "Instagram",
      "link": "https://instagram.com/activashe"
    },
    {
      "label": "X (Twitter)",
      "link": "https://twitter.com/activashe"
    },
    {
      "label": "Facebook",
      "link": "https://facebook.com/activasheONG"
    }
  ]
};

export default presentation;
