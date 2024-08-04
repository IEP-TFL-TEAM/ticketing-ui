import pb from '../api/pocketbaseClient';
export const getAvatarUrl = (record) => (record ? pb.getFileUrl(record, record.avatar) : null);
