import { Children } from "react";

import {
    CreateList,
    Dashboard,
    EditList,
    ViewList,
    OverviewList
} from "../pages/Vocabulary";


const vocabularyRoutes = [
  {
    path: "/vocabulary/create/:listId",
    element: <CreateList />
  },
  {
    path: "/vocabulary/create/new",
    element: <CreateList />
  },
  {
    path: "/vocabulary",
    element: <Dashboard />
  },
  {
    path: "/vocabulary/edit/:listId",
    element: <EditList />
  },
  {
    path: "/vocabulary/view/:listId",
    element: <ViewList />
  },
  {
    path: "/vocabulary/overview/:listId",
    element: <OverviewList />
  }
];

export default vocabularyRoutes;