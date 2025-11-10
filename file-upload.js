// File Upload and Processing Utility
// Supports CSV, Excel (.xlsx), and PDF files

class FileUploadHandler {
    constructor() {
        this.supportedFormats = {
            csv: ['text/csv', 'application/vnd.ms-excel', 'text/plain'],
            excel: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
            pdf: ['application/pdf']
        };
    }

    /**
     * Create a file upload component
     * @param {Object} options - Configuration options
     * @returns {HTMLElement} - File upload element
     */
    createUploadComponent(options = {}) {
        const {
            containerId = 'file-upload-container',
            acceptedTypes = '.csv,.xlsx,.xls,.pdf',
            onFileSelect = null,
            onFileError = null,
            multiple = false,
            label = 'Choose File',
            buttonClass = 'btn btn-primary'
        } = options;

        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Container not found:', containerId);
            return null;
        }

        const uploadHTML = `
            <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-radius: 20px; padding: 2rem; border: 2px solid rgba(255, 255, 255, 0.3); margin: 2rem 0;">
                <h3 style="color: white; margin-bottom: 1.5rem;">
                    <i class="fas fa-upload"></i> Upload File
                </h3>
                <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                    <div>
                        <label for="file-input-${containerId}" style="display: block; color: white; margin-bottom: 0.5rem; font-weight: 600;">
                            <i class="fas fa-file"></i> Select ${this.getSupportedFormatsText(acceptedTypes)}
                        </label>
                        <input 
                            type="file" 
                            id="file-input-${containerId}" 
                            accept="${acceptedTypes}"
                            ${multiple ? 'multiple' : ''}
                            style="display: none;"
                        />
                        <button 
                            onclick="document.getElementById('file-input-${containerId}').click()" 
                            class="${buttonClass}"
                            style="width: 100%; max-width: 300px;"
                        >
                            <i class="fas fa-cloud-upload-alt"></i> ${label}
                        </button>
                        <p id="file-info-${containerId}" style="color: rgba(255, 255, 255, 0.8); margin-top: 0.5rem; font-size: 0.9rem;">
                            No file selected
                        </p>
                    </div>
                    <div id="file-preview-${containerId}"></div>
                </div>
            </div>
        `;

        container.innerHTML = uploadHTML;

        const fileInput = document.getElementById(`file-input-${containerId}`);
        const fileInfo = document.getElementById(`file-info-${containerId}`);
        const filePreview = document.getElementById(`file-preview-${containerId}`);

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleFileSelect(file, fileInfo, filePreview, onFileSelect, onFileError);
            }
        });

        return container;
    }

    getSupportedFormatsText(acceptedTypes) {
        const types = acceptedTypes.toLowerCase();
        const formats = [];
        if (types.includes('csv')) formats.push('CSV');
        if (types.includes('xlsx') || types.includes('xls')) formats.push('Excel');
        if (types.includes('pdf')) formats.push('PDF');
        return formats.join(', ');
    }

    async handleFileSelect(file, fileInfoElement, previewElement, onFileSelect, onFileError) {
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        fileInfoElement.innerHTML = `
            <i class="fas fa-file"></i> ${file.name} (${fileSize} MB)
            <br><span style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.6);">${file.type || 'Unknown type'}</span>
        `;

        try {
            const extension = file.name.split('.').pop().toLowerCase();
            
            if (this.supportedFormats.csv.includes(file.type) || extension === 'csv') {
                const data = await this.readCSVFile(file);
                if (onFileSelect) onFileSelect(data, file, 'csv');
                this.showPreview(previewElement, data, 'csv');
            } else if (this.supportedFormats.excel.includes(file.type) || extension === 'xlsx' || extension === 'xls') {
                const data = await this.readExcelFile(file);
                if (onFileSelect) onFileSelect(data, file, 'excel');
                this.showPreview(previewElement, data, 'excel');
            } else if (this.supportedFormats.pdf.includes(file.type) || extension === 'pdf') {
                const data = await this.readPDFFile(file);
                if (onFileSelect) onFileSelect(data, file, 'pdf');
                this.showPreview(previewElement, data, 'pdf');
            } else {
                throw new Error('Unsupported file format');
            }
        } catch (error) {
            fileInfoElement.innerHTML = `<span style="color: #ff6b6b;">Error: ${error.message}</span>`;
            if (onFileError) onFileError(error);
        }
    }

    async readCSVFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                const lines = text.split('\n');
                const headers = lines[0].split(',').map(h => h.trim());
                const data = lines.slice(1).map(line => {
                    const values = line.split(',').map(v => v.trim());
                    const obj = {};
                    headers.forEach((header, index) => {
                        obj[header] = values[index] || '';
                    });
                    return obj;
                }).filter(row => Object.values(row).some(v => v !== ''));
                
                resolve({ headers, data, raw: text });
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    async readExcelFile(file) {
        // Note: For Excel parsing in the browser, you would need a library like SheetJS
        // This is a placeholder that shows the file info
        return new Promise((resolve) => {
            resolve({
                filename: file.name,
                size: file.size,
                message: 'Excel file uploaded. For full Excel parsing, consider using SheetJS library.',
                note: 'To enable Excel parsing, add: <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>'
            });
        });
    }

    async readPDFFile(file) {
        // Note: For PDF reading in the browser, you would need a library like PDF.js
        // This is a placeholder that shows the file info
        return new Promise((resolve) => {
            resolve({
                filename: file.name,
                size: file.size,
                message: 'PDF file uploaded. For PDF text extraction, consider using PDF.js.',
                note: 'To enable PDF parsing, add: <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.min.js"></script>'
            });
        });
    }

    showPreview(container, data, type) {
        if (type === 'csv' && data.data) {
            const table = this.createDataTable(data.headers, data.data);
            container.innerHTML = `
                <div style="background: rgba(0, 0, 0, 0.3); padding: 1.5rem; border-radius: 15px; overflow-x: auto;">
                    <h4 style="color: white; margin-bottom: 1rem;">
                        <i class="fas fa-table"></i> Preview (${data.data.length} rows)
                    </h4>
                    ${table}
                </div>
            `;
        } else {
            container.innerHTML = `
                <div style="background: rgba(0, 0, 0, 0.3); padding: 1.5rem; border-radius: 15px;">
                    <p style="color: white;"><strong>File:</strong> ${data.filename || 'Unknown'}</p>
                    <p style="color: white;"><strong>Size:</strong> ${(data.size / 1024).toFixed(2)} KB</p>
                    <p style="color: rgba(255, 255, 255, 0.8); font-style: italic;">${data.message || ''}</p>
                    ${data.note ? `<p style="color: #ffd700; font-size: 0.9rem; margin-top: 0.5rem;">${data.note}</p>` : ''}
                </div>
            `;
        }
    }

    createDataTable(headers, data) {
        if (data.length === 0) return '<p style="color: white;">No data to display</p>';
        
        const limitedData = data.slice(0, 10); // Show first 10 rows
        
        let table = `
            <table style="width: 100%; border-collapse: collapse; color: white; font-size: 0.9rem;">
                <thead>
                    <tr style="background: rgba(255, 255, 255, 0.1);">
                        ${headers.map(h => `<th style="padding: 0.8rem; text-align: left; border-bottom: 2px solid rgba(255, 255, 255, 0.3);">${h}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
        `;
        
        limitedData.forEach((row, index) => {
            table += `<tr ${index % 2 === 0 ? 'style="background: rgba(255, 255, 255, 0.05);"' : ''}>`;
            headers.forEach(header => {
                table += `<td style="padding: 0.8rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">${row[header] || '-'}</td>`;
            });
            table += `</tr>`;
        });
        
        table += `
                </tbody>
            </table>
        `;
        
        if (data.length > 10) {
            table += `<p style="color: rgba(255, 255, 255, 0.8); margin-top: 1rem; text-align: center;">
                Showing first 10 of ${data.length} rows
            </p>`;
        }
        
        return table;
    }

    /**
     * Parse fixtures from uploaded data
     * @param {Object} data - Parsed file data
     * @returns {Array} - Array of fixture objects
     */
    parseFixtures(data) {
        if (!data || !data.data || !data.headers) {
            return [];
        }

        const fixtures = [];
        data.data.forEach((row, index) => {
            const fixture = {
                id: index + 1,
                match: index + 1,
                date: row['Date'] || row['date'] || '',
                team1: row['Team 1'] || row['team1'] || '',
                team2: row['Team 2'] || row['team2'] || '',
                venue: row['Venue'] || row['venue'] || '',
                time: row['Time'] || row['time'] || '',
                status: row['Status'] || row['status'] || 'upcoming'
            };
            fixtures.push(fixture);
        });

        return fixtures;
    }

    /**
     * Parse points table from uploaded data
     * @param {Object} data - Parsed file data
     * @returns {Array} - Array of team objects
     */
    parsePointsTable(data) {
        if (!data || !data.data || !data.headers) {
            return [];
        }

        const teams = [];
        data.data.forEach((row, index) => {
            const team = {
                name: row['Team'] || row['team'] || '',
                shortName: row['Short Name'] || row['shortName'] || '',
                played: parseInt(row['Played'] || row['played'] || 0),
                won: parseInt(row['Won'] || row['won'] || 0),
                lost: parseInt(row['Lost'] || row['lost'] || 0),
                nrr: parseFloat(row['NRR'] || row['nrr'] || 0),
                points: parseInt(row['Points'] || row['points'] || 0)
            };
            teams.push(team);
        });

        return teams;
    }
}

// Make it globally available
window.FileUploadHandler = FileUploadHandler;

