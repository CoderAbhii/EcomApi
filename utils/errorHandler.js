const errorHandler = (errorController, error, res) => {
    console.error(errorController, error);
        error.name === "ValidationError"? res.status(404).json({
            success: false, errorMessage: error.message
        }) : 
        res.status(500).json({
            success: false,
            errorMessage: "Internal Server Error"
        });
}

module.exports = errorHandler;