import wordpressService from "../services/wordpressServices.js";
import AppError from "../utils/AppError.js";
import config from "../config/index.js";

jest.mock("../config/index.js", () => ({
  db: {
    query: jest.fn(),
    getConnection: jest.fn(() => ({
      beginTransaction: jest.fn(),
      query: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn(),
      release: jest.fn(),
    })),
  },
}));

describe("wordpressService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("deleteSponsorByEmail", () => {
    it("should delete a sponsor and their relationships", async () => {
      const email = "test@example.com";
      const sponsorId = 1;
      const dogIds = [101, 102];

      const connection = await config.db.getConnection();
      connection.query
        .mockResolvedValueOnce([[{ id: sponsorId }]]) 
        .mockResolvedValueOnce([dogIds.map(id => ({ dog_id: id }))]) 
        .mockResolvedValueOnce(undefined) 
        .mockResolvedValueOnce(undefined); 

      await wordpressService.deleteSponsorByEmail(email);

      expect(connection.beginTransaction).toHaveBeenCalled();
      expect(connection.query).toHaveBeenCalledWith("SELECT id FROM wp_custom_sponsors WHERE email = ?", [email]);
      expect(connection.query).toHaveBeenCalledWith("SELECT DISTINCT dog_id FROM wp_custom_dog_sponsors WHERE sponsor_id = ?", [sponsorId]);
      expect(connection.query).toHaveBeenCalledWith("DELETE FROM wp_custom_dog_sponsors WHERE sponsor_id = ?", [sponsorId]);
      expect(connection.query).toHaveBeenCalledWith("DELETE FROM wp_custom_sponsors WHERE id = ?", [sponsorId]);
      expect(connection.commit).toHaveBeenCalled();
      expect(connection.rollback).not.toHaveBeenCalled();
      expect(connection.release).toHaveBeenCalled();
    });

    it("should throw an error if sponsor not found", async () => {
      const email = "nonexistent@example.com";

      const connection = await config.db.getConnection();
      connection.query.mockResolvedValueOnce([[]]);

      await expect(wordpressService.deleteSponsorByEmail(email)).rejects.toThrow(
        new AppError("No se encontró ningún patrocinador con ese correo electrónico.", 404)
      );

      expect(connection.beginTransaction).toHaveBeenCalled();
      expect(connection.query).toHaveBeenCalledWith("SELECT id FROM wp_custom_sponsors WHERE email = ?", [email]);
      expect(connection.commit).not.toHaveBeenCalled();
      expect(connection.rollback).toHaveBeenCalled();
      expect(connection.release).toHaveBeenCalled();
    });
  });
});