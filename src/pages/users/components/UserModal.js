import { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

class UserEditModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showModelHandler = (e) => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  okHandler = () => {
    const { onOk } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        values.id=this.props.record.id;
        console.log(values);
        onOk(values);
        console.log("values"+values);
        console.log(values);
        this.hideModelHandler();
        console.log(this.props.record);

        if(values.id === undefined){
          //this.props.record = {};
          console.log("record2");

          this.props.form.resetFields();
        }

      }
    });
  };

  render() {
    const { children } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { published, description, author, title } = this.props.record;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>
          { children }
        </span>
        <Modal
          title="Edit User"
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form horizontal onSubmit={this.okHandler}>
            <FormItem
              {...formItemLayout}
              label="published"
            >
              {
                getFieldDecorator('published', {
                  initialValue: published,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="description"
            >
              {
                getFieldDecorator('description', {
                  initialValue: description,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="author"
            >
              {
                getFieldDecorator('author', {
                  initialValue: author,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="title"
            >
              {
                getFieldDecorator('title', {
                  initialValue: title,
                })(<Input />)
              }
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(UserEditModal);
