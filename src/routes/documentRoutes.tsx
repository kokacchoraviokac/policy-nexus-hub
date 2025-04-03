
import React from 'react';
import { Route } from 'react-router-dom';
import DocumentManagement from '@/pages/DocumentManagement';

export const documentRoutes = (
  <Route path="/documents" element={<DocumentManagement />} />
);
