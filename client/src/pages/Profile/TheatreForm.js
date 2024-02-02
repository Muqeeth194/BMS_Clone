import React from "react";
import { Col, Form, message, Modal, Row } from "antd";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, Showloading } from "../../redux/loadersSlice";
import { AddTheatre, UpdateTheatre } from "../../apicalls/theatres";
// import moment from "moment";
import { useNavigate } from "react-router-dom";

function TheatreForm({
  showTheatreFormModal,
  setShowTheatreFormModal,
  selectedTheatre,
  setSelectedTheatre,
  getData,
  formType,
}) {

    const { user } = useSelector((state)=>state.users)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    console.log(values);
    try {
      dispatch(Showloading());
      let response = null;

      if (formType === "add") {
        response = await AddTheatre({
            ...values,
            owner: user._id
        });
      } 

      else{
        response = await UpdateTheatre({
          ...values,
          theatreId: selectedTheatre._id,
          owner: selectedTheatre.owner
        })
      }

      if (response.success) {
        getData();
        message.success(response.message);
        setShowTheatreFormModal(false);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <Modal
      title={formType === "add" ? "ADD THEATRE" : "EDIT THEATRE"}
      open={showTheatreFormModal}
      onCancel={() => {
        setShowTheatreFormModal(false);
        setSelectedTheatre(null);
      }}
      footer={null}
      width={800}
    >
      <Form layout="vertical" initialValues={selectedTheatre} onFinish={onFinish} >
        <Row gutter={16}>
          <Col span={23}>
            <Form.Item label="Theatre Name" name="name">
              <input type="text" />
            </Form.Item>
          </Col>

          <Col span={23}>
            <Form.Item label="Theatre Address" name="address">
              <input type="text" />
            </Form.Item>
          </Col>

          <Col span={23}>
            <Form.Item label="Phone" name="phone">
              <input type="number" />
            </Form.Item>
          </Col>

          <Col span={23}>
            <Form.Item label="Email" name="email">
              <input type="text" />
            </Form.Item>
          </Col>

        </Row>

        <div className="flex justify-end gap-1">
          <Button
            title="Cancel"
            variant="outlined"
            type="button"
            onClick={() => {
              setShowTheatreFormModal(false);
              setSelectedTheatre(null);
            }}
          />
          <Button title={formType === 'add' ? "Add" : "Update"} type="submit" />
        </div>
      </Form>
    </Modal>
  );
}

export default TheatreForm;