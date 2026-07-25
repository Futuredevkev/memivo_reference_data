import type { AlbumMemberRole } from '../../../album';
import type { MemivoMomentType } from '../../enums';
import type { MemivoMomentBase } from './memivo-moment-base.interface';
export interface MemivoPostMoment<TRole extends string = AlbumMemberRole> extends MemivoMomentBase<TRole> {
    type: MemivoMomentType.POST;
    postId: string;
}
