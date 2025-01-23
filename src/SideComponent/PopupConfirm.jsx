import { Button, Popconfirm } from "antd"

export const PopupConfirmComponent = () => {
    return <Popconfirm
        title="Delete the task"
        description="Are you sure to delete this task?"
        okText="Yes"
        cancelText="No"
    >
        <Button danger>Delete</Button>
    </Popconfirm>
}