import { useFacadeOnlineApp } from "./reduxs/useFacade";

export const FakeComponent = () => {
    const { list, error,loading } = useFacadeOnlineApp();
    return 123;
}