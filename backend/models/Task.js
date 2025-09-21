import { sequelize, DataTypes } from "../database/database.js";

const Task = sequelize.define("Tasks", {
  nama: DataTypes.STRING,
  namaTugas: DataTypes.STRING,
  waktu: DataTypes.TIME,
});

export default Task;
