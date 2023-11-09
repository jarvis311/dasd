import { API } from "../App";


// Affiliation Dashboard

export const getAffiliationDashboardDropdown = async (id, e, name) => {
    try {
        const result = await API.get("/affilation_dashboard")
        return result
    } catch (error) {
        console.log(error)
    }

};
export const getAffiliationDashboardData = async (payload) => {
    try {
        const Form = new FormData();
        const result = await API.post("/affilation_dashboard_data", payload)
        return result
    } catch (error) {
        console.log(error)
    }

};
export const affilationDashboardStatusUpdate = async (status, id) => {
    let statusCode;
    status ? statusCode = 1 : statusCode = 0
    try {
        const Form = new FormData();
        Form.append("id", id)
        Form.append("status", statusCode)
        const result = await API.post("/affilation_dashboard_update_status", Form)
        return result
    } catch (error) {
        console.log(error)
    }

};

// Affiliation Program

export const getAffiliatiPlace = async () => {
    try {
        const result = await API.get("/affilation")
        return result
    } catch (error) {
        console.log(error)
    }

};
export const getAffiliationProgramData = async (payload) => {
    try {
        const result = await API.post("/pagination_affiliate", payload)
        return result
    } catch (error) {
        console.log(error)
    }

};
export const affilationProgramView = async (id) => {
    try {
        const result = await API.post('/affilation_data_show', id)
        return result
    } catch (error) {
        console.log(error)
    }

};
export const updatePositionAffilation = async (id,GroupId) => {
    try {
        const Formdata= new FormData()
        Formdata.append('position_data',JSON.stringify(id));
        Formdata.append('group_id',GroupId);
        const result = await API.post('/update_position_affilation', Formdata)
        return result
    } catch (error) {
        console.log(error)
    }

};
export const affilationProgramStatusUpdate = async (status, id, key) => {
    let statusCode;
    status ? statusCode = 1 : statusCode = 0
    try {
        const Form = new FormData();
        Form.append("id", id)
        Form.append("status", statusCode)
        Form.append("key_name", key)
        const result = await API.post("/update_app_status", Form)
        return result
    } catch (error) {
        console.log(error)
    }

};
export const deleteAffilationProgramPlace = async (params) => {
    try {
        const result = await API.delete(`/delete_affilation${params}`)
        return result
    } catch (error) {
        console.log(error)
    }

};

// offer 
export const getAffilationOffer = async () => {
    try {
        const result = await API.get('/offer_data')
        return result
    } catch (error) {
        console.log(error)
    }

};
export const addAffilationOffer = async (payload) => {
    try {
        const result = await API.post('/add_offer',payload)
        return result
    } catch (error) {
        console.log(error)
    }

};

// Add Affilation data
export const getDynamicDropdown = async () => {
    try {
        const result = await API.get('/dynamic_dropdown')
        return result
    } catch (error) {
        console.log(error)
    }

};
export const editDynamicDropdown = async (payload) => {
    try {
        const result = await API.post('/edit_dynamic_dropdown',payload)
        return result
    } catch (error) {
        console.log(error)
    }

};

// Add New Affilation 
export const getAffilationDropdown = async () => {
    try {
        const result = await API.get('/get_affilation_dropdown')
        return result
    } catch (error) {
        console.log(error)
    }

};
export const getAffilationData = async (payload) => {
    try {
        const result = await API.post('/get_affilation_data',payload)
        return result
    } catch (error) {
        console.log(error)
    }

};