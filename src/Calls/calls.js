
const firstpath = "http://localhost/sparesort-api/router/router.php";
const secondpath = "http://localhost/phpopdrachten/derde_jaar/sparesort-api/router/router.php";
let currentpath = firstpath;

const apiCall = async (usedFunction, dataSend) => {
    try {
        const response = await fetch(
            currentpath,
            {
                method: "POST",
                credentials: "include", // dit zorgt voor dat cookies meegestuurd worden (voor sessions blijkbaar)
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    function: usedFunction,
                    data: dataSend,
                }),
            });

        const data = await response.json();

        if (data.success) {
            return {
                isSuccess: true,
                message: data.message,
                data: data.data || null
            };

        } else {
            return {
                isSuccess: false,
                message: data.message,
                data: data.data || null
            };
        }
    } catch (error) {
        if (currentpath === firstpath) {
            currentpath = secondpath;
            return apiCall(usedFunction, dataSend);
        }
        return {
            isSuccess: false,
            message: error.message,
            data: null,
        };
        
    }
};


export default apiCall;