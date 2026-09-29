export const wilayas = [
  ["01", "Adrar", 1200], ["02", "Chlef", 650], ["03", "Laghouat", 900],
  ["04", "Oum El Bouaghi", 800], ["05", "Batna", 750], ["06", "Bejaia", 700],
  ["07", "Biskra", 900], ["08", "Bechar", 1200], ["09", "Blida", 500],
  ["10", "Bouira", 700], ["11", "Tamanrasset", 1500], ["12", "Tebessa", 900],
  ["13", "Tlemcen", 800], ["14", "Tiaret", 800], ["15", "Tizi Ouzou", 600],
  ["16", "Alger", 400], ["17", "Djelfa", 850], ["18", "Jijel", 800],
  ["19", "Setif", 700], ["20", "Saida", 900], ["21", "Skikda", 750],
  ["22", "Sidi Bel Abbes", 900], ["23", "Annaba", 750], ["24", "Guelma", 900],
  ["25", "Constantine", 700], ["26", "Medea", 600], ["27", "Mostaganem", 750],
  ["28", "M'Sila", 800], ["29", "Mascara", 800], ["30", "Ouargla", 1100],
  ["31", "Oran", 700], ["32", "El Bayadh", 1000], ["33", "Illizi", 1500],
  ["34", "Bordj Bou Arreridj", 700], ["35", "Boumerdes", 500], ["36", "El Tarf", 1000],
  ["37", "Tindouf", 1500], ["38", "Tissemsilt", 800], ["39", "El Oued", 1000],
  ["40", "Khenchela", 900], ["41", "Souk Ahras", 900], ["42", "Tipaza", 500],
  ["43", "Mila", 800], ["44", "Ain Defla", 700], ["45", "Naama", 1100],
  ["46", "Ain Temouchent", 900], ["47", "Ghardaia", 1000], ["48", "Relizane", 800],
  ["49", "Timimoun", 1300], ["50", "Bordj Badji Mokhtar", 1600], ["51", "Ouled Djellal", 1000],
  ["52", "Beni Abbes", 1300], ["53", "In Salah", 1500], ["54", "In Guezzam", 1700],
  ["55", "Touggourt", 1100], ["56", "Djanet", 1700], ["57", "El M'Ghair", 1100],
  ["58", "El Meniaa", 1200],
].map(([code, name, deliveryFee]) => ({ code, name, deliveryFee }));

export const WILAYAS = wilayas.map(({ code, name, deliveryFee }) => ({ code, name, fee: deliveryFee }));