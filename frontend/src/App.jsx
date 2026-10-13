import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { ItemsProvider } from './context/ItemsContext';

import { DemoSwitcher } from './components/common/DemoSwitcher';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { BrowseItemsPage } from './pages/BrowseItemsPage';
import { ItemDetailPage } from './pages/ItemDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { ClaimsPage } from './pages/ClaimsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { AboutHelpPage } from './pages/AboutHelpPage';

// Modals
import { ReportItemModal } from './components/items/ReportItemModal';
import { ItemDetailModal } from './components/items/ItemDetailModal';
import { ClaimModal } from './components/claims/ClaimModal';
import { ReviewClaimModal } from './components/claims/ReviewClaimModal';

const AppContent = () => {
  // Modal states
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportModalDefaultType, setReportModalDefaultType] = useState('LOST');

  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [selectedClaimItem, setSelectedClaimItem] = useState(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  const [selectedReviewClaim, setSelectedReviewClaim] = useState(null);
  const [isReviewClaimModalOpen, setIsReviewClaimModalOpen] = useState(false);

  const handleOpenReportModal = (type = 'LOST') => {
    setReportModalDefaultType(type);
    setIsReportModalOpen(true);
  };

  const handleViewItemDetails = (item) => {
    setSelectedDetailItem(item);
    setIsDetailModalOpen(true);
  };

  const handleOpenClaim = (item) => {
    setSelectedClaimItem(item);
    setIsClaimModalOpen(true);
  };

  const handleOpenReviewClaim = (claim) => {
    setSelectedReviewClaim(claim);
    setIsReviewClaimModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Top Demo Banner */}
      <DemoSwitcher />

      {/* Main Navbar */}
      <Navbar onOpenReportModal={() => handleOpenReportModal('LOST')} />

      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onOpenReportModal={handleOpenReportModal}
                onViewItemDetails={handleViewItemDetails}
                onOpenClaim={handleOpenClaim}
              />
            }
          />
          <Route
            path="/items"
            element={
              <BrowseItemsPage
                onOpenReportModal={handleOpenReportModal}
                onViewItemDetails={handleViewItemDetails}
                onOpenClaim={handleOpenClaim}
              />
            }
          />
          <Route
            path="/item/:id"
            element={<ItemDetailPage onOpenClaim={handleOpenClaim} />}
          />
          <Route
            path="/dashboard"
            element={
              <DashboardPage
                onOpenReportModal={handleOpenReportModal}
                onViewItemDetails={handleViewItemDetails}
                onOpenReviewClaim={handleOpenReviewClaim}
                onOpenClaim={handleOpenClaim}
              />
            }
          />
          <Route
            path="/claims"
            element={
              <ClaimsPage
                onOpenReviewClaim={handleOpenReviewClaim}
                onViewItemDetails={handleViewItemDetails}
              />
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/help" element={<AboutHelpPage />} />
        </Routes>
      </main>

      {/* Global Modals */}
      <ReportItemModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        defaultType={reportModalDefaultType}
      />

      <ItemDetailModal
        item={selectedDetailItem}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onOpenClaim={handleOpenClaim}
      />

      <ClaimModal
        item={selectedClaimItem}
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
      />

      <ReviewClaimModal
        claim={selectedReviewClaim}
        isOpen={isReviewClaimModalOpen}
        onClose={() => setIsReviewClaimModalOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ItemsProvider>
          <AppContent />
        </ItemsProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
