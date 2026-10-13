import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { CATEGORIES } from '../../data/categories';
import { CAMPUS_LOCATIONS } from '../../data/locations';
import { useItems } from '../../context/ItemsContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Upload,
  Image as ImageIcon,
  AlertCircle,
  HelpCircle,
  Sparkles,
  MapPin,
  Calendar,
  Tag,
  ShieldCheck,
  X
} from 'lucide-react';

export const ReportItemModal = ({ isOpen, onClose, defaultType = 'LOST' }) => {
  const { addItem } = useItems();
  const { currentUser } = useAuth();
  const { error } = useToast();

  const [reportType, setReportType] = useState(defaultType); // 'LOST' or 'FOUND'
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [secretVerificationHint, setSecretVerificationHint] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Reset state when type changes or opened
  const handleTypeChange = (type) => {
    setReportType(type);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        error('Image size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const errors = {};
    if (!title.trim() || title.trim().length < 3) {
      errors.title = 'Please enter a descriptive item name (at least 3 characters).';
    }
    if (!category) {
      errors.category = 'Please choose an item category.';
    }
    if (!description.trim() || description.trim().length < 10) {
      errors.description = 'Please provide detailed characteristics (at least 10 characters).';
    }
    if (!location && !customLocation.trim()) {
      errors.location = 'Please indicate where the item was lost or found.';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 600)); // Smooth submission UX
      addItem({
        title,
        category,
        reportType,
        location: customLocation.trim() || location,
        incidentDate,
        description,
        secretVerificationHint,
        imagePath: imagePreview || null
      });

      // Reset
      setTitle('');
      setDescription('');
      setSecretVerificationHint('');
      setImagePreview('');
      setValidationErrors({});
      onClose();
    } catch (err) {
      error(err.message || 'Failed to submit report. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={reportType === 'LOST' ? 'Report a Lost Item' : 'Report a Found Item'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type Toggle Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => handleTypeChange('LOST')}
            className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all ${
              reportType === 'LOST'
                ? 'bg-rose-600 text-white shadow-soft'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            I Lost Something
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('FOUND')}
            className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all ${
              reportType === 'FOUND'
                ? 'bg-emerald-600 text-white shadow-soft'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            I Found Something
          </button>
        </div>

        {/* Title input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Item Title / Model <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder={
              reportType === 'LOST'
                ? 'e.g., Space Grey iPad Air with black magnetic cover'
                : 'e.g., Wireless Earbuds in white charging case'
            }
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition ${
              validationErrors.title
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
          />
          {validationErrors.title && (
            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.title}
            </p>
          )}
        </div>

        {/* Category & Location Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Approx. Incident Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        {/* Location selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Campus Location <span className="text-rose-500">*</span>
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 mb-2"
          >
            {CAMPUS_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Or type specific room / floor / nearby landmark (optional)"
            value={customLocation}
            onChange={(e) => setCustomLocation(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Detailed description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Detailed Description & Distinguishing Marks <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="Color, scratches, stickers, accessories, brand name, exact circumstances..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition ${
              validationErrors.description
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
          />
          {validationErrors.description && (
            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.description}
            </p>
          )}
        </div>

        {/* Secret Verification Prompt (Anti-Scam) */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
          <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            Security Ownership Verification Hint (Recommended)
          </label>
          <p className="text-xs text-slate-500 mb-2">
            Ask a question only the real owner would know (e.g., "What photo is set as the lock screen?" or "What initials are engraved?").
          </p>
          <input
            type="text"
            placeholder="e.g., What sticker is on the back or what color is the key fob?"
            value={secretVerificationHint}
            onChange={(e) => setSecretVerificationHint(e.target.value)}
            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Photo Upload Simulator */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Attach Photo (Optional)
          </label>

          {imagePreview ? (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 max-h-48 bg-slate-100 flex items-center justify-center">
              <img src={imagePreview} alt="Preview" className="max-h-48 object-contain" />
              <button
                type="button"
                onClick={() => setImagePreview('')}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl p-4 cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition">
              <Upload className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-xs font-semibold text-slate-700">
                Click to upload an image from your device
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                PNG, JPG or WEBP up to 5MB (or we'll provide a category icon)
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Form buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className={reportType === 'LOST' ? '!bg-rose-600 hover:!bg-rose-700' : '!bg-emerald-600 hover:!bg-emerald-700'}
          >
            {reportType === 'LOST' ? 'Publish Lost Item Report' : 'Publish Found Item Listing'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
