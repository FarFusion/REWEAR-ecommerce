import { useEffect, useState } from "react";
import {
  Avatar,
  Card,
  Col,
  Row,
  Typography,
  Tag,
  Button,
  Statistic,
  Divider,
  Spin,
  message,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  Upload,
  InputNumber
} from "antd";

import {
  UserOutlined,
  ShoppingOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
  EditOutlined,
  CheckCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  DeleteOutlined,
  HomeOutlined,
  EnvironmentOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import { Link } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";
import { 
  getProfile, 
  updateProfile, 
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  uploadAvatar, } from "../../services/authService";
import { getCart } from "../../services/cartService";
import { getWishlist } from "../../services/wishlistService";
import { getOrders } from "../../services/orderService";

import "./Profile.css";




const { Title, Text } = Typography;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressSaving, setAddressSaving] = useState(false);

  const [addressForm] = Form.useForm();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [form] = Form.useForm();

  useEffect(() => {
    loadProfile();
    loadAddresses();
  }, []);
    
    const handleAvatarUpload = async ({ file, onSuccess, onError }) => {
      try {
        const formData = new FormData();
        formData.append("avatar", file);

        const res = await uploadAvatar(formData);

        const updatedUser = res.data.data;

        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        message.success("Profile picture updated successfully.");

        onSuccess(res.data);
      } catch (error) {
        console.error("Avatar upload error:", error);

        message.error(
          error.response?.data?.message || "Failed to upload profile picture."
        );

        onError(error);
      }
    };
  
    const openEditProfile = () => {
        form.setFieldsValue({
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
        });

        setEditOpen(true);
    };

    const openAddAddress = () => {
      setEditingAddress(null);

      addressForm.resetFields();

      addressForm.setFieldsValue({
        label: "Home",
      });

      setAddressModalOpen(true);
    };

    const openEditAddress = (address) => {
      setEditingAddress(address);

      addressForm.setFieldsValue({
        label: address.label,
        firstName: address.firstName,
        lastName: address.lastName,
        phone: address.phone,
        address: address.address,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      });

      setAddressModalOpen(true);
    };

    const handleSaveAddress = async (values) => {
      try {
        setAddressSaving(true);

        if (editingAddress) {
          const res = await updateAddress(
            editingAddress._id,
            values
          );

          setAddresses(res.data.data || []);

          message.success(
            "Address updated successfully"
          );
        } else {
          const res = await addAddress(values);

          setAddresses(res.data.data || []);

          message.success(
            "Address added successfully"
          );
        }

        setAddressModalOpen(false);
        addressForm.resetFields();
        setEditingAddress(null);
      } catch (err) {
        message.error(
          err.response?.data?.message ||
            "Failed to save address"
        );
      } finally {
        setAddressSaving(false);
      }
    };

    const handleDeleteAddress = async (addressId) => {
      try {
        const res = await deleteAddress(addressId);

        setAddresses(res.data.data || []);

        message.success(
          "Address deleted successfully"
        );
      } catch (err) {
        message.error(
          err.response?.data?.message ||
            "Failed to delete address"
        );
      }
    };

    const handleSetDefaultAddress = async (addressId) => {
      try {
        const res = await setDefaultAddress(addressId);

        setAddresses(res.data.data || []);

        message.success(
          "Default address updated"
        );
      } catch (err) {
        message.error(
          err.response?.data?.message ||
            "Failed to update default address"
        );
      }
    };

    const handleUpdateProfile = async (values) => {
        try {
            setSaving(true);

            const res = await updateProfile(values);

            setUser(res.data.data);

            localStorage.setItem(
            "user",
            JSON.stringify(res.data.data)
            );

            message.success("Profile updated successfully");

            setEditOpen(false);
        } catch (err) {
            message.error(
            err.response?.data?.message ||
                "Failed to update profile"
            );
        } finally {
            setSaving(false);
        }
    };    

    const loadAddresses = async () => {
      try {
        setAddressLoading(true);

        const res = await getAddresses();

        setAddresses(res.data.data || []);
      } catch (err) {
        message.error(
          err.response?.data?.message ||
            "Failed to load saved addresses"
        );
      } finally {
        setAddressLoading(false);
      }
    };
  
    const loadProfile = async () => {
    try {
      setLoading(true);

      const profileRes = await getProfile();

      setUser(profileRes.data.data);

      try {
        const cartRes = await getCart();

        setCartCount(
          cartRes.data.data?.items?.reduce(
            (total, item) => total + item.quantity,
            0
          ) || 0
        );
      } catch (err) {
        console.log("Cart loading failed");
      }

      try {
        const wishlistRes = await getWishlist();

        setWishlistCount(
          wishlistRes.data.data?.length || 0
        );
      } catch (err) {
        console.log("Wishlist loading failed");
      }
    } catch (err) {
      message.error(
        err.response?.data?.message ||
          "Failed to load profile"
      );
    }
    try {
        const ordersRes = await getOrders();

        setOrderCount(
            ordersRes.data.data?.length || 0
        );
    } catch (err) {
    console.log("Orders loading failed");
    }

    finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: 80,
          }}
        >
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <Card>
          Unable to load profile.
        </Card>
      </MainLayout>
    );
  }

  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim();

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(
        "en-IN",
        {
          month: "long",
          year: "numeric",
        }
      )
    : "-";
  
  return (
    <MainLayout>
      <div className="profile-page">
        {/* Profile Header */}

        <Card className="profile-header-card">
          <div className="profile-cover" />

          <div className="profile-header-content">
            <Row
              align="middle"
              justify="space-between"
              gutter={[20, 20]}
            >
              <Col xs={24} lg={18}>
                <Row
                  align="middle"
                  gutter={[20, 15]}
                  className="profile-user-row"
                >
                  <Col>
                    <Avatar
                      size={100}
                      src={user.avatar || undefined}
                      icon={
                        !user.avatar && (
                          <UserOutlined />
                        )
                      }
                      className="profile-avatar"
                    />
                  </Col>

                  <Col className="profile-user-info">
                    <Title className="profile-name">
                      {fullName || "User"}
                    </Title>

                    <Text
                      type="secondary"
                      className="profile-email"
                    >
                      {user.email}
                    </Text>

                    <div className="profile-tags">
                      <Tag color="blue">
                        {user.role?.toUpperCase()}
                      </Tag>

                      {user.isVerified ? (
                        <Tag
                          color="success"
                          icon={
                            <CheckCircleOutlined />
                          }
                        >
                          Verified
                        </Tag>
                      ) : (
                        <Tag color="orange">
                          Not Verified
                        </Tag>
                      )}
                    </div>
                  </Col>
                </Row>
              </Col>

              <Col xs={24} lg="auto">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={openEditProfile}
                  className="profile-edit-button"
                >
                  Edit Profile
                </Button>
              </Col>
            </Row>
          </div>
        </Card>

        {/* Account Statistics */}

        <Title
          level={3}
          className="profile-section-title"
        >
          Account Overview
        </Title>

        <Row
          gutter={[16, 16]}
          className="profile-statistics"
        >
          <Col xs={24} sm={8}>
            <Link to="/orders">
              <Card hoverable className="profile-stat-card">
                <Statistic
                  title="My Orders"
                  value={orderCount}
                  prefix={<ShoppingOutlined />}
                />
              </Card>
            </Link>
          </Col>

          <Col xs={24} sm={8}>
            <Link to="/wishlist">
              <Card hoverable className="profile-stat-card">
                <Statistic
                  title="Wishlist"
                  value={wishlistCount}
                  prefix={<HeartOutlined />}
                />
              </Card>
            </Link>
          </Col>

          <Col xs={24} sm={8}>
            <Link to="/cart">
              <Card hoverable className="profile-stat-card">
                <Statistic
                  title="Cart Items"
                  value={cartCount}
                  prefix={
                    <ShoppingCartOutlined />
                  }
                />
              </Card>
            </Link>
          </Col>
        </Row>

        {/* Personal Information */}

        <Row
          gutter={[20, 20]}
          className="profile-information-row"
        >
          <Col xs={24} lg={12}>
            <Card
              title="Personal Information"
              className="profile-section-card"
            >
              <InfoRow
                label="First Name"
                value={user.firstName}
              />

              <InfoRow
                label="Last Name"
                value={user.lastName}
              />

              <InfoRow
                label="Email"
                value={user.email}
                icon={<MailOutlined />}
              />

              <InfoRow
                label="Phone"
                value={
                  user.phone || "Not provided"
                }
                icon={<PhoneOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card
              title="Account Information"
              className="profile-section-card"
            >
              <InfoRow
                label="Account Type"
                value={user.role}
              />

              <InfoRow
                label="Verification"
                value={
                  user.isVerified
                    ? "Verified"
                    : "Not Verified"
                }
              />

              <InfoRow
                label="Member Since"
                value={memberSince}
              />

              <InfoRow
                label="User ID"
                value={user._id}
              />
            </Card>
          </Col>
        </Row>

        {/* Saved Addresses */}

        <Card
          className="profile-address-card"
          title={
            <div className="profile-address-header">
              <span>
                <EnvironmentOutlined className="address-title-icon" />
                Saved Addresses
              </span>

              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={openAddAddress}
              >
                Add Address
              </Button>
            </div>
          }
        >
          {addressLoading ? (
            <div className="profile-address-loading">
              <Spin />
            </div>
          ) : addresses.length === 0 ? (
            <div className="profile-no-address">
              <EnvironmentOutlined className="no-address-icon" />

              <div>
                <Text type="secondary">
                  You don't have any saved addresses.
                </Text>
              </div>

              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="first-address-button"
                onClick={openAddAddress}
              >
                Add Your First Address
              </Button>
            </div>
          ) : (
            <Row gutter={[16, 16]}>
              {addresses.map((address) => (
                <Col
                  xs={24}
                  md={12}
                  key={address._id}
                >
                  <Card
                    size="small"
                    className={`saved-address ${
                      address.isDefault
                        ? "default-address"
                        : ""
                    }`}
                  >
                    <div className="saved-address-header">
                      <div>
                        <Text strong>
                          {address.label}
                        </Text>

                        {address.isDefault && (
                          <Tag
                            color="blue"
                            className="default-address-tag"
                          >
                            Default
                          </Tag>
                        )}
                      </div>
                    </div>

                    <Divider className="address-divider" />

                    <div className="address-details">
                      <Text strong>
                        {address.firstName}{" "}
                        {address.lastName}
                      </Text>

                      <Text type="secondary">
                        {address.phone}
                      </Text>

                      <Text>
                        {address.address}
                      </Text>

                      <Text>
                        {address.city},{" "}
                        {address.state} -{" "}
                        {address.pincode}
                      </Text>
                    </div>

                    <Divider className="address-divider" />

                    <div className="address-actions">
                      <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() =>
                          openEditAddress(address)
                        }
                      >
                        Edit
                      </Button>

                      <Popconfirm
                        title="Delete this address?"
                        description="This address will be permanently deleted."
                        onConfirm={() =>
                          handleDeleteAddress(
                            address._id
                          )
                        }
                        okText="Delete"
                        cancelText="Cancel"
                      >
                        <Button
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                        >
                          Delete
                        </Button>
                      </Popconfirm>

                      {!address.isDefault && (
                        <Button
                          size="small"
                          type="link"
                          onClick={() =>
                            handleSetDefaultAddress(
                              address._id
                            )
                          }
                        >
                          Set Default
                        </Button>
                      )}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card>

        {/* Quick Actions */}

        <Card
          title="Quick Actions"
          className="profile-quick-actions"
        >
          <div className="quick-actions-list">
            <Link to="/orders">
              <Button icon={<ShoppingOutlined />}>
                My Orders
              </Button>
            </Link>

            <Link to="/wishlist">
              <Button icon={<HeartOutlined />}>
                Wishlist
              </Button>
            </Link>

            <Link to="/cart">
              <Button
                icon={
                  <ShoppingCartOutlined />
                }
              >
                Shopping Cart
              </Button>
            </Link>

            {user.role === "admin" && (
              <Link to="/admin/dashboard">
                <Button
                  type="primary"
                  icon={<UserOutlined />}
                >
                  Admin Dashboard
                </Button>
              </Link>
            )}
          </div>
        </Card>

        {/* Edit Profile Modal */}

        <Modal
          title="Edit Profile"
          open={editOpen}
          onCancel={() => setEditOpen(false)}
          footer={null}
          className="profile-modal"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateProfile}
          >
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[
                {
                  required: true,
                  message:
                    "Please enter your first name",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[
                {
                  required: true,
                  message:
                    "Please enter your last name",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Phone"
              name="phone"
            >
              <Input />
            </Form.Item>

            <Form.Item label="Profile Picture">
              <div className="avatar-upload">
                <Avatar
                  size={80}
                  src={user?.avatar || undefined}
                  icon={
                    !user?.avatar && (
                      <UserOutlined />
                    )
                  }
                />

                <Upload
                  accept="image/*"
                  showUploadList={false}
                  customRequest={
                    handleAvatarUpload
                  }
                >
                  <Button
                    icon={<UploadOutlined />}
                  >
                    Choose Image
                  </Button>
                </Upload>
              </div>

              <Typography.Text
                type="secondary"
                className="avatar-help-text"
              >
                JPG, JPEG, PNG or WEBP.
                Maximum size: 5 MB.
              </Typography.Text>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={saving}
              block
            >
              Save Changes
            </Button>
          </Form>
        </Modal>

        {/* Address Modal */}

        <Modal
          title={
            editingAddress
              ? "Edit Address"
              : "Add New Address"
          }
          open={addressModalOpen}
          onCancel={() => {
            setAddressModalOpen(false);
            setEditingAddress(null);
            addressForm.resetFields();
          }}
          footer={null}
          className="profile-modal"
        >
          <Form
            form={addressForm}
            layout="vertical"
            onFinish={handleSaveAddress}
          >
            <Form.Item
              label="Address Type"
              name="label"
              rules={[
                {
                  required: true,
                  message:
                    "Please select an address type",
                },
              ]}
            >
              <Select>
                <Select.Option value="Home">
                  Home
                </Select.Option>

                <Select.Option value="Work">
                  Work
                </Select.Option>

                <Select.Option value="Other">
                  Other
                </Select.Option>
              </Select>
            </Form.Item>

            <Row gutter={12}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please enter first name",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please enter last name",
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
                    "Please enter phone number",
                },
                {
                  len: 10,
                  message: "Phone number must be exactly 10 digits",
                },
                {
                  pattern: /^\d+$/,
                  message: "Phone number must contain only numbers",
                },
              ]}
            >
              <Input 
                maxLength={10}
                inputMode="numeric"
                placeholder="Enter 10-digit phone number"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  e.target.value = value;}}
              />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[
                {
                  required: true,
                  message:
                    "Please enter your address",
                },
              ]}
            >
              <Input.TextArea
                rows={3}
                placeholder="House/Flat No., Street, Area"
              />
            </Form.Item>

            <Row gutter={12}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="City"
                  name="city"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please enter city",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="State"
                  name="state"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please enter state",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Pincode"
              name="pincode"
              rules={[
                {
                  required: true,
                  message:
                    "Please enter pincode",
                },
                {
                  len: 6,
                  message:
                    "Pincode must be 6 digits",
                },
                {
                  pattern: /^\d+$/,
                  message: "Pincode must contain only numbers",
                },
              ]}
            >
              <Input 
                maxLength={6}
                inputMode="numeric"
                placeholder="Enter pincode"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  e.target.value = value;
                }}
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={addressSaving}
              block
            >
              {editingAddress
                ? "Update Address"
                : "Save Address"}
            </Button>
          </Form>
        </Modal>
      </div>
    </MainLayout>
  );
};

const InfoRow = ({
  label,
  value,
  icon,
}) => {
  return (
    <>
      <Row
        justify="space-between"
        align="middle"
        style={{
          padding: "12px 0",
        }}
      >
        <Col>
          <Text type="secondary">
            {label}
          </Text>
        </Col>

        <Col>
          <Text strong>
            {icon && (
              <span
                style={{
                  marginRight: 6,
                }}
              >
                {icon}
              </span>
            )}

            {value || "-"}
          </Text>
        </Col>
      </Row>

      <Divider
        style={{
          margin: 0,
        }}
      />
    </>
  );
};

export default Profile;