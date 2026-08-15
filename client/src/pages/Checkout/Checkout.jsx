import { useEffect, useState } from "react";
import {
  Card,
  Col,
  Form,
  Input,
  Row,
  Button,
  Typography,
  message,
  Divider,
  Radio,
  Tag,
  Modal,
  Select,
  Space,
} from "antd";
import {
  PlusOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import MainLayout from "../../layouts/MainLayout";

import { createOrder } from "../../services/orderService";
import {
  getAddresses,
  addAddress,
} from "../../services/authService";

import { setCart } from "../../features/cart/cartSlice";

const { Title, Text } = Typography;

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const items = useSelector((state) => state.cart.items);

  const [loading, setLoading] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(true);

  const [selectedAddressId, setSelectedAddressId] =
    useState(null);

  const [addressModalOpen, setAddressModalOpen] =
    useState(false);

  const [addressSaving, setAddressSaving] =
    useState(false);

  const [addressForm] = Form.useForm();

  const total = items.reduce(
    (sum, item) =>
      sum + item.product.price * item.quantity,
    0
  );

  // Load saved addresses
  const loadAddresses = async () => {
    try {
      setAddressLoading(true);

      const res = await getAddresses();

      const savedAddresses = res.data.data || [];

      setAddresses(savedAddresses);

      // Select default address
      const defaultAddress = savedAddresses.find(
        (address) => address.isDefault
      );

      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id);
      } else if (savedAddresses.length > 0) {
        setSelectedAddressId(savedAddresses[0]._id);
      }
    } catch (err) {
      message.error(
        err.response?.data?.message ||
          "Failed to load addresses"
      );
    } finally {
      setAddressLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  // Add new address
  const handleAddAddress = async (values) => {
    try {
      setAddressSaving(true);

      const res = await addAddress(values);

      const updatedAddresses =
        res.data.data || [];

      setAddresses(updatedAddresses);

      // Select newly added address
      const newAddress =
        updatedAddresses[
          updatedAddresses.length - 1
        ];

      if (newAddress) {
        setSelectedAddressId(newAddress._id);
      }

      setAddressModalOpen(false);
      addressForm.resetFields();

      message.success(
        "Address added successfully"
      );
    } catch (err) {
      message.error(
        err.response?.data?.message ||
          "Failed to add address"
      );
    } finally {
      setAddressSaving(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!selectedAddressId) {
        message.warning(
          "Please select a shipping address"
        );
        return;
      }

      const selectedAddress = addresses.find(
        (address) =>
          address._id === selectedAddressId
      );

      if (!selectedAddress) {
        message.error(
          "Selected address not found"
        );
        return;
      }

      setLoading(true);

      const shippingAddress = {
        firstName: selectedAddress.firstName,
        lastName: selectedAddress.lastName,
        phone: selectedAddress.phone,
        address: selectedAddress.address,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
      };

      const res = await createOrder({
        shippingAddress,
      });

      dispatch(
        setCart({
          items: [],
        })
      );

      message.success(
        "Order placed successfully"
      );

      navigate(
        `/orders/${res.data.data._id}`
      );
    } catch (err) {
      message.error(
        err.response?.data?.message ||
          "Failed to place order"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <MainLayout>
        <Card>
          <Title level={3}>
            Your cart is empty
          </Title>

          <Button
            type="primary"
            onClick={() =>
              navigate("/products")
            }
          >
            Continue Shopping
          </Button>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Title level={2}>Checkout</Title>

      <Row gutter={[30, 30]}>
        {/* Shipping Address */}
        <Col xs={24} md={14}>
          <Card
            title="Shipping Address"
            extra={
              <Button
                type="link"
                icon={<PlusOutlined />}
                onClick={() =>
                  setAddressModalOpen(true)
                }
              >
                Add New Address
              </Button>
            }
          >
            {addressLoading ? (
              <Text type="secondary">
                Loading addresses...
              </Text>
            ) : addresses.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "30px 10px",
                }}
              >
                <EnvironmentOutlined
                  style={{
                    fontSize: 40,
                    marginBottom: 15,
                  }}
                />

                <Title level={4}>
                  No saved addresses
                </Title>

                <Text type="secondary">
                  Add a shipping address to
                  continue with your order.
                </Text>

                <br />

                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  style={{ marginTop: 20 }}
                  onClick={() =>
                    setAddressModalOpen(true)
                  }
                >
                  Add Address
                </Button>
              </div>
            ) : (
              <>
                <Radio.Group
                  value={selectedAddressId}
                  onChange={(e) =>
                    setSelectedAddressId(
                      e.target.value
                    )
                  }
                  style={{ width: "100%" }}
                >
                  <Space
                    direction="vertical"
                    size={16}
                    style={{ width: "100%" }}
                  >
                    {addresses.map(
                      (address) => (
                        <Card
                          key={address._id}
                          size="small"
                          style={{
                            width: "100%",
                            border:
                              selectedAddressId ===
                              address._id
                                ? "2px solid #1677ff"
                                : "1px solid #d9d9d9",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            setSelectedAddressId(
                              address._id
                            )
                          }
                        >
                          <Radio
                            value={address._id}
                          >
                            <div
                              style={{
                                marginLeft: 8,
                              }}
                            >
                              <div
                                style={{
                                  marginBottom: 8,
                                }}
                              >
                                <Text strong>
                                  {address.label}
                                </Text>

                                {address.isDefault && (
                                  <Tag
                                    color="green"
                                    style={{
                                      marginLeft: 8,
                                    }}
                                  >
                                    Default
                                  </Tag>
                                )}
                              </div>

                              <Text strong>
                                {
                                  address.firstName
                                }{" "}
                                {
                                  address.lastName
                                }
                              </Text>

                              <br />

                              <Text type="secondary">
                                {address.phone}
                              </Text>

                              <br />

                              <Text>
                                {
                                  address.address
                                }
                              </Text>

                              <br />

                              <Text>
                                {address.city},{" "}
                                {address.state} -{" "}
                                {address.pincode}
                              </Text>
                            </div>
                          </Radio>
                        </Card>
                      )
                    )}
                  </Space>
                </Radio.Group>

                <Button
                  type="dashed"
                  block
                  icon={<PlusOutlined />}
                  style={{
                    marginTop: 20,
                  }}
                  onClick={() =>
                    setAddressModalOpen(true)
                  }
                >
                  Add New Address
                </Button>
              </>
            )}

            {addresses.length > 0 && (
              <Button
                type="primary"
                size="large"
                block
                loading={loading}
                disabled={!selectedAddressId}
                style={{
                  marginTop: 25,
                }}
                onClick={handleSubmit}
              >
                Place Order
              </Button>
            )}
          </Card>
        </Col>

        {/* Order Summary */}
        <Col xs={24} md={10}>
          <Card title="Order Summary">
            {items.map((item) => (
              <div
                key={item.product._id}
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  marginBottom: 15,
                }}
              >
                <div>
                  <Text strong>
                    {item.product.title}
                  </Text>

                  <br />

                  <Text type="secondary">
                    Qty: {item.quantity}
                  </Text>
                </div>

                <Text>
                  ₹
                  {item.product.price *
                    item.quantity}
                </Text>
              </div>
            ))}

            <Divider />

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
              }}
            >
              <Title level={4}>
                Total
              </Title>

              <Title level={4}>
                ₹{total}
              </Title>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Add Address Modal */}
      <Modal
        title="Add New Address"
        open={addressModalOpen}
        onCancel={() => {
          setAddressModalOpen(false);
          addressForm.resetFields();
        }}
        footer={null}
        destroyOnHidden
      >
        <Form
          form={addressForm}
          layout="vertical"
          onFinish={handleAddAddress}
        >
          <Form.Item
            label="Address Type"
            name="label"
            initialValue="Home"
          >
            <Select
              options={[
                {
                  value: "Home",
                  label: "Home",
                },
                {
                  value: "Work",
                  label: "Work",
                },
                {
                  value: "Other",
                  label: "Other",
                },
              ]}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[
                  {
                    required: true,
                    message:
                      "Enter first name",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[
                  {
                    required: true,
                    message:
                      "Enter last name",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              {
                required: true,
                message:
                  "Enter phone number",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[
              {
                required: true,
                message: "Enter address",
              },
            ]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="City"
                name="city"
                rules={[
                  {
                    required: true,
                    message: "Enter city",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="State"
                name="state"
                rules={[
                  {
                    required: true,
                    message: "Enter state",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Pincode"
                name="pincode"
                rules={[
                  {
                    required: true,
                    message:
                      "Enter pincode",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={addressSaving}
          >
            Save Address
          </Button>
        </Form>
      </Modal>
    </MainLayout>
  );
};

export default Checkout;