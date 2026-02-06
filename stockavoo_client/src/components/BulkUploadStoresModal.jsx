import { useState } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useBulkCreateStoresMutation } from '../store/api/storeApi';
import { Modal, Button } from './common';
import { useToast } from '../contexts/ToastContext';

/**
 * BULK UPLOAD STORES MODAL
 *
 * Modal for uploading multiple stores via CSV file.
 * Provides CSV template download and upload with validation.
 */
const BulkUploadStoresModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [uploadResult, setUploadResult] = useState(null);
  const [bulkCreate, { isLoading }] = useBulkCreateStoresMutation();

  // CSV template
  const csvTemplate = `name,phoneNumber,email,description,taxRate,currency,street,city,state,country,postalCode
Main Branch,+234 XXX XXX XXXX,main@example.com,Our primary store location,7.5,NGN,123 Main Street,Lagos,Lagos,Nigeria,100001
Downtown Store,+234 XXX XXX XXXX,downtown@example.com,City center location,7.5,NGN,456 Market Road,Abuja,FCT,Nigeria,900001
Westside Branch,+234 XXX XXX XXXX,westside@example.com,West area store,7.5,NGN,789 West Avenue,Port Harcourt,Rivers,Nigeria,500001`;

  // Download CSV template
  const downloadTemplate = () => {
    const blob = new Blob([csvTemplate], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stores_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded successfully');
  };

  // Parse CSV file
  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      throw new Error('CSV file must contain headers and at least one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const stores = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const store = {};

      headers.forEach((header, index) => {
        store[header] = values[index] || '';
      });

      // Convert taxRate to number
      if (store.taxRate) {
        store.taxRate = parseFloat(store.taxRate);
      }

      stores.push(store);
    }

    return stores;
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      toast.error('Please upload a valid CSV file');
      return;
    }

    setFile(selectedFile);
    setUploadResult(null);

    // Read and parse file
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const stores = parseCSV(event.target.result);
        setParsedData(stores);
        toast.success(`Parsed ${stores.length} store(s) from CSV`);
      } catch (error) {
        toast.error(`Error parsing CSV: ${error.message}`);
        setFile(null);
        setParsedData([]);
      }
    };
    reader.readAsText(selectedFile);
  };

  // Handle upload
  const handleUpload = async () => {
    if (parsedData.length === 0) {
      toast.error('No data to upload');
      return;
    }

    try {
      const result = await bulkCreate(parsedData).unwrap();
      setUploadResult(result.data);

      if (result.data.failed.length === 0) {
        toast.success(`Successfully created ${result.data.successful.length} store(s)!`);
      } else {
        toast.warning(
          `Created ${result.data.successful.length} store(s). ${result.data.failed.length} failed.`
        );
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to upload stores');
    }
  };

  // Reset and close
  const handleClose = () => {
    setFile(null);
    setParsedData([]);
    setUploadResult(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Bulk Upload Stores"
      subtitle="Upload multiple stores at once using a CSV file"
      icon={<Upload className="w-6 h-6" />}
      size="lg"
    >
      <div className="p-6 space-y-6">
        {/* Instructions */}
        <div className="bg-[#7C3E8C]/5 border-l-4 border-[#7C3E8C] p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-[#7C3E8C] mt-0.5 shrink-0" />
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">How to upload stores</h4>
              <ol className="text-sm text-slate-700 space-y-1 list-decimal list-inside">
                <li>Download the CSV template below</li>
                <li>Fill in your store information in the template</li>
                <li>Upload the completed CSV file</li>
                <li>Review and confirm the upload</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Download Template */}
        <div>
          <Button
            onClick={downloadTemplate}
            variant="outline"
            className="w-full"
          >
            <Download className="w-4 h-4" />
            Download CSV Template
          </Button>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Upload CSV File
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-[#7C3E8C]/10 file:text-[#7C3E8C]
                hover:file:bg-[#7C3E8C]/20
                cursor-pointer"
            />
          </div>
          {file && (
            <p className="mt-2 text-sm text-slate-600">
              Selected: {file.name} ({parsedData.length} stores)
            </p>
          )}
        </div>

        {/* Preview */}
        {parsedData.length > 0 && !uploadResult && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-2">Preview</h4>
            <div className="max-h-48 overflow-y-auto">
              <ul className="text-sm text-slate-600 space-y-1">
                {parsedData.slice(0, 5).map((store, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                    {store.name} - {store.phoneNumber}
                  </li>
                ))}
                {parsedData.length > 5 && (
                  <li className="text-slate-500 italic">
                    ... and {parsedData.length - 5} more
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Upload Result */}
        {uploadResult && (
          <div className="space-y-3">
            {/* Summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-3">Upload Summary</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {uploadResult.summary.total}
                  </div>
                  <div className="text-xs text-slate-600">Total</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {uploadResult.summary.successful}
                  </div>
                  <div className="text-xs text-slate-600">Successful</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {uploadResult.summary.failed}
                  </div>
                  <div className="text-xs text-slate-600">Failed</div>
                </div>
              </div>
            </div>

            {/* Failed Items */}
            {uploadResult.failed.length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-900 mb-2">
                      Failed Items ({uploadResult.failed.length})
                    </h4>
                    <div className="max-h-32 overflow-y-auto">
                      <ul className="text-sm text-red-800 space-y-1">
                        {uploadResult.failed.map((item, index) => (
                          <li key={index}>
                            Row {item.row}: {item.error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <Button
            type="button"
            onClick={handleClose}
            variant="secondary"
            disabled={isLoading}
          >
            {uploadResult ? 'Close' : 'Cancel'}
          </Button>
          {!uploadResult && (
            <Button
              onClick={handleUpload}
              variant="primary"
              disabled={isLoading || parsedData.length === 0}
              isLoading={isLoading}
            >
              {!isLoading && <Upload className="w-4 h-4" />}
              Upload {parsedData.length} Store(s)
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default BulkUploadStoresModal;
