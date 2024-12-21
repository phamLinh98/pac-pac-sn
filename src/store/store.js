import { configureStore } from "@reduxjs/toolkit";
import onlineAppRedux from '../reduxs/reduxOnlineApp';

export const store = configureStore({
    reducer: {
        onlineApp: onlineAppRedux, // Use a matching or descriptive name.
    }
})