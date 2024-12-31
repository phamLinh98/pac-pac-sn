import React, { useState } from "react";
import { Button } from "antd"; // Import component Button từ antd
import { IoMdAdd } from "react-icons/io";
import { IoAddCircleSharp } from "react-icons/io5";

export const ButtonAddFriend = () => {
  const [state, setState] = useState(false);
  const changeStatusAddFriend = () => {
    setState((pre) => !pre);
  };
  return (
    <Button type="primary" style={{ marginRight: '10px' }} onClick={changeStatusAddFriend}>
      {!state ? (
        <>
          <span style={{ marginTop: '110px' }}>
            <IoAddCircleSharp />
          </span>
          <span>Kết Bạn</span>
        </>
      ) : (
        <>
          <IoMdAdd />
          <span>Hủy Yêu Cầu</span>
        </>
      )}
    </Button>
  );
};