import type { PaginationRequest, SortOrder } from '../../common';
import type { FolderSortField } from '../enums';
/** La lista de carpetas de un álbum: orden por columna y dirección, y búsqueda. */
export interface GetFoldersQueryRequest extends PaginationRequest {
    sortBy?: FolderSortField;
    direction?: SortOrder;
}
