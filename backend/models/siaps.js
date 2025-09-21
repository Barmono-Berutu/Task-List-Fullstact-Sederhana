import { sequelize, DataTypes } from "../database/database.js";

const siap = sequelize.define("siaps", {
  nama: DataTypes.STRING,
  namaTugas: DataTypes.STRING,
  waktu: DataTypes.TIME,
});

export default siap;
