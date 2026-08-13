import { Button, Form, Input, Modal, message } from "antd";
import { useState } from "react";
import { MdManageAccounts } from "react-icons/md";
import PropTypes from "prop-types";
import { updateAccountApi } from "../api/restApiConfig";
import { useAppSettings } from "../contexts/AppSettingsContext";

export const AccountSettingsButton = ({ currentName, onUpdated, block = false }) => {
  const { t } = useAppSettings();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const openModal = (event) => {
    event?.stopPropagation();
    form.setFieldsValue({ name: currentName || "" });
    setOpen(true);
  };

  const closeModal = () => {
    if (!saving) {
      setOpen(false);
      form.resetFields();
    }
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      const data = await updateAccountApi({
        name: values.name.trim(),
        ...(values.newPassword
          ? { currentPassword: values.currentPassword, newPassword: values.newPassword }
          : {}),
      });
      localStorage.setItem("allow-login", data.token);
      onUpdated?.(data.token);
      message.success(t.accountUpdated);
      setOpen(false);
      form.resetFields();
    } catch (error) {
      if (!error?.errorFields) message.error(error?.message || t.accountUpdateFailed);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Button
        type="text"
        block={block}
        icon={<MdManageAccounts />}
        onClick={openModal}
        style={block ? { textAlign: "left", paddingInline: 0 } : undefined}
      >
        {t.updateAccount}
      </Button>
      <Modal
        title={t.updateAccount}
        open={open}
        onOk={save}
        onCancel={closeModal}
        confirmLoading={saving}
        okText={t.save}
        cancelText={t.cancel}
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            label={t.name}
            name="name"
            rules={[
              { required: true, whitespace: true, message: t.nameRequired },
              { max: 100 },
            ]}
          >
            <Input autoComplete="name" />
          </Form.Item>
          <Form.Item label={t.currentPassword} name="currentPassword">
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Form.Item
            label={t.newPassword}
            name="newPassword"
            dependencies={["currentPassword"]}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value) return Promise.resolve();
                  if (!getFieldValue("currentPassword")) return Promise.reject(new Error(t.currentPasswordRequired));
                  if (value.length < 8) return Promise.reject(new Error(t.passwordMin));
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            label={t.confirmPassword}
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!getFieldValue("newPassword") && !value) return Promise.resolve();
                  return value === getFieldValue("newPassword")
                    ? Promise.resolve()
                    : Promise.reject(new Error(t.passwordMismatch));
                },
              }),
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

AccountSettingsButton.propTypes = {
  currentName: PropTypes.string,
  onUpdated: PropTypes.func,
  block: PropTypes.bool,
};
