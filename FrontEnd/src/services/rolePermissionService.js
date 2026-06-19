import api from '../api/axios'

export const getAllRole = () => {
    return api.get(`roles/index?models=RolePermissions.Permission&modelFilter=%7B%7D&is_active=true`)
}

export const getAllModule = () => {
    return api.get(`modules?models=Permissions&modelFilter=%7B%7D&is_active=true`)
}

export const createRole = (payload) => {
    return api.post("/roles/create", payload);
};

export const assignPermissionsToRole = (roleId, payload) => {
    return api.post(`/roles/${roleId}/rolespermission`, payload);
};