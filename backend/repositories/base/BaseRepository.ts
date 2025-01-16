import { Model } from "mongoose";
import { IBaseRepository } from "../../interfaces/base/IBaseRepository";

export class BaseRepository<T> implements IBaseRepository<T> {
  constructor(private readonly model: Model<T>) {}

  async createNewData(data: Partial<T>): Promise<T> {
    try {
      return await this.model.create(data);
    } catch (error) {
      throw new Error(`Error creating data: ${error}`);
    }
  }

  async findOneById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id).exec();
    } catch (error) {
      throw new Error(`Error finding data by ID: ${error}`);
    }
  }

  async findAllData(): Promise<T[]> {
    try {
      return await this.model.find().exec();
    } catch (error) {
      throw new Error(`Error finding all data: ${error}`);
    }
  }

  async updateOneById(id: string, data: Partial<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(id, { $set: data }, { new: true });
    } catch (error) {
      throw new Error(`Error updating data: ${error}`);
    }
  }

  async deleteOneById(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id).exec();
      return result !== null;
    } catch (error) {
      throw new Error(`Error deleting data: ${error}`);
    }
  }
}
