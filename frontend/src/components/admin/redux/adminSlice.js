// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// // Fetch analytics (number of donations, requests, users)
// export const fetchAnalytics = createAsyncThunk('admin/fetchAnalytics', async () => {
//     const response = await axios.get('http://localhost:5000/api/admin/analytics');
//     return response.data;
// });

// // Fetch active donations (currently being donated)
// export const fetchActiveDonations = createAsyncThunk('admin/fetchActiveDonations', async () => {
//     const response = await axios.get('http://localhost:5000/api/admin/active-donations');
//     return response.data;
// });

// // Fetch donated people (completed donations)
// export const fetchDonatedPeople = createAsyncThunk('admin/fetchDonatedPeople', async () => {
//     const response = await axios.get('http://localhost:5000/api/admin/donated-people');
//     return response.data;
// });

// // Fetch recent requests
// export const fetchRecentRequests = createAsyncThunk('admin/fetchRecentRequests', async () => {
//     const response = await axios.get('http://localhost:5000/api/admin/recent-requests');
//     return response.data;
// });

// // Fetch donors
// export const fetchDonors = createAsyncThunk('admin/fetchDonors', async () => {
//     const response = await axios.get('http://localhost:5000/api/admin/donors');
//     return response.data;
// });

// // Fetch total donated amount
// export const fetchTotalDonated = createAsyncThunk('admin/fetchTotalDonated', async () => {
//     const response = await axios.get('http://localhost:5000/api/admin/total-donated');
//     return response.data;
// });

// // Fetch users
// export const fetchUsers = createAsyncThunk('admin/fetchUsers', async () => {
//     const response = await axios.get('http://localhost:5000/api/admin/users');
//     return response.data;
// });

// // Fetch admins
// export const fetchAdmins = createAsyncThunk('admin/fetchAdmins', async () => {
//     const response = await axios.get('http://localhost:5000/api/admin/admins');
//     return response.data;
// });

// const adminSlice = createSlice({
//     name: 'admin',
//     initialState: {
//         analytics: { totalDonations: 0, totalRequests: 0, totalUsers: 0 },
//         activeDonations: [],
//         donatedPeople: [],
//         recentRequests: [],
//         donors: [],
//         totalDonated: { birr: 0, dollar: 0 },
//         users: [],
//         admins: [],
//         loading: false,
//         error: null,
//     },
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchAnalytics.pending, (state) => { state.loading = true; })
//             .addCase(fetchAnalytics.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.analytics = action.payload;
//             })
//             .addCase(fetchActiveDonations.fulfilled, (state, action) => {
//                 state.activeDonations = action.payload;
//             })
//             .addCase(fetchDonatedPeople.fulfilled, (state, action) => {
//                 state.donatedPeople = action.payload;
//             })
//             .addCase(fetchRecentRequests.fulfilled, (state, action) => {
//                 state.recentRequests = action.payload;
//             })
//             .addCase(fetchDonors.fulfilled, (state, action) => {
//                 state.donors = action.payload;
//             })
//             .addCase(fetchTotalDonated.fulfilled, (state, action) => {
//                 state.totalDonated = action.payload;
//             })
//             .addCase(fetchUsers.fulfilled, (state, action) => {
//                 state.users = action.payload;
//             })
//             .addCase(fetchAdmins.fulfilled, (state, action) => {
//                 state.admins = action.payload;
//             });
//     },
// });

// export default adminSlice.reducer;