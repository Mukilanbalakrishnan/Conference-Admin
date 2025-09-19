import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

// Styled Select Component
const StyledSelect = ({ children, value, onChange }) => (
  <div className="relative w-full">
    <select
      value={value}
      onChange={onChange}
      className="w-full appearance-none p-3 border rounded-lg bg-white 
                 text-gray-700 focus:ring-2 focus:ring-primary focus:border-primary 
                 transition shadow-sm"
    >
      {children}
    </select>
    <ChevronDown
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
    />
  </div>
);

export const Registration = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    location: "",
    email: "",
    work: "",
    pgLocation: "",
    documentType: "",
    document: null,
    photo: null,
    plan: "",
    fromDate: "",
    toDate: "",
  });
  const [errors, setErrors] = useState({});

  // Terms Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Validations
  const validateStep1 = () => {
    let newErrors = {};
    if (formData.name.length <= 2) newErrors.name = "Name must be more than 2 characters";
    if (!formData.age || Number(formData.age) <= 15) newErrors.age = "Age must be greater than 15";
    if (!formData.gender) newErrors.gender = "Please select gender";
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Phone must be 10 digits";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Enter valid email";
    if (!formData.location || formData.location.length < 3) newErrors.location = "Address must be at least 3 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    let newErrors = {};
    if (!formData.pgLocation) newErrors.pgLocation = "Select PG location";
    if (!formData.work) newErrors.work = "Select work type";
    if (!formData.documentType) newErrors.documentType = "Select document type";
    if (!formData.document) newErrors.document = "Upload document";
    if (!formData.photo) newErrors.photo = "Upload photo";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    let newErrors = {};
    if (!formData.plan) newErrors.plan = "Select plan";
    if (formData.plan === "short") {
      if (!formData.fromDate) newErrors.fromDate = "Select from date";
      if (!formData.toDate) newErrors.toDate = "Select to date";
    }
    if (!agreed) newErrors.terms = "You must agree to Terms & Conditions";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleRegister = async () => {
    if (!validateStep3()) return;

    setLoading(true);
    try {
      // simulate backend call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Registration Successful!");
    } catch (error) {
      console.error(error);
      toast.error("Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/react-toastify@10.0.5/dist/ReactToastify.min.css" />
      <ToastContainer position="top-right" /> 

      <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT FORM */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-primary">Registration Form</h2>

          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {["Personal", "ID", "Plan"].map((label, index) => {
              const current = index + 1;
              return (
                <div key={label} className="flex-1 text-center">
                  <span
                    className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 text-white font-bold 
                      ${step >= current ? "bg-primary" : "bg-gray-300"}`}
                  >
                    {current}
                  </span>
                  <p className={`${step === current ? "text-primary font-semibold" : "text-gray-500"}`}>
                    {label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-3">
              <input type="text" placeholder="Enter your name"
                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary" />
              {errors.name && <p className="text-primary text-sm">{errors.name}</p>}

              <input type="number" placeholder="Enter your age"
                value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary" />
              {errors.age && <p className="text-primary text-sm">{errors.age}</p>}

              <input type="text" placeholder="Enter your address"
                value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary" />
              {errors.location && <p className="text-primary text-sm">{errors.location}</p>}

              <StyledSelect value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                <option value="">Choose Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </StyledSelect>
              {errors.gender && <p className="text-primary text-sm">{errors.gender}</p>}

              <input type="text" placeholder="Enter your phone"
                value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary" />
              {errors.phone && <p className="text-primary text-sm">{errors.phone}</p>}

              <input type="email" placeholder="Enter your email"
                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary" />
              {errors.email && <p className="text-primary text-sm">{errors.email}</p>}

              <button onClick={handleNext}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary transition">
                Next
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-3">
              <StyledSelect
                value={formData.pgLocation}
                onChange={(e) =>
                  setFormData({ ...formData, pgLocation: e.target.value })
                }
              >
                <option value="">Select PG Location</option>
                <option>Hyderabad</option>
                <option>Bangalore</option>
                <option>Delhi</option>
              </StyledSelect>
              {errors.pgLocation && (
                <p className="text-primary text-sm">{errors.pgLocation}</p>
              )}

              <StyledSelect
                value={formData.work}
                onChange={(e) => setFormData({ ...formData, work: e.target.value })}
              >
                <option value="">Select Work</option>
                <option>IT</option>
                <option>Banking</option>
                <option>Marketing</option>
                <option>Other</option>
              </StyledSelect>
              {errors.work && <p className="text-primary text-sm">{errors.work}</p>}

              {/* Document + Profile Upload */}
              <div className="grid grid-cols-2 gap-4">
                {/* Dropdown for document type */}
                <div className="col-span-2">
                  <select
                    value={formData.documentType || ""}
                    onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                    className="w-full p-3 border rounded-lg bg-white"
                  >
                    <option value="">Select Document Type</option>
                    <option value="aadhar">Aadhar Card</option>
                    <option value="pan">PAN Card</option>
                  </select>
                  {errors.documentType && (
                    <p className="text-primary text-sm mt-1">{errors.documentType}</p>
                  )}
                </div>

                {/* Document Upload */}
                <div>
                  <label className="block text-sm font-medium mb-1">Upload Document</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && file.size > 5 * 1024 * 1024) {
                        toast.error("Document image size cannot exceed 5MB.");
                        setFormData({ ...formData, document: null });
                        e.target.value = null;
                      } else {
                        setFormData({ ...formData, document: file });
                      }
                    }}
                    className="w-full p-3 border rounded-lg bg-white"
                  />
                  {errors.document && (
                    <p className="text-primary text-sm mt-1">{errors.document}</p>
                  )}
                </div>

                {/* Profile Upload */}
                <div>
                  <label className="block text-sm font-medium mb-1">Upload Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && file.size > 5 * 1024 * 1024) {
                        toast.error("Profile image size cannot exceed 5MB.");
                        setFormData({ ...formData, photo: null });
                        e.target.value = null;
                      } else {
                        setFormData({ ...formData, photo: file });
                      }
                    }}
                    className="w-full p-3 border rounded-lg bg-white"
                  />
                  {errors.photo && (
                    <p className="text-primary text-sm mt-1">{errors.photo}</p>
                  )}
                </div>

                {/* Document Preview */}
                <div>
                  <div className="w-24 h-24 mx-auto rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden mt-2">
                    {formData.document ? (
                      <img
                        src={URL.createObjectURL(formData.document)}
                        alt="Document Preview"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-xs text-gray-400 text-center px-2">
                        {formData.documentType
                          ? `${formData.documentType} Preview`
                          : "Document Preview"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Profile Preview */}
                <div>
                  <div className="w-24 h-24 mx-auto rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden mt-2">
                    {formData.photo ? (
                      <img
                        src={URL.createObjectURL(formData.photo)}
                        alt="Profile Preview"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-xs text-gray-400 text-center px-2">
                        Profile Image<br />Preview
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary transition"
              >
                Next
              </button>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-3">
              {/* Short Term Option */}
              <label className="block p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="plan"
                  value="short"
                  checked={formData.plan === "short"}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                  className="mr-2"
                />
                Short Term Accommodation
              </label>

              {/* If Short Term is selected → Show Date Pickers */}
              {formData.plan === "short" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">From Date</label>
                    <input
                      type="date"
                      value={formData.fromDate || ""}
                      onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                    />
                    {errors.fromDate && (
                      <p className="text-primary text-sm">{errors.fromDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">To Date</label>
                    <input
                      type="date"
                      value={formData.toDate || ""}
                      onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                    />
                    {errors.toDate && (
                      <p className="text-primary text-sm">{errors.toDate}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Long Term Option */}
              <label className="block p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="plan"
                  value="long"
                  checked={formData.plan === "long"}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                  className="mr-2"
                />
                Long Term Accommodation
              </label>

              {errors.plan && <p className="text-primary text-sm">{errors.plan}</p>}

              {/* Terms Checkbox */}
              <div className="mt-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={() => setIsModalOpen(true)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the Terms & Conditions
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-primary text-sm">{errors.terms}</p>
                )}
              </div>

              <button
                onClick={handleRegister}
                disabled={loading || !agreed}
                className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 disabled:bg-gray-400"
              >
                {loading ? "Submitting..." : "Register"}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden md:block">
          <img
            alt="Modern PG Room"
            className="rounded-2xl shadow-lg h-full object-cover w-full"
          />
        </div>
      </div>

      {/* Terms & Conditions Modal */}
      {/* Terms & Conditions Modal */}
{isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-200/50 z-50">
    <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
      <h2 className="text-xl font-bold mb-4">Terms & Conditions</h2>

      {/* Scrollable content */}
      <div
        className="h-64 overflow-y-auto border p-3 rounded"
        onScroll={(e) => {
          const { scrollTop, scrollHeight, clientHeight } = e.target;
          if (scrollTop + clientHeight >= scrollHeight - 5) {
            setHasScrolled(true);
          }
        }}
      >
        <p className="text-sm text-gray-600">
          ✅ Replace this with your Terms and Conditions text.  
          User must scroll to the bottom before enabling Close.  
          Add your PG policies, rules, etc. here.
        </p>
      </div>

      {/* Close button - outside scroll box */}
      <div className="mt-4 flex justify-end">
        <button
          className={`px-4 py-2 rounded-lg text-white ${
            hasScrolled
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!hasScrolled}
          onClick={() => {
            setAgreed(true);
            setIsModalOpen(false);
          }}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
};

export default Registration;
