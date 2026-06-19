import React, { useEffect, useState } from "react";
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormInput,
  CFormTextarea,
  CBadge,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormSwitch,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import { toast } from 'react-toastify'

import {
  getAllRole,
  getAllModule,
  createRole,
  assignPermissionsToRole
} from "../../services/rolePermissionService";

import {
  getEmployees,
  getEmployeesRoles,
  assignRoleToEmployee,
  deleteRoleToEmployee
} from "../../services/employeeService";

const Permission = () => {
  const [activeTab, setActiveTab] = useState('users')
  const [visible, setVisible] = useState(false)

  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedRoles, setSelectedRoles] = useState([])

  const [roles, setRoles] = useState([]);

  const [showAddRole, setShowAddRole] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')
  const [newRoleCode, setNewRoleCode] = useState('')
  const [newRoleLevel, setNewRoleLevel] = useState('')
  const [newRoleDesc, setNewRoleDesc] = useState('')
  const [loadingRole, setLoadingRole] = useState(false)

  const [users, setUsers] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [modules, setModules] = useState([])

  const [selectedRoleId, setSelectedRoleId] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [searchTerm, setSearchTerm] = useState('');
  const [roleSearch, setRoleSearch] = useState('');

  const formatUsers = (apiData) => {
    return apiData.map((user) => ({
      id: user.id,
      name: user.first_name,
      employee_code: user.employee_code,
      email: user.email,
      roles: user.EmployeeRoles?.map((r) => ({
        id: r.RoleMaster?.id,
        name: r.RoleMaster?.role_name
      })) || [],
    }));
  };

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();

    return (
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.employee_code?.toLowerCase().includes(term)
    );
  });

  const filteredRoles = roles.filter((role) => {
    const term = roleSearch.toLowerCase();

    return (
      role.role_name?.toLowerCase().includes(term) ||
      role.role_code?.toLowerCase().includes(term)
    );
  });

  // 🔥 LOAD INITIAL DATA
  useEffect(() => {
    fetchRoles();
    fetchModules();
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchAllUsers();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await getAllRole();
      setRoles(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchUsers = async () => {
    try {
      const res = await getEmployeesRoles();
      const formattedUsers = formatUsers(res.data.data);
      setUsers(formattedUsers || []);
    } catch (err) {
      console.error(err);
    }
  }
  const fetchAllUsers = async () => {
    try {
      const res = await getEmployees();
      const formattedUsers = formatUsers(res.data.data);
      setAllUsers(formattedUsers || []);
    } catch (err) {
      console.error(err);
    }
  }
  const fetchModules = async () => {
    try {
      const res = await getAllModule();
      setModules(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  const getRoleUserCount = (roleId) => {
    return users.filter((user) =>
      user.roles.some((role) => role.id === roleId)
    ).length;
  };

  const handleSaveRole = async () => {
    try {
      if (!selectedUserId || selectedRoles.length === 0) return

      const payload = {
        roles: selectedRoles.map((r) => r.id)
      };

      // 🔥 API CALL
      await assignRoleToEmployee(selectedUserId, payload);

      // ✅ Refresh users from backend (BEST PRACTICE)
      await fetchUsers();
      await fetchAllUsers();

      // ✅ Reset UI
      setVisible(false);
      setSelectedUserId('');
      setSelectedRoles([]);

    } catch (error) {
      console.error("Error assigning roles:", error);
    }
  }

  const handleEditUser = (user) => {
    setSelectedUserId(user.id);
    setSelectedRoles(user.roles); // already formatted
    setVisible(true); // open modal
  };

  const handleDeleteUserRole = async (user) => {
    if (!window.confirm("Remove all roles from this user?")) return;

    try {
      await deleteRoleToEmployee(user.id);

      toast.success("Roles removed successfully");

      await fetchUsers();
      await fetchAllUsers();

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to remove roles"
      );
    }
  };

  const handleAddRole = async () => {
    try {
      if (!newRoleName.trim() || !newRoleCode.trim() || !newRoleLevel.trim()) return;

      setLoadingRole(true);

      const payload = {
        role_name: newRoleName,
        role_code: newRoleCode,
        role_level: Number(newRoleLevel),
        description: newRoleDesc,
      };

      const res = await createRole(payload);

      const createdRole = res.data.data;

      // ✅ Update UI instantly
      setRoles((prev) => [...prev, createdRole]);

      // ✅ Reset form
      setNewRoleName('');
      setNewRoleCode('');
      setNewRoleLevel('');
      setNewRoleDesc('');
      setShowAddRole(false);

    } catch (error) {
      console.error("Error creating role:", error);
      toast.error(
        error.response?.data?.message || "Failed to create role"
      );
    } finally {
      setLoadingRole(false);
    }
  };

  // ✅ HANDLE ROLE CHANGE
  const handleRoleChange = (roleId) => {
    setSelectedRoleId(roleId)

    const role = roles.find(r => String(r.id) === String(roleId))

    if (role) {
      const permissionIds = role.RolePermissions.map(
        rp => rp.Permission.id
      )
      setSelectedPermissions(permissionIds)
    } else {
      setSelectedPermissions([])
    }
  }

  // ✅ TOGGLE SINGLE PERMISSION
  const togglePermission = (permId) => {
    if (selectedPermissions.includes(permId)) {
      setSelectedPermissions(selectedPermissions.filter(id => id !== permId))
    } else {
      setSelectedPermissions([...selectedPermissions, permId])
    }
  }

  // ✅ TOGGLE MODULE (SELECT ALL)
  const toggleModulePermissions = (module) => {
    const modulePermIds = module.Permissions.map(p => p.id)

    const allSelected = modulePermIds.every(id =>
      selectedPermissions.includes(id)
    )

    if (allSelected) {
      setSelectedPermissions(
        selectedPermissions.filter(id => !modulePermIds.includes(id))
      )
    } else {
      const newIds = modulePermIds.filter(id => !selectedPermissions.includes(id))
      setSelectedPermissions([...selectedPermissions, ...newIds])
    }
  }

  // ✅ SAVE
  const handleSave = async () => {
    try {
      if (!selectedRoleId) {
        toast.error("Please select a role");
        return;
      }

      const payload = {
        permissions: selectedPermissions,
      };

      await assignPermissionsToRole(selectedRoleId, payload);

      await fetchRoles();

      toast.success("Permissions updated successfully!");

    } catch (error) {
      console.error(error);

      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error?.errors?.[0]?.message ||
        "Failed to update permissions";

      toast.error(errorMsg);
    }
  }

  return (
    <CContainer fluid className="py-3">
      <CRow className="g-4">

        {/* SIDEBAR */}
        <CCol xs={12} md={4} lg={3}>
          <CCard className="h-100 shadow-sm">
            <CCardBody>

              <div className="d-flex mb-3">
                <CButton
                  color={activeTab === 'users' ? 'primary' : 'light'}
                  className="w-50 me-2"
                  onClick={() => setActiveTab('users')}
                >
                  User Role
                </CButton>

                <CButton
                  color={activeTab === 'roles' ? 'primary' : 'light'}
                  className="w-50"
                  onClick={() => setActiveTab('roles')}
                >
                  Role Permissions
                </CButton>
              </div>

              {/* USER TAB SIDEBAR */}
              {activeTab === 'users' && (
                <>
                  <CFormInput
                    placeholder="Search User"
                    className="mb-3"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <CButton
                    size="sm"
                    color="outline-primary"
                    className="w-100"
                    onClick={() => setVisible(true)}
                  >
                    + Set Role
                  </CButton>
                </>
              )}

              {/* ROLE TAB SIDEBAR */}
              {activeTab === 'roles' && (
                <>
                  <CFormInput
                    placeholder="Search Role"
                    className="mb-3"
                    value={roleSearch}
                    onChange={(e) => setRoleSearch(e.target.value)}
                  />

                  {filteredRoles.map((role) => {
                    const isActive = selectedRoleId === role.id
                    const userCount = getRoleUserCount(role.id)

                    return (
                      <div
                        key={role.id}
                        onClick={() => handleRoleChange(role.id)}
                        style={{
                          cursor: 'pointer',
                          borderRadius: '6px',
                          padding: '10px 14px',
                          marginBottom: '6px',
                          backgroundColor: isActive ? '#5856d6' : '#ffffff',
                          color: isActive ? '#ffffff' : '#212529',
                          border: isActive
                            ? '1px solid #3c78d8'
                            : '1px solid #e9ecef',
                        }}
                      >
                        <div style={{ fontWeight: 400 }}>
                          {role.role_name}
                        </div>

                        <div
                          style={{
                            fontSize: '13px',
                            opacity: isActive ? 0.9 : 0.6,
                          }}
                        >
                          {userCount} {userCount === 1 ? 'user' : 'users'}
                        </div>
                      </div>
                    )
                  })}
                  <CButton
                    size="sm"
                    color="outline-primary"
                    className="w-100"
                    onClick={() => setShowAddRole(true)}
                  >
                    + Add Role
                  </CButton>
                </>
              )}

            </CCardBody>
          </CCard>
        </CCol>

        {/* MAIN CONTENT */}
        <CCol xs={12} md={8} lg={9}>

          {/* USER TAB TABLE */}
          {activeTab === 'users' && (
            <CCard className="shadow-sm">
              <CCardHeader>
                <strong>User Role</strong>
              </CCardHeader>
              <CCardBody>
                <CTable hover responsive align="middle">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Name</CTableHeaderCell>
                      <CTableHeaderCell>Emp Code</CTableHeaderCell>
                      <CTableHeaderCell>Email</CTableHeaderCell>
                      <CTableHeaderCell>Roles</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredUsers.map((user) => (
                      <CTableRow key={user.id}>
                        <CTableDataCell>{user.name}</CTableDataCell>
                        <CTableDataCell>{user.employee_code}</CTableDataCell>
                        <CTableDataCell>{user.email}</CTableDataCell>
                        <CTableDataCell>
                          {user.roles.map((r) => (
                            <CBadge key={r.id} color="primary" className="me-1">
                              {r.name}
                            </CBadge>
                          ))}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            color="light"
                            className="me-2"
                            onClick={() => handleEditUser(user)}
                          >
                            <CIcon icon={cilPencil} />
                          </CButton>
                          <CButton
                            size="sm"
                            color="light"
                            onClick={() => handleDeleteUserRole(user)}
                          >
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          )}

          {/* ROLE PERMISSION TAB */}
          {activeTab === 'roles' && (
            <CRow className="g-4">
              <div className="mb-3">

                {modules.map((module) => (
                  <div
                    key={module.id}
                    className="mb-3 border p-3 rounded"
                  >

                    {/* MODULE HEADER */}
                    <div className="d-flex justify-content-between align-items-center">
                      <strong>{module.module_name}</strong>

                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          onChange={() => toggleModulePermissions(module)}
                          checked={module.Permissions.every(p =>
                            selectedPermissions.includes(p.id)
                          )}
                        />
                        <label className="form-check-label">
                          Select All
                        </label>
                      </div>
                    </div>

                    {/* PERMISSIONS */}
                    <div className="mt-2">
                      {module.Permissions.map((perm) => (
                        <div
                          key={perm.id}
                          className="form-check form-check-inline"
                        >
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={`perm-${perm.id}`}
                            checked={selectedPermissions.includes(perm.id)}
                            onChange={() => togglePermission(perm.id)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`perm-${perm.id}`}
                          >
                            {perm.action}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {/* SAVE BUTTON */}
              <CButton
                color="primary"
                onClick={handleSave}
                disabled={!selectedRoleId || selectedPermissions.length === 0}
              >
                Save Permissions
              </CButton>

            </CRow>
          )}

        </CCol>
      </CRow>

      {/* MODAL */}
      <CModal visible={visible} onClose={() => setVisible(false)} alignment="center">
        <CModalHeader>
          <CModalTitle>Set User Role</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <CFormSelect
              value={selectedUserId}
              onChange={(e) => {
                const userId = e.target.value
                setSelectedUserId(userId)

                const foundUser = allUsers.find(u => String(u.id) === String(userId))
                setSelectedRoles(foundUser ? foundUser.roles : [])
              }}
            >
              <option value="">Select User</option>
              {allUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </CFormSelect>
          </div>

          <div className="mb-3">
            <label className="form-label">Roles</label>
            {roles.map((role, index) => (
              <div key={index} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`role-${index}`}
                  checked={selectedRoles.some((r) => r.id === role.id)}
                  onChange={() => {
                    if (selectedRoles.some((r) => r.id === role.id)) {
                      setSelectedRoles(selectedRoles.filter((r) => r.id !== role.id))
                    } else {
                      setSelectedRoles([...selectedRoles, role])
                    }
                  }}
                />
                <label className="form-check-label" htmlFor={`role-${index}`}>
                  {role.role_name}
                </label>
              </div>
            ))}
          </div>
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cancel
          </CButton>
          <CButton
            color="primary"
            onClick={handleSaveRole}
            disabled={!selectedUserId || selectedRoles.length === 0}
          >
            Save
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={showAddRole} onClose={() => setShowAddRole(false)} alignment="center">
        <CModalHeader>
          <CModalTitle>Add New Role</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <CFormInput
              className="mt-2"
              label="Role Name"
              placeholder="Enter role name"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <CFormInput
              className="mt-2"
              label="Role Code"
              placeholder="Enter role code"
              value={newRoleCode}
              onChange={(e) => setNewRoleCode(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <CFormInput
              className="mt-2"
              label="Role Level"
              type="number"
              placeholder="Enter role level"
              value={newRoleLevel}
              onChange={(e) => setNewRoleLevel(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <CFormTextarea
              className="mt-2"
              label="Description"
              rows={3}
              value={newRoleDesc}
              onChange={(e) => setNewRoleDesc(e.target.value)}
            />
          </div>
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddRole(false)}>
            Cancel
          </CButton>
          <CButton
            color="primary"
            onClick={handleAddRole}
            disabled={loadingRole}
          >
            {loadingRole ? "Saving..." : "Save Role"}
          </CButton>
        </CModalFooter>
      </CModal>

    </CContainer>
  )
}

export default Permission