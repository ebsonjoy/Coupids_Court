"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    createNewData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.create(data);
            }
            catch (error) {
                throw new Error(`Error creating data: ${error}`);
            }
        });
    }
    findOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findById(id).exec();
            }
            catch (error) {
                throw new Error(`Error finding data by ID: ${error}`);
            }
        });
    }
    findAllData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.find().exec();
            }
            catch (error) {
                throw new Error(`Error finding all data: ${error}`);
            }
        });
    }
    updateOneById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findByIdAndUpdate(id, { $set: data }, { new: true });
            }
            catch (error) {
                throw new Error(`Error updating data: ${error}`);
            }
        });
    }
    deleteOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.model.findByIdAndDelete(id).exec();
                return result !== null;
            }
            catch (error) {
                throw new Error(`Error deleting data: ${error}`);
            }
        });
    }
}
exports.BaseRepository = BaseRepository;
