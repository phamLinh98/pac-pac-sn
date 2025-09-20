import { getApi, addComment as addCommentAPI } from "../api/restApiConfig";
import { getCommentStatus, addComment, eventLoading, logError } from "./reduxComment";
import { decodeJwt } from "../SideFunction/VerifyJwtGetUserInfo";

// Redux thunk cho list status 
export const getCommentThunkFunction = (listId) => {
    return async (dispatch) => {
        dispatch(eventLoading(true));
        try {
            const data = await getApi(`/comment/${listId}`);
            const response = await data.json();
            dispatch(getCommentStatus(response));
        } catch (error) {
            console.log('error', error);
            dispatch(logError(error.message || 'Không thể tải bình luận'));
        } finally {
            dispatch(eventLoading(false));
        }
    }
};

// Redux thunk cho việc thêm comment mới
export const addCommentThunkFunction = (content, userId, listId) => {
    return async (dispatch) => {
        dispatch(eventLoading(true));
        try {
            await addCommentAPI(content, userId, listId);

            // Lấy thông tin user từ JWT token
            const getUserFromLocalStorage = localStorage.getItem('allow-login');
            const userData = decodeJwt(getUserFromLocalStorage);

            // Tạo comment object với đầy đủ thông tin để hiển thị ngay lập tức
            const newComment = {
                post_id: listId,
                content: content,
                user_id: userId,
                user_name: userData?.name || userData?.user_name || 'Anonymous',
                avatar: userData?.avatar || '',
                created_at: new Date().toISOString(),
            };

            dispatch(addComment(newComment));
        } catch (error) {
            console.log('error', error);
            dispatch(logError(error.message || 'Không thể thêm bình luận'));
        } finally {
            dispatch(eventLoading(false));
        }
    }
};