const API_URL = 'http://localhost:5001/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
};

export const fetchLeads = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/leads?${query}`, { headers: getHeaders() });
    return response.json();
};

export const createLead = async (leadData) => {
    const response = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(leadData),
    });
    return response.json();
};

export const convertLead = async (id) => {
    const response = await fetch(`${API_URL}/leads/${id}/convert`, {
        method: 'POST',
        headers: getHeaders()
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to convert lead');
    }
    return response.json();
};

export const fetchOpportunities = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/opportunities?${query}`, { headers: getHeaders() });
    return response.json();
};

export const fetchOpportunity = async (id) => {
    const response = await fetch(`${API_URL}/opportunities/${id}`, { headers: getHeaders() });
    return response.json();
};

export const fetchStats = async () => {
    const response = await fetch(`${API_URL}/stats`, { headers: getHeaders() });
    return response.json();
};

export const updateOpportunity = async (id, updates) => {
    const response = await fetch(`${API_URL}/opportunities/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(updates)
    });
    return response.json();
};

export const fetchNotes = async (parentId) => {
    const response = await fetch(`${API_URL}/notes?parentId=${parentId}`, { headers: getHeaders() });
    return response.json();
};

export const createNote = async (note) => {
    const response = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(note)
    });
    return response.json();
};

export const fetchContactRoles = async (opportunityId) => {
    const response = await fetch(`${API_URL}/contact-roles?opportunityId=${opportunityId}`, { headers: getHeaders() });
    return response.json();
};

export const fetchOpportunityProducts = async (opportunityId) => {
    const response = await fetch(`${API_URL}/opportunity-products?opportunityId=${opportunityId}`, { headers: getHeaders() });
    return response.json();
};

export const fetchQuotes = async () => {
    const response = await fetch(`${API_URL}/quotes`, { headers: getHeaders() });
    return response.json();
};

export const fetchTasks = async () => {
    const response = await fetch(`${API_URL}/tasks`, { headers: getHeaders() });
    return response.json();
};

export const createTask = async (task) => {
    const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(task)
    });
    return response.json();
};

export const fetchProducts = async () => {
    const response = await fetch(`${API_URL}/products`, { headers: getHeaders() });
    return response.json();
};

export const fetchActivities = async (parentId) => {
    // If no parentId, fetch all or handle as needed
    const url = parentId ? `${API_URL}/activities?parentId=${parentId}` : `${API_URL}/activities`;
    const response = await fetch(url, { headers: getHeaders() });
    return response.json();
};

export const fetchRevenueByIndustry = async () => {
    const response = await fetch(`${API_URL}/reports/revenue-by-industry`, { headers: getHeaders() });
    return response.json();
};

export const fetchLeadsBySource = async () => {
    const response = await fetch(`${API_URL}/reports/leads-by-source`, { headers: getHeaders() });
    return response.json();
};

export const fetchCases = async () => {
    const response = await fetch(`${API_URL}/cases`, { headers: getHeaders() });
    return response.json();
};

export const createCase = async (caseData) => {
    const response = await fetch(`${API_URL}/cases`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(caseData),
    });
    return response.json();
};

export const updateCase = async (id, updates) => {
    const response = await fetch(`${API_URL}/cases/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(updates),
    });
    return response.json();
};

export const deleteCase = async (id) => {
    await fetch(`${API_URL}/cases/${id}`, { method: 'DELETE', headers: getHeaders() });
};

export const fetchFeed = async (recordId) => {
    const response = await fetch(`${API_URL}/feed/${recordId}`, { headers: getHeaders() });
    return response.json();
};

export const createPost = async (postData) => {
    const response = await fetch(`${API_URL}/feed`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(postData),
    });
    return response.json();
};

export const deletePost = async (id) => {
    await fetch(`${API_URL}/feed/${id}`, { method: 'DELETE', headers: getHeaders() });
};

export const fetchProfile = async () => {
    const response = await fetch(`${API_URL}/users/me`, { headers: getHeaders() });
    return response.json();
};

export const updateProfile = async (data) => {
    const response = await fetch(`${API_URL}/users/me`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    return response.json();
};

export const fetchUsers = async () => {
    const response = await fetch(`${API_URL}/users`, { headers: getHeaders() });
    return response.json();
};

export const fetchArticles = async () => {
    const response = await fetch(`${API_URL}/articles`, { headers: getHeaders() });
    return response.json();
};

export const createArticle = async (articleData) => {
    const response = await fetch(`${API_URL}/articles`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(articleData),
    });
    return response.json();
};

export const fetchAuditLogs = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/audit?${query}`, { headers: getHeaders() });
    return response.json();
};

export const deleteLead = async (id) => {
    await fetch(`${API_URL}/leads/${id}`, { method: 'DELETE', headers: getHeaders() });
};

export const deleteOpportunity = async (id) => {
    await fetch(`${API_URL}/opportunities/${id}`, { method: 'DELETE', headers: getHeaders() });
};

export const fetchRecycleBin = async () => {
    const response = await fetch(`${API_URL}/recycle-bin`, { headers: getHeaders() });
    return response.json();
};

export const restoreRecord = async (id, type) => {
    const response = await fetch(`${API_URL}/recycle-bin/restore`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ id, type })
    });
    return response.json();
};

export const permanentDelete = async (id, type) => {
    const response = await fetch(`${API_URL}/recycle-bin/delete-permanent`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ id, type })
    });
    return response.json();
};

export const fetchAccounts = async () => {
    const response = await fetch(`${API_URL}/accounts`, { headers: getHeaders() });
    return response.json();
};

export const fetchAccount = async (id) => {
    const response = await fetch(`${API_URL}/accounts/${id}`, { headers: getHeaders() });
    return response.json();
};

export const createAccount = async (account) => {
    const response = await fetch(`${API_URL}/accounts`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(account)
    });
    return response.json();
};

export const updateAccount = async (id, data) => {
    const response = await fetch(`${API_URL}/accounts/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    return response.json();
};

export const deleteAccount = async (id) => {
    await fetch(`${API_URL}/accounts/${id}`, { method: 'DELETE', headers: getHeaders() });
};


