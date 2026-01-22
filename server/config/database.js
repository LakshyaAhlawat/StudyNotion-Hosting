const mongoose = require("mongoose");
require("dotenv").config();

const { MONGODB_URL } = process.env;

exports.connect = () => {
	mongoose
		.connect(MONGODB_URL, {
			// Note: options like useNewUrlParser/useUnifiedTopology are no longer required in Mongoose 7,
			// but keeping them here for backward compatibility in case you downgrade.
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => {
			console.log("DB Connection Success");
		})
		.catch((err) => {
			console.log("DB Connection Failed");
			console.log(err);
			process.exit(1);
		});
};
