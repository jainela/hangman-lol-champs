export type Category = "campeones" | "objetos" | "lugares";

export interface Word {
  word: string;
  hint: string;
  category: Category;
}

export const WORDS: Word[] = [
  // Campeones
  { word: "YASUO", hint: "El Imparable. Espadachín de Jonia exiliado.", category: "campeones" },
  { word: "AHRI", hint: "El Zorro de Nueve Colas. Vastaya encantadora.", category: "campeones" },
  { word: "DARIUS", hint: "La Mano de Noxus. Su hacha no perdona.", category: "campeones" },
  { word: "GAREN", hint: "El Poder de Demacia. ¡DEMACIA!", category: "campeones" },
  { word: "LUX", hint: "La Dama Luminosa de Demacia.", category: "campeones" },
  { word: "ZED", hint: "El Maestro de las Sombras.", category: "campeones" },
  { word: "JINX", hint: "La Gatillo Loco de Zaun.", category: "campeones" },
  { word: "VI", hint: "La Oficial de Piltover con guantes hextech.", category: "campeones" },
  { word: "EKKO", hint: "El Chico que Rompió el Tiempo.", category: "campeones" },
  { word: "THRESH", hint: "El Carcelero. Atrapa almas con su cadena.", category: "campeones" },
  { word: "AKALI", hint: "La Asesina Renegada del Kinkou.", category: "campeones" },
  { word: "KAISA", hint: "La Hija del Vacío.", category: "campeones" },
  { word: "BRAUM", hint: "El Corazón del Freljord. Su escudo es legendario.", category: "campeones" },
  { word: "VIKTOR", hint: "El Heraldo de las Máquinas.", category: "campeones" },
  { word: "JHIN", hint: "El Virtuoso. El asesino artista de cuatro tiros.", category: "campeones" },

  // Objetos
  { word: "HEXTECH", hint: "Tecnología que fusiona magia y máquinas.", category: "objetos" },
  { word: "INFINITY", hint: "Filo del ___. Daga icónica de daño crítico.", category: "objetos" },
  { word: "RABADON", hint: "Sombrero mortal de ___. AP por las nubes.", category: "objetos" },
  { word: "ZHONYA", hint: "Reloj de arena de ___. Estasis dorada.", category: "objetos" },
  { word: "MEJAI", hint: "Tomo perdido de ___. Acumula almas.", category: "objetos" },
  { word: "BOTAS", hint: "Calzado esencial para moverse por la Grieta.", category: "objetos" },
  { word: "TRINIDAD", hint: "Fuerza de la ___. Combina tres efectos.", category: "objetos" },

  // Lugares
  { word: "DEMACIA", hint: "Reino de la justicia y la luz.", category: "lugares" },
  { word: "NOXUS", hint: "Imperio implacable que valora la fuerza.", category: "lugares" },
  { word: "JONIA", hint: "Tierra de equilibrio espiritual y magia.", category: "lugares" },
  { word: "PILTOVER", hint: "La Ciudad del Progreso.", category: "lugares" },
  { word: "ZAUN", hint: "La submetrópolis tóxica bajo Piltover.", category: "lugares" },
  { word: "FRELJORD", hint: "Tierras heladas de tres tribus en guerra.", category: "lugares" },
  { word: "SHURIMA", hint: "Imperio del desierto resurgido.", category: "lugares" },
  { word: "TARGON", hint: "Montaña sagrada de los Aspectos.", category: "lugares" },
  { word: "BILGEWATER", hint: "Puerto pirata de cazadores de monstruos.", category: "lugares" },
  { word: "IXTAL", hint: "Nación selvática aislada de magia elemental.", category: "lugares" },
  { word: "RUNETERRA", hint: "El mundo donde sucede todo.", category: "lugares" },
];

export const CATEGORIES: { id: Category | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "campeones", label: "Campeones" },
  { id: "objetos", label: "Objetos" },
  { id: "lugares", label: "Regiones" },
];

export const MAX_WRONG = 6;
