import React, { useState } from 'react';
import { 
  FaFileInvoice, 
  FaArrowLeft, 
  FaUser, 
  FaCar, 
  FaTools, 
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaInfoCircle,
  FaExclamationCircle
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Constants for vehicle brands
const vehicleBrands = [
  'Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Hyundai', 'Kia',
  'Mazda', 'Mitsubishi', 'Nissan', 'Suzuki', 'VinFast', 'Vinaxuki', 'Lexus',
  'Porsche', 'Bentley', 'Ferrari', 'Lamborghini', 'Rolls-Royce', 'Tesla'
];

// Form steps configuration
const formSteps = [
  {
    id: 'customer',
    title: 'Thông tin khách hàng',
    icon: <FaUser className="mr-2" />
  },
  {
    id: 'vehicle',
    title: 'Thông tin xe',
    icon: <FaCar className="mr-2" />
  },
  {
    id: 'service',
    title: 'Dịch vụ & Ghi chú',
    icon: <FaTools className="mr-2" />
  },
  {
    id: 'confirm',
    title: 'Xác nhận',
    icon: <FaCheckCircle className="mr-2" />
  }
];

// Service type options
const serviceTypes = [
  { id: 'maintenance', name: 'Bảo dưỡng định kỳ' },
  { id: 'repair', name: 'Sửa chữa' },
  { id: 'inspection', name: 'Kiểm tra' },
  { id: 'accident', name: 'Sửa chữa tai nạn' },
  { id: 'other', name: 'Khác' },
];

// Validation rules for each step
const validateStep = (stepId, data) => {
  const errors = {};
  
  // Customer info validation
  if (stepId === 'customer') {
    if (!data.customerName?.trim()) {
      errors.customerName = 'Vui lòng nhập tên khách hàng';
    }
    if (!data.customerPhone?.trim()) {
      errors.customerPhone = 'Vui lòng nhập số điện thoại';
    } else if (!/^(\+?84|0)[1-9][0-9]{8}$/.test(data.customerPhone)) {
      errors.customerPhone = 'Số điện thoại không hợp lệ';
    }
    if (data.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customerEmail)) {
      errors.customerEmail = 'Email không hợp lệ';
    }
  }
  
  // Vehicle info validation
  else if (stepId === 'vehicle') {
    if (!data.licensePlate?.trim()) {
      errors.licensePlate = 'Vui lòng nhập biển số xe';
    }
    if (!data.vehicleBrand?.trim()) {
      errors.vehicleBrand = 'Vui lòng chọn hãng xe';
    }
    if (!data.vehicleModel?.trim()) {
      errors.vehicleModel = 'Vui lòng nhập dòng xe';
    }
    if (data.odometer && isNaN(Number(data.odometer))) {
      errors.odometer = 'Số km phải là số';
    }
  }
  
  // Service info validation
  else if (stepId === 'service') {
    if (!data.serviceType) {
      errors.serviceType = 'Vui lòng chọn loại dịch vụ';
    }
    if (!data.initialDescription?.trim()) {
      errors.initialDescription = 'Vui lòng mô tả tình trạng ban đầu';
    }
  }
  
  return errors;
};

// Notification component
const Notification = ({ type, message, onClose }) => (
  <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
    type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' :
    type === 'error' ? 'bg-red-100 text-red-800 border-l-4 border-red-500' :
    'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
  }`}>
    <div className="flex items-center">
      {type === 'success' ? (
        <FaCheckCircle className="mr-2 text-green-500" />
      ) : type === 'error' ? (
        <FaExclamationCircle className="mr-2 text-red-500" />
      ) : (
        <FaInfoCircle className="mr-2 text-blue-500" />
      )}
      <span>{message}</span>
      <button 
        onClick={onClose}
        className="ml-4 text-gray-500 hover:text-gray-700"
      >
        &times;
      </button>
    </div>
  </div>
);

const ReceptionForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestedBrands, setSuggestedBrands] = useState([]);
  const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    // Customer info
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    
    // Vehicle info
    licensePlate: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: new Date().getFullYear(),
    odometer: '',
    
    // Service info
    serviceType: '',
    serviceDescription: '',
    initialDescription: '',
    
    // System
    receptionDate: new Date().toISOString().slice(0, 10),
    expectedCompletion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Handle brand suggestions
    if (name === 'vehicleBrand') {
      if (value.length > 1) {
        const filtered = vehicleBrands.filter(brand => 
          brand.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestedBrands(filtered);
        setShowBrandSuggestions(true);
      } else {
        setShowBrandSuggestions(false);
      }
    }
  };

  // Handle brand selection from suggestions
  const handleBrandSelect = (brand) => {
    setFormData(prev => ({
      ...prev,
      vehicleBrand: brand,
    }));
    setShowBrandSuggestions(false);
  };

  // Handle next step
  const handleNext = () => {
    const currentStepId = formSteps[currentStep].id;
    const validationErrors = validateStep(currentStepId, formData);
    
    if (Object.keys(validationErrors).length === 0) {
      setErrors({});
      setCurrentStep(prev => Math.min(prev + 1, formSteps.length - 1));
    } else {
      setErrors(validationErrors);
      showNotificationMessage('error', 'Vui lòng điền đầy đủ thông tin yêu cầu');
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  // Show notification
  const showNotificationMessage = (type, message) => {
    setNotification({ type, message });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Form Submitted:', formData);
      showNotificationMessage('success', 'Đã tạo phiếu tiếp nhận thành công!');
      
      // Reset form after successful submission
      setTimeout(() => {
        navigate('/staff/dashboard');
      }, 1500);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      showNotificationMessage('error', 'Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render form steps progress
  const renderProgressSteps = () => (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {formSteps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center w-1/4">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                currentStep === index 
                  ? 'bg-blue-500 text-white' 
                  : currentStep > index 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
              }`}
            >
              {currentStep > index ? <FaCheckCircle /> : index + 1}
            </div>
            <span className={`text-sm text-center ${
              currentStep === index ? 'font-semibold text-blue-600' : 'text-gray-600'
            }`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-500 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${(currentStep + 1) * 25}%` }}
        ></div>
      </div>
    </div>
  );

  // Render customer info step
  const renderCustomerStep = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">Thông tin khách hàng</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.customerName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nhập họ và tên"
          />
          {errors.customerName && (
            <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
          <input
            type="tel"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.customerPhone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nhập số điện thoại"
          />
          {errors.customerPhone && (
            <p className="mt-1 text-sm text-red-600">{errors.customerPhone}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.customerEmail ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nhập email (nếu có)"
          />
          {errors.customerEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.customerEmail}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
          <input
            type="text"
            name="customerAddress"
            value={formData.customerAddress}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập địa chỉ (nếu có)"
          />
        </div>
      </div>
    </div>
  );

  // Render vehicle info step
  const renderVehicleStep = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">Thông tin xe</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Biển số xe <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="licensePlate"
            value={formData.licensePlate}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.licensePlate ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nhập biển số xe"
          />
          {errors.licensePlate && (
            <p className="mt-1 text-sm text-red-600">{errors.licensePlate}</p>
          )}
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Hãng xe <span className="text-red-500">*</span></label>
          <div className="relative">
            <input
              type="text"
              name="vehicleBrand"
              value={formData.vehicleBrand}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.vehicleBrand ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Tìm kiếm hãng xe"
              autoComplete="off"
            />
            {showBrandSuggestions && suggestedBrands.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                {suggestedBrands.map((brand, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleBrandSelect(brand)}
                  >
                    {brand}
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.vehicleBrand && (
            <p className="mt-1 text-sm text-red-600">{errors.vehicleBrand}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dòng xe <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="vehicleModel"
            value={formData.vehicleModel}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.vehicleModel ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ví dụ: Vios, Camry, CR-V..."
          />
          {errors.vehicleModel && (
            <p className="mt-1 text-sm text-red-600">{errors.vehicleModel}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Năm sản xuất</label>
          <select
            name="vehicleYear"
            value={formData.vehicleYear}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số km hiện tại</label>
          <div className="relative">
            <input
              type="text"
              name="odometer"
              value={formData.odometer}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.odometer ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nhập số km (nếu có)"
            />
            <span className="absolute right-3 top-3.5 text-gray-500">km</span>
          </div>
          {errors.odometer && (
            <p className="mt-1 text-sm text-red-600">{errors.odometer}</p>
          )}
        </div>
      </div>
    </div>
  );

  // Render service info step
  const renderServiceStep = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">Thông tin dịch vụ</h2>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Loại dịch vụ <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {serviceTypes.map(service => (
              <label 
                key={service.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.serviceType === service.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                <input
                  type="radio"
                  name="serviceType"
                  value={service.id}
                  checked={formData.serviceType === service.id}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border mr-3 flex-shrink-0 ${
                    formData.serviceType === service.id 
                      ? 'border-blue-500 bg-blue-500 flex items-center justify-center' 
                      : 'border-gray-400'
                  }`}>
                    {formData.serviceType === service.id && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span>{service.name}</span>
                </div>
              </label>
            ))}
          </div>
          {errors.serviceType && (
            <p className="mt-1 text-sm text-red-600">{errors.serviceType}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả tình trạng ban đầu <span className="text-red-500">*</span></label>
          <textarea
            name="initialDescription"
            value={formData.initialDescription}
            onChange={handleChange}
            rows={4}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.initialDescription ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Mô tả chi tiết tình trạng xe và yêu cầu của khách hàng..."
          ></textarea>
          {errors.initialDescription && (
            <p className="mt-1 text-sm text-red-600">{errors.initialDescription}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú thêm</label>
          <textarea
            name="serviceDescription"
            value={formData.serviceDescription}
            onChange={handleChange}
            rows={2}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ghi chú thêm (nếu có)..."
          ></textarea>
        </div>
      </div>
    </div>
  );

  // Render confirmation step
  const renderConfirmationStep = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaCheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              Vui lòng kiểm tra lại thông tin trước khi gửi yêu cầu.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Thông tin khách hàng</h3>
        </div>
        <div className="px-6 py-4">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Họ và tên</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.customerName || 'Chưa có thông tin'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Số điện thoại</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.customerPhone || 'Chưa có thông tin'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.customerEmail || 'Chưa có thông tin'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Địa chỉ</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.customerAddress || 'Chưa có thông tin'}</dd>
            </div>
          </dl>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Thông tin xe</h3>
        </div>
        <div className="px-6 py-4">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Biển số xe</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.licensePlate || 'Chưa có thông tin'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Hãng xe</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.vehicleBrand || 'Chưa có thông tin'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Dòng xe</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.vehicleModel || 'Chưa có thông tin'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Năm sản xuất</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.vehicleYear || 'Chưa có thông tin'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Số km hiện tại</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.odometer ? `${formData.odometer} km` : 'Chưa có thông tin'}
              </dd>
            </div>
          </dl>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Thông tin dịch vụ</h3>
        </div>
        <div className="px-6 py-4">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Loại dịch vụ</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {serviceTypes.find(s => s.id === formData.serviceType)?.name || 'Chưa có thông tin'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Mô tả tình trạng</dt>
              <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                {formData.initialDescription || 'Chưa có thông tin'}
              </dd>
            </div>
            {formData.serviceDescription && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Ghi chú thêm</dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {formData.serviceDescription}
                </dd>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Ngày tiếp nhận</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(formData.receptionDate).toLocaleDateString('vi-VN')}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Dự kiến hoàn thành</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(formData.expectedCompletion).toLocaleDateString('vi-VN')}
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );

  // Render current step content
  const renderStepContent = () => {
    const currentStepId = formSteps[currentStep].id;
    
    switch (currentStepId) {
      case 'customer':
        return renderCustomerStep();
      case 'vehicle':
        return renderVehicleStep();
      case 'service':
        return renderServiceStep();
      case 'confirm':
        return renderConfirmationStep();
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => navigate('/staff/dashboard')}
                  className="text-gray-500 hover:text-gray-700 mr-4"
                >
                  <FaArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                  Tạo phiếu tiếp nhận xe
                </h1>
              </div>
              <div className="text-sm text-gray-500">
                Bước {currentStep + 1} / {formSteps.length}
              </div>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="px-6 py-4 border-b border-gray-200">
            {renderProgressSteps()}
          </div>
          
          {/* Form Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {renderStepContent()}
              
              {/* Navigation Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentStep === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FaChevronLeft className="mr-2 h-4 w-4" />
                  Quay lại
                </button>
                
                {currentStep < formSteps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Tiếp theo
                    <FaChevronRight className="ml-2 h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="mr-2 h-4 w-4" />
                        Xác nhận tạo phiếu
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Notification */}
      {showNotification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
};

export default ReceptionForm;
