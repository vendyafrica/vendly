import { mediaRepository } from "./media-repository";
import { MediaService } from "./media-service";

export const mediaService = new MediaService(mediaRepository);

export * from "./media-model";
