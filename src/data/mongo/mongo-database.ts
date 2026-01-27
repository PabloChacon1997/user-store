import mongoose from "mongoose";

interface Options {
  mongoUrl: string;
  dbName: string;
}


export class MongoDatbase {
  static async coonect(options: Options) {
    const { mongoUrl, dbName } = options;

    try {
      await mongoose.connect(mongoUrl, {
        dbName,
      });
      return true;
    } catch (error) {
      console.log('Mongo connection error')
      throw error;
    }
  }

  static async disconnect() {
    await mongoose.disconnect()
  }
}