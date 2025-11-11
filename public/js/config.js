// API Configuration for Local and AWS Deployment
const config = {
    // Local development URL
    LOCAL: 'http://localhost:3000',
    
    // AWS EC2 URL - Update this with your EC2 instance IP address
    AWS: 'http://YOUR_EC2_IP:3000',
    
    // Auto-detect environment
    getApiUrl: function() {
        // If hostname is localhost or 127.0.0.1, use local API
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return this.LOCAL;
        }
        // Otherwise, use AWS API
        return this.AWS;
    }
};

// Export the base API URL
const API_URL = config.getApiUrl();
