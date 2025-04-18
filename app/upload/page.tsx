'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface ExtractionResult {
    documentType?: string;
    petitionType?: string;
    courtName?: string;
    bench?: string[];
    caseTitle?: string;
    caseNumber?: string;
    filedDate?: string;
    dateOfJudgment?: string;
    caseStatus?: string;
    partiesInvolved?: {
        petitioner?: string;
        respondent?: string;
    };
    advocates?: string[];
    legalIssues?: string[];
    citations?: string[];
    statutes?: string[];
    relevantRules?: string[];
    reliefSought?: string;
    verdict?: string;
    damagesAwarded?: string;
    deadlines?: string[];
    nextHearingDate?: string;
    keywords?: string[];
    relatedCases?: string[];
}

const DocumentUploader = () => {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            if (file.type === 'application/pdf' ||
                file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                file.type.startsWith('image/')) {
                setUploadedFile(file);
                setError('');
            } else {
                setError('Please upload a PDF, Word document, or image file.');
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'image/*': ['.png', '.jpg', '.jpeg']
        },
        maxFiles: 1
    });

    const handleSubmit = async () => {
        if (!uploadedFile) {
            setError('Please upload a document or image.');
            return;
        }

        setLoading(true);
        setError('');
        setExtractionResult(null);

        const formData = new FormData();
        formData.append('file', uploadedFile);

        try {
            const response = await fetch('/api/analyser-ap', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to analyze document.');
            }

            const data = await response.json();
            try {
                const parsedResult = JSON.parse(data.result);
                setExtractionResult(parsedResult);
            } catch (e) {
                setError('Failed to parse the analysis results.');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderValue = (value: any) => {
        if (Array.isArray(value)) {
            return value.length > 0 ? (
                <ul className="list-disc list-inside mt-1 space-y-1">
                    {value.map((item, index) => (
                        <li key={index} className="text-gray-600">{String(item)}</li>
                    ))}
                </ul>
            ) : null;
        }
        if (typeof value === 'object' && value !== null) {
            return (
                <div className="mt-1 space-y-1">
                    {Object.entries(value).map(([subKey, subValue]) => (
                        <p key={subKey} className="text-gray-600">
                            <span className="font-medium">{subKey}:</span> {String(subValue)}
                        </p>
                    ))}
                </div>
            );
        }
        return value ? <p className="text-gray-600 mt-1">{String(value)}</p> : null;
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Legal Document Analyzer</h1>

            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                    ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p className="text-blue-500">Drop the file here ...</p>
                ) : (
                    <div>
                        <p className="text-gray-600">Drag 'n' drop a document here, or click to select</p>
                        <p className="text-sm text-gray-500 mt-2">Supported formats: PDF, Word (.docx), Images</p>
                    </div>
                )}
            </div>

            {uploadedFile && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">Selected file: {uploadedFile.name}</p>
                </div>
            )}

            <button
                onClick={handleSubmit}
                disabled={loading || !uploadedFile}
                className={`mt-4 w-full py-2 px-4 rounded-md text-white font-medium
                    ${loading || !uploadedFile
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                {loading ? 'Analyzing...' : 'Analyze Document'}
            </button>

            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {extractionResult && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
                    <div className="bg-white rounded-lg shadow p-6 space-y-6">
                        {Object.entries(extractionResult).map(([key, value]) => {
                            if (!value) return null;

                            const formattedKey = key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, str => str.toUpperCase());

                            return (
                                <div key={key} className="border-b pb-4">
                                    <h3 className="font-medium text-gray-800 mb-2">{formattedKey}</h3>
                                    {renderValue(value)}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentUploader;