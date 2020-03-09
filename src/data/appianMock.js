import Chance from "chance";

const chance = new Chance();

const Appian = {
  getLocale: () => chance.pickone(["en_US", "en_GB", "de", "fr_FR", "fr_CA"]),
  getAccentColor: () => chance.color({ format: "hex" })
};

export default Appian;
