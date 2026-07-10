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
  "mail": "activashe@proton.me",
  "title": "Hola, somos ActivaShe 👋🏽",
  "description": "**Activ@ Àşé** es un espacio comunal y familiar que nace con el objetivo de empoderar a la comunidad afrocubana, especialmente a las mujeres negras, que a pesar de ser mayoría en el país, son las más desatendidas y desprotegidas por la política social de la isla.",
  "socials": [
    {
      "label": "Instagram",
      "link": "https://www.instagram.com/luzafr0store"
    },
    {
      "label": "X (Twitter)",
      "link": "https://twitter.com/activashe"
    },
    {
      "label": "Facebook",
      "link": "https://facebook.com/activasheONG"
    },
    {
      "label": "YouTube",
      "link": "https://www.youtube.com/@ActivaShe"
    }
  ]
};

export default presentation;
