// downloadApiCall.js - Separate function for file downloads

const downloadApiCall = async (usedFunction, dataSend, filename) => {
    try {
        const response = await fetch(
            "http://localhost/sparesort-api/router/router.php",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    function: usedFunction,
                    data: dataSend,
                }),
            }
        );

        // Check if response is OK
        if (!response.ok) {
            throw new Error('Download failed');
        }

        // Get the PDF as a blob (NOT JSON!)
        const blob = await response.blob();

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;

        // Trigger download
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return {
            isSuccess: true,
            message: 'Download successful'
        };

    } catch (error) {
        console.error('Download error:', error);
        return {
            isSuccess: false,
            message: error.message
        };
    }
};

export default downloadApiCall;