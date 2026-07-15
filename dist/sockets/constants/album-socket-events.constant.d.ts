export declare const ALBUM_SOCKET_EVENTS: {
    readonly IN: {
        readonly JOIN_ALBUM: "join-album";
        readonly LEAVE_ALBUM: "leave-album";
        readonly JOIN_STORY: "join-story";
        readonly LEAVE_STORY: "leave-story";
    };
    readonly OUT: {
        readonly JOIN_SUCCESS: "joined";
        readonly JOIN_ERROR: "join-error";
        readonly ALBUM_DELETED: "album-deleted";
        readonly PARTICIPANT_KICKED: "participant-kicked";
        readonly ALBUM_MEMBER_ROLE_CHANGED: "album-member-role-changed";
        readonly ALBUM_UPDATED: "album-updated";
        readonly ALBUM_VISIBILITY_CHANGED: "album-visibility-changed";
        readonly TAG_ADDED: "tag-added";
        readonly TAGS_ADDED: "tags-added";
        readonly TAG_REMOVED: "tag-removed";
        readonly STORY_TAG_REMOVED: "story.tag-removed";
        readonly PARTICIPANT_JOINED: "participant-joined";
        readonly HIGHLIGHTS_UPDATED: "highlights-updated";
        readonly MEMIVO_MOMENTS_UPDATED: "memivo.moments-updated";
        readonly STORIES_UPDATED: "stories.updated";
        readonly STORY_VIEW_COUNT_UPDATED: "story.view-count-updated";
        readonly ALBUM_DELETED_RECEIVED: "album-deleted-received";
        readonly PARTICIPANT_KICKED_RECEIVED: "participant-kicked-received";
        readonly ALBUM_MEMBER_ROLE_CHANGED_RECEIVED: "album-member-role-changed-received";
        readonly ALBUM_UPDATED_RECEIVED: "album-updated-received";
        readonly ALBUM_VISIBILITY_CHANGED_RECEIVED: "album-visibility-changed-received";
        readonly POST_DELETED: "post-deleted";
        readonly STORY_COMMENT_CREATED: "story-comment.created";
    };
};
