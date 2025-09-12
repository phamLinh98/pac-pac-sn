import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getThunkMyProfileList } from "./thunkUserProfileStatus";

export const useFacadeMyProfileList = (id) => {
    const { listUserById, error, loading } = useSelector(state => state.reduxListUserByIdByProfile);
    const dispatch = useDispatch();
    //console.log("listFacadeMyProfile", listUserById);
    useEffect(() => {
        dispatch(getThunkMyProfileList(id));
    }, [dispatch,id]);
    return {
        listUserById,
        error,
        loading
    }
}