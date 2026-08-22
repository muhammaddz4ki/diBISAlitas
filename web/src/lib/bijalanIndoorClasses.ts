// Semua 80 kelas COCO (label Bahasa Indonesia). BiJALAN mengumumkan seluruh objek.
export const INDOOR_CLASSES_SUBSET: Record<number, string> = {
  0: "orang", 1: "sepeda", 2: "mobil", 3: "motor", 4: "pesawat", 5: "bus",
  6: "kereta", 7: "truk", 8: "perahu", 9: "lampu lalu lintas", 10: "hidran",
  11: "rambu stop", 12: "meteran parkir", 13: "bangku", 14: "burung", 15: "kucing",
  16: "anjing", 17: "kuda", 18: "domba", 19: "sapi", 20: "gajah", 21: "beruang",
  22: "zebra", 23: "jerapah", 24: "tas ransel", 25: "payung", 26: "tas tangan",
  27: "dasi", 28: "koper", 29: "frisbee", 30: "ski", 31: "papan seluncur",
  32: "bola", 33: "layang-layang", 34: "tongkat bisbol", 35: "sarung bisbol",
  36: "skateboard", 37: "papan selancar", 38: "raket tenis", 39: "botol",
  40: "gelas anggur", 41: "gelas", 42: "garpu", 43: "pisau", 44: "sendok",
  45: "mangkuk", 46: "pisang", 47: "apel", 48: "roti isi", 49: "jeruk",
  50: "brokoli", 51: "wortel", 52: "hot dog", 53: "pizza", 54: "donat",
  55: "kue", 56: "kursi", 57: "sofa", 58: "tanaman", 59: "kasur",
  60: "meja makan", 61: "toilet", 62: "tv", 63: "laptop", 64: "mouse",
  65: "remote", 66: "keyboard", 67: "ponsel", 68: "microwave", 69: "oven",
  70: "pemanggang roti", 71: "wastafel", 72: "kulkas", 73: "buku", 74: "jam",
  75: "vas bunga", 76: "gunting", 77: "boneka beruang", 78: "pengering rambut",
  79: "sikat gigi",
};

export const INDOOR_CLASSES_KEYS = Object.keys(INDOOR_CLASSES_SUBSET).map(Number);

/** Terima semua kelas COCO (0..79). */
export const isIndoorClass = (classId: number): boolean => {
  return classId >= 0 && classId < 80;
};
