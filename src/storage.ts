import mongoose from "mongoose";

export async function setupStrage() {
  try {
    // TODO: 実験で適当な認証情報をベタ書きしている、本番では.envに記載する。
    await mongoose.connect("mongodb://localhost:27017", {
      user: "akira",
      pass: "akira",
      dbName: "todo",
    });
    console.log("mongodb connection is established");
  } catch (e: any) {
    console.log(`mongodb connection error: ${e.message}`);
    throw e;
  }
}
