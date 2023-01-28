import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface collab {
  collabName: string;
  LeadName: string;
  Description: string;
  GitHub: string;
  AdminWallet: string;
  ContributionPower: number;
}

const initialState: collab = {
  collabName: "",
  LeadName: "",
  Description: "",
  GitHub: "",
  AdminWallet: "",
  ContributionPower: 0,
};

export const CollabInfo = createSlice({
  name: "collab",
  initialState,
  reducers: {
    addCollabName: (state: collab, action) => {
      state.collabName = action.payload;
    },
    addLeadName: (state: collab, action) => {
      state.LeadName = action.payload;
    },
    addDescription: (state: collab, action) => {
      state.Description = action.payload;
    },
    addGitHub: (state: collab, action) => {
      state.GitHub = action.payload;
    },
    addAdminWallet: (state: collab, action) => {
      state.AdminWallet = action.payload;
    },
    addContributionPower: (state: collab, action) => {
      state.ContributionPower = action.payload;
    },
  },
});

export const {
  addAdminWallet,
  addCollabName,
  addDescription,
  addGitHub,
  addLeadName,
  addContributionPower,
} = CollabInfo.actions;

export default CollabInfo.reducer;
