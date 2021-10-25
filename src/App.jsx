import "./App.css";
import {
  Layout,
  Form,
  InputNumber,
  Input,
  Button,
  Upload,
  message,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useState } from "react";
import axios from "axios";

const { Dragger } = Upload;

const { Header, Footer, Content } = Layout;

const hppwd = "net4131314MISAKA";

const baseURL = "http://192.168.31.190:3000/api/v1";

axios.defaults.baseURL = "http://192.168.31.190:3000/api/v1";

message.config({
  duration: 1.5,
  maxCount: 3,
});

function App() {
  const [filename, setFilename] = useState("");
  const [copies, setCopies] = useState(1);
  const [needLogin, setNeedLogin] = useState(
    localStorage.getItem("hppwd") !== hppwd
  );

  const onFinishLogin = (values) => {
    if (values.password === hppwd) {
      message.success("认证成功，请享用413打印服务吧");
      localStorage.setItem("hppwd", hppwd);
      setTimeout(() => {
        setNeedLogin(false);
      }, 1000);
    } else {
      message.error("认证失败，看来你不是我要等的人呢");
    }
  };

  const onFinishLoginFailed = (errorInfo) => {
    message.error("你输密码了吗");
  };

  const onFinishSubmit = (values) => {
    // console.log(values);
    if (values.files[0].status === "error") {
      message.error("文件未成功上传");
      return;
    }
    axios
      .post("/file/print", {
        // filename: values.files[0].name,
        filename: filename,
        copies: copies,
      })
      .then((res) => {
        message.success("提交成功，你猜我能不能打印");
        // console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFinishSubmitFailed = (errorInfo) => {
    message.error("好像有点问题");
  };

  const uploadProps = {
    name: "file",
    action: baseURL + "/file/upload",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name}文件上传成功`);
        // console.log(info.file.response.data);
        setFilename(info.file.response.data);
      } else if (status === "error") {
        message.error(`${info.file.name}文件上传失败`);
      }
    },
    beforeUpload: (file) => {
      if (file.type !== "application/pdf") {
        message.error(`${file.name}不是pdf文件`);
      }
      return file.type === "application/pdf" ? true : Upload.LIST_IGNORE;
    },
    onDrop(e) {
      // console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const normFile = (e) => {
    // console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  function onChange(value) {
    setCopies(value);
    // console.log(value);
  }

  return (
    <div className="App">
      <Layout className="layout">
        <Header>
          <div
            style={{
              color: "white",
              textAlign: "center",
            }}
          >
            413打印铺
          </div>
        </Header>
        <Content style={{ padding: "50px" }}>
          <Form
            name="login"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 4 }}
            onFinish={onFinishLogin}
            onFinishFailed={onFinishLoginFailed}
            autoComplete="off"
            style={{ display: needLogin === true ? "" : "none" }}
          >
            <Form.Item
              label="认证密码"
              name="password"
              rules={[{ required: true, message: "也许是WIFI密码？" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 4, span: 4 }}>
              <Button type="primary" htmlType="submit">
                登录
              </Button>
            </Form.Item>
          </Form>

          <Form
            name="main"
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 8,
            }}
            initialValues={{
              copies: 1,
            }}
            onFinish={onFinishSubmit}
            onFinishFailed={onFinishSubmitFailed}
            autoComplete="off"
            style={{ display: needLogin === false ? "" : "none" }}
          >
            <Form.Item
              label="份数"
              name="copies"
              rules={[
                {
                  required: true,
                  message: "嘿，快告诉我要打几份",
                },
              ]}
            >
              <InputNumber min={1} max={10} onChange={onChange} />
            </Form.Item>

            <Form.Item
              name="files"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              wrapperCol={{
                offset: 4,
                span: 12,
              }}
              rules={[
                {
                  required: true,
                  message: "你还没上传文件诶",
                },
              ]}
            >
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                <p className="ant-upload-hint">
                  支持单个文件，目前仅支持pdf文件上传
                </p>
              </Dragger>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 4,
                span: 4,
              }}
            >
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </Content>
        <Footer
          style={{
            textAlign: "center",
            backgroundColor: "#c6c6c6",
          }}
        >
          413 Print Shop Created by Arale
        </Footer>
      </Layout>
    </div>
  );
}

export default App;
