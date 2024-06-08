import { jwtTokenService } from "../features/application";
import { ApiError } from "../helper/api-errors";
import { authRepository, devicesRepository } from "../repositories";

export const devicesService = {
  async delete(deviceId: string, refreshToken: string) {
    const token = await jwtTokenService.decodeToken(refreshToken);
    const currentSession = await authRepository.getSessionByDeviceId(
      token.deviceId
    );

    if (!currentSession) {
      throw ApiError.UnauthorizedError("Unauthorized. Session not found", [
        "The session for the given device ID does not exist.",
      ]);
    }

    if (currentSession.userId !== token.userId) {
      throw ApiError.ForbiddenError("Forbidden", [
        "You are not allowed to delete this session.",
      ]);
    }
    return await devicesRepository.removeDevice(deviceId);
  },

  async deleteRest(refreshToken: string) {
    const token = await jwtTokenService.decodeToken(refreshToken);
    const currentSession = await authRepository.getSessionByDeviceId(
      token.deviceId
    );

    if (!currentSession) {
      throw ApiError.UnauthorizedError("Unauthorized. Session not found", [
        "The session for the given device ID does not exist.",
      ]);
    }

    return await devicesRepository.removeDevices(currentSession.deviceId);
  },
};
