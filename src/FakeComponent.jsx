import { useFacadeOnlineApp } from "./reduxs/useFacade";

export const FakeComponent = () => {
    const { list, error,loading } = useFacadeOnlineApp();
    console.log('list', list);
    console.log('error', error)
    console.log('loading', loading)
    return 123;
}