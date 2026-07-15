"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockErrorCode = void 0;
/**
 * Codigos de error del modulo de bloqueos.
 */
var BlockErrorCode;
(function (BlockErrorCode) {
    BlockErrorCode["USER_BLOCK_SELF"] = "USER_BLOCK_SELF";
    BlockErrorCode["USER_BLOCK_NOT_FOUND"] = "USER_BLOCK_NOT_FOUND";
    BlockErrorCode["USER_BLOCK_CREATE_FAILED"] = "USER_BLOCK_CREATE_FAILED";
    BlockErrorCode["USER_BLOCK_DELETE_FAILED"] = "USER_BLOCK_DELETE_FAILED";
    BlockErrorCode["USER_BLOCK_LIST_FAILED"] = "USER_BLOCK_LIST_FAILED";
    BlockErrorCode["USER_BLOCK_FORBIDDEN_INTERACTION"] = "USER_BLOCK_FORBIDDEN_INTERACTION";
})(BlockErrorCode || (exports.BlockErrorCode = BlockErrorCode = {}));
