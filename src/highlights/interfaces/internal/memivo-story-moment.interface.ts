import type { AlbumMemberRole } from '../../../album';
import type { MemivoMomentType } from '../../enums';
import type { MemivoMomentBase } from './memivo-moment-base.interface';

export interface MemivoStoryMoment<TRole extends string = AlbumMemberRole>
  extends MemivoMomentBase<TRole> {
  type: MemivoMomentType.STORY;
  /**
   * Único dato de destino. No viaja `albumId` ni `state`: el tap resuelve contra
   * el servidor, porque la historia puede archivarse entre el render y el toque.
   */
  storyId: string;
}
